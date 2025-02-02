import envConfig from "@/config";

// API Response Types
export interface LoginResType {
  data: {
    "account-info": {
      "full-name": string;
      email: string;
      "phone-number": string;
      role: string;
      avatar: string;
    };
    token: {
      access_token: string;
      access_token_exp_in: number;
    };
  };
  status: number;
}

// Error Types
type EntityErrorPayload = {
  message: string;
  errors: Array<{
    field: string;
    message: string;
  }>;
};

// HTTP Client Configuration
export const isClient = () => typeof window !== "undefined";
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type CustomOptions = Omit<RequestInit, "method"> & {
  baseUrl?: string;
};

// Custom Error Classes
export class HttpError extends Error {
  constructor(
    public status: number,
    public payload: { message: string; [key: string]: any }
  ) {
    super("HTTP Request Failed");
  }
}

export class EntityError extends HttpError {
  constructor(payload: EntityErrorPayload) {
    super(422, payload);
  }
}

// Core Request Function
async function request<T>(
  method: HttpMethod,
  url: string,
  options?: CustomOptions
) {
  const body =
    options?.body instanceof FormData
      ? options.body
      : options?.body
      ? JSON.stringify(options.body)
      : undefined;

  const baseHeaders: { [key: string]: string } =
    body instanceof FormData ? {} : { "Content-Type": "application/json" };

  if (typeof window !== "undefined") {
    const sessionToken = localStorage.getItem("sessionToken");
    // console.log('Token from localStorage:', sessionToken) // Debug token retrieval
    if (sessionToken) {
      baseHeaders.Authorization = `Bearer ${sessionToken}`;
      // console.log('Authorization header:', baseHeaders.Authorization) // Debug header
    }
  }

  const baseUrl = options?.baseUrl ?? envConfig.NEXT_PUBLIC_API_ENDPOINT;
  const fullUrl = url.startsWith("/")
    ? `${baseUrl}${url}`
    : `${baseUrl}/${url}`;

  const response = await fetch(fullUrl, {
    ...options,
    headers: { ...baseHeaders, ...options?.headers } as HeadersInit,
    body,
    method,
  });

  if (!response.ok) {
    if (response.status === 422) {
      throw new EntityError(await response.json());
    }
    throw new HttpError(response.status, await response.json());
  }

  return {
    status: response.status,
    payload: response.status !== 204 ? await response.json() : {},
  };
}
// HTTP Client Methods
const http = {
  get<T>(url: string, options?: Omit<CustomOptions, "body">) {
    return request<T>("GET", url, options);
  },
  post<T>(url: string, body: any, options?: Omit<CustomOptions, "body">) {
    return request<T>("POST", url, { ...options, body });
  },
  put<T>(url: string, body: any, options?: Omit<CustomOptions, "body">) {
    return request<T>("PUT", url, { ...options, body });
  },
  delete<T>(url: string, options?: Omit<CustomOptions, "body">) {
    return request<T>("DELETE", url, options);
  },
  patch<T>(url: string, body: any, options?: Omit<CustomOptions, "body">) {
    return request<T>("PATCH", url, { ...options, body });
  },
};

export default http;
