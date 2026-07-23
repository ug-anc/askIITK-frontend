const rawApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim() || process.env.API_URL?.trim();

if (!rawApiUrl) {
  throw new Error("NEXT_PUBLIC_API_URL (or API_URL) environment variable is not set.");
}

export const API_BASE_URL = rawApiUrl.replace(/\/+$/, "");

export const API_QUERY_URL = `${API_BASE_URL}/api/v1/query`;
export const API_FEEDBACK_URL = `${API_BASE_URL}/api/v1/feedback`;
export const API_SESSIONS_URL = `${API_BASE_URL}/api/v1/sessions`;
