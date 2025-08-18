// This file provides a secondary encapsulation of axios
import axios from "axios";
// query string
import qs from "qs";
import { useAuth } from "@clerk/clerk-react";

const baseURL = import.meta.env.VITE_API_URL || "";
const timeout = import.meta.env.VITE_API_TIMEOUT || 5000;

export const http = axios.create({
  baseURL,
  timeout,
  withCredentials: true,
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
      throw new axios.CanceledError("DEDEDUPED_FIRST_WINS");
    } else {
      prev.abort("DEDEDUPED");
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
  const { getToken } = useAuth();
  const token = await getToken();
  if (token) {
    cfg.headers = cfg.headers || {};
    cfg.headers["Authorization"] = `Bearer ${token}`;
  }
  // Attach deduplication
  cfg = attachDedupe(cfg);
  return cfg;
});

// response interception
http.interceptors.response.use(
  (res) => {
    clearDedupe(res.config);
    return res.data;
  },
  async (error) => {
    const cfg = error.config || {};
    clearDedupe(cfg);
    if (axios.isCancel(error)) return Promise.reject(error);

    const status = error.response?.status;

    // 401: retake token and retry request
    if (status === 401 && !cfg._retriedOnce) {
      cfg._retriedOnce = true;
      const token = await getToken();
      if (token) {
        cfg.headers = cfg.headers || {};
        cfg.headers["Authorization"] = `Bearer ${token}`;
        return http(cfg);
      }
      return Promise.reject({
        status,
        code: "UNAUTHORIZED",
        message: " Please sign in",
        raw: error,
      });
    }

    // Network Error or 5x: retry, 2 times at most
    const retriable = (!status || status >= 500) && (cfg._retries || 0) < 2;
    if (retriable) {
      cfg._retries = (cfg._retries || 0) + 1;
      const delay =
        (cfg._retryDelayBase || 300) * Math.pow(2, cfg._retries - 1);
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
    return Promise.reject(uniqueError);
  }
);
