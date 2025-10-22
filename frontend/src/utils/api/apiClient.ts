const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export class ApiError extends Error {
  public data: unknown;
  public status: number;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

interface ApiClientOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

async function apiClient<T>(
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<T> {
  const { body, ...customConfig } = options;
  const config: RequestInit = {
    method: body ? "POST" : "GET",
    ...customConfig,
    headers: {
      "Content-Type": "application/json",
      ...customConfig.headers,
    },
  };
  if (body) config.body = JSON.stringify(body);
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    if (!response.ok) {
      throw new ApiError(
        data.message || "An unexpected error occurred",
        response.status,
        data
      );
    }
    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error((error as Error).message || "An unexpected error occurred");
  }
}

export const api = {
  get: <T>(endpoint: string, config?: Omit<ApiClientOptions, "body">) =>
    apiClient<T>(endpoint, { ...config, method: "GET" }),
  post: <T>(
    endpoint: string,
    body: unknown,
    config?: Omit<ApiClientOptions, "body">
  ) => apiClient<T>(endpoint, { ...config, method: "POST", body }),
};

export function isBackendError(
  data: unknown
): data is { validationErrors: Record<string, string>[] } {
  if (typeof data !== "object" || data === null) return false;
  if (!("validationErrors" in data)) return false;
  const errors = (data as { validationErrors: unknown }).validationErrors;
  return (
    typeof errors === "object" && errors !== null && !Array.isArray(errors)
  );
}
