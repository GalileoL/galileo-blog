// This file provides a secondary encapsulation of axios
import axios from "axios";
// query string
import qs from "qs";
import { getAuthToken } from "../auth/tokenProvider";

const baseURL = import.meta.env.VITE_API_URL || "";
const timeout = import.meta.env.VITE_API_TIMEOUT || 5000;

// debug switch: localStorage.setItem("HTTP_DEBUG","1") open, removeItem to close
const isHttpDebug = () => localStorage.getItem("HTTP_DEBUG") === "1";
const mask = (v) =>
  v && typeof v === "string"
    ? v.replace(/([A-Za-z0-9_\-]{6})[A-Za-z0-9_\-]+/g, "$1***")
    : v;
// ascending ID
let RID = 0;

export const http = axios.create({
  baseURL,
  timeout,
  // withCredentials: true,
  paramsSerializer: {
    // Use qs to stringify query parameters
    serialize: (params) =>
      qs.stringify(params, {
        arrayFormat: "brackets",
        skipNulls: true,
        sort: (a, b) => a.localeCompare(b),
      }),
  },
});

// request deduplication
const pendingRequests = new Map();
const genKey = (config) => {
  const { url, method, params, data } = config;
  return [
    method || "GET",
    url || "",
    qs.stringify(params || {}, {
      arrayFormat: "brackets",
      skipNulls: true,
      sort: (a, b) => a.localeCompare(b),
    }),
    typeof data === "string" ? data : JSON.stringify(data || {}),
  ].join("&");
};
function attachDedupe(config) {
  // set config._dedupe as false if we need to close dedupe
  if (config._dedupe === false) return config;
  const policy = config._dedupePolicy || "last"; // "first" | "last"
  const key = genKey(config);
  const prev = pendingRequests.get(key);

  if (prev) {
    if (policy === "first") {
      throw new axios.CanceledError("DEDUPED_FIRST_WINS");
    } else {
      prev.abort("DEDUPED");
    }
  }

  const controller = new AbortController();
  config.signal = controller.signal;
  pendingRequests.set(key, controller);
  config._dedupeKey = key;
  return config;
}
function clearDedupe(config) {
  const key = config?._dedupeKey;
  if (key) {
    pendingRequests.delete(key);
  }
}

// request interception, async interception, return promise
http.interceptors.request.use(async (cfg) => {
  if (cfg._withAuth === undefined) {
    cfg._withAuth = false;
  }

  cfg._dedupe = cfg._dedupe !== false;
  cfg._retries = typeof cfg._retries === "number" ? cfg._retries : 0;
  cfg._retryDelayBase =
    typeof cfg._retryDelayBase === "number" ? cfg._retryDelayBase : 300;

  // FormData
  const isForm =
    typeof FormData !== "undefined" && cfg.data instanceof FormData;
  if (!isForm) {
    cfg.headers = cfg.headers || {};
    if (!cfg.headers["Content-Type"]) {
      cfg.headers["Content-Type"] = "application/json";
    }
  }

  // Attach auth token
  // const { getToken } = useAuth();
  const token = await getAuthToken();
  // console.log("Auth token:", token);

  if (cfg._withAuth === true || (cfg._withAuth === "optional" && token)) {
    cfg.headers = cfg.headers || {};
    cfg.headers["Authorization"] = `Bearer ${token}`;
  }
  // Attach deduplication
  cfg = attachDedupe(cfg);

  cfg._rid = ++RID;
  cfg._t0 =
    typeof performance !== "undefined" && performance.now
      ? performance.now()
      : Date.now();
  if (isHttpDebug()) {
    const { method, baseURL, url, params, data, _dedupePolicy, _retries } = cfg;
    const fullUrl = baseURL ? new URL(url, baseURL).toString() : url;
    // 不展示完整 token
    const headers = { ...(cfg.headers || {}) };
    if (headers.Authorization)
      headers.Authorization = mask(headers.Authorization);

    console.groupCollapsed(
      `%cHTTP ↗ [${cfg._rid}] ${String(
        method || "GET"
      ).toUpperCase()} ${fullUrl}`,
      "color:#0B7285"
    );
    console.log("params:", params);
    console.log("data:", data instanceof FormData ? "[FormData]" : data);
    console.log(
      "dedupePolicy:",
      _dedupePolicy || "last",
      "retries:",
      _retries || 0
    );
    console.log("headers:", headers);
    console.groupEnd();
  }
  return cfg;
});

const logDone = (cfg, outcome, extra = {}) => {
  if (!isHttpDebug()) {
    return;
  }
  const t1 =
    typeof performance !== "undefined" && performance.now
      ? performance.now()
      : Date.now();
  const dt = cfg?._t0 != null ? (t1 - cfg._t0).toFixed(1) : "n/a";
  console.groupCollapsed(
    `%cHTTP ↙ [${cfg?._rid ?? "?"}] ${outcome} (${dt} ms)`,
    outcome === "OK" ? "color:#2B8A3E" : "color:#C92A2A"
  );
  console.log("config:", cfg);
  console.log("extra:", extra);
  console.groupEnd();
};

// response interception
http.interceptors.response.use(
  (res) => {
    clearDedupe(res.config);
    logDone(res.config, "OK", { status: res.status, data: res.data });
    return res.data;
  },
  async (error) => {
    const cfg = error.config || {};
    clearDedupe(cfg);
    if (axios.isCancel(error)) {
      logDone(cfg, "CANCELLED", { reason: error.message });
      return Promise.reject(error);
    }

    const status = error.response?.status;

    // 401: retake token and retry request, force skip token cache
    if (status === 401 && !cfg._retriedOnce && cfg._withAuth) {
      cfg._retriedOnce = true;
      const fresh = await getAuthToken({ force: true });
      if (fresh) {
        cfg.headers = cfg.headers || {};
        cfg.headers["Authorization"] = `Bearer ${fresh}`;
        logDone(cfg, "RETRYING 401", { status, code: "UNAUTHORIZED" });
        return http(cfg);
      }
      logDone(cfg, "UNAUTHORIZED 401", { status, code: "UNAUTHORIZED" });
      return Promise.reject({
        status,
        code: "UNAUTHORIZED",
        message: " Please sign in",
        raw: error,
      });
    }

    // Network Error or 5x: retry, 2 times at most
    const isNetwork = !error.response;
    const isAxios = !!error.isAxiosError;
    const retriable =
      isAxios && (isNetwork || status >= 500) && (cfg._retries || 0) < 2;
    if (retriable) {
      cfg._retries = (cfg._retries || 0) + 1;
      const delay =
        (cfg._retryDelayBase || 300) * Math.pow(2, cfg._retries - 1);
      logDone(cfg, "RETRYING SCHEDULED", {
        status: status ?? "NO_RESPONSE",
        attempt: cfg._retries,
        reason: error.message,
      });
      await new Promise((resolve) => setTimeout(resolve, delay));
      return http(cfg);
    }
    const uniqueError = {
      status,
      code: error?.response?.data?.code || "UNIQUE_ERROR",
      message:
        error?.response?.data?.message || error.message || "Unique Error",
      raw: error,
    };
    logDone(cfg, "FAIL", {
      status,
      code: uniqueError.code,
      message: uniqueError.message,
    });
    return Promise.reject(uniqueError);
  }
);
