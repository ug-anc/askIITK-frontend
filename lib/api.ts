const DEFAULT_API_URL = "https://askiitk-greetings-306291778036.asia-south2.run.app";

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim() || process.env.API_URL?.trim();

export const API_BASE_URL = rawApiUrl?.replace(/\/+$/, "") || DEFAULT_API_URL;

export const API_QUERY_URL = `${API_BASE_URL}/api/v1/query`;
export const API_FEEDBACK_URL = `${API_BASE_URL}/api/v1/feedback`;
export const API_SESSIONS_URL = `${API_BASE_URL}/api/v1/sessions`;
