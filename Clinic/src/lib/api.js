const DEFAULT_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

export class ApiError extends Error {
  constructor(message, status, code, details) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

async function parseJsonSafe(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export function createApiClient({ getToken }) {
  async function request(path, { method = "GET", body, headers } = {}) {
    const token = getToken?.();
    const res = await fetch(`${DEFAULT_BASE_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(headers || {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const payload = await parseJsonSafe(res);

    if (!res.ok) {
      const message = payload?.error?.message || `Request failed (${res.status})`;
      const code = payload?.error?.code;
      const details = payload?.error?.details;
      throw new ApiError(message, res.status, code, details);
    }

    return payload?.data ?? payload;
  }

  return {
    get: (path) => request(path),
    post: (path, body) => request(path, { method: "POST", body }),
    put: (path, body) => request(path, { method: "PUT", body }),
    del: (path) => request(path, { method: "DELETE" }),
  };
}

