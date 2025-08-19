let _getToken = null;
let inflightPromise = null;
let inflightAt = 0;

export function setAuthTokenProvider(fn) {
  _getToken = typeof fn === "function" ? fn : null;
}

export function clearAuthTokenProvider() {
  _getToken = null;
}

/**
 * Get the authentication token
 * @param {*} opt
 * @param {boolean} opt.force - Force a refresh of the token
 * @param {boolean} opt.skipCache - Skip the cache and fetch a new token
 * @returns
 */
export async function getAuthToken(opt = {}) {
  const { force = false, skipCache = false } = opt;
  const now = Date.now();
  if (inflightPromise && now - inflightAt < 200) {
    return inflightPromise;
  }
  if (typeof _getToken !== "function") {
    return null;
  }
  inflightAt = now;
  const p = Promise.resolve().then(() =>
    _getToken({ skipCache: skipCache ?? force })
  );
  inflightPromise = p;
  if (typeof _getToken === "function") {
    try {
      const token = await p;
      return token ?? null;
    } finally {
      if (inflightPromise === p) {
        inflightPromise = null;
      }
    }
  }
  return null;
}
