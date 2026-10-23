import type { ApiProblem } from "./types";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly problem?: ApiProblem,
  ) {
    super(
      Array.isArray(problem?.message)
        ? problem.message.join(", ")
        : problem?.message || `API request failed (${status})`,
    );
  }
}

let refreshPromise: Promise<void> | undefined;
let sessionVersion = 0;

function refreshSession(): Promise<void> {
  refreshPromise ??= request("/auth/refresh", { method: "POST" })
    .then(() => {
      sessionVersion += 1;
    })
    .finally(() => {
      refreshPromise = undefined;
    });

  return refreshPromise;
}

export async function browserApi<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const version = sessionVersion;

  try {
    return await request<T>(path, options);
  } catch (error) {
    const pathname = path.split(/[?#]/)[0].replace(/\/+$/, "");
    const isAuthAction =
      pathname.startsWith("/auth/") && pathname !== "/auth/me";

    if (!(error instanceof ApiError) || error.status !== 401 || isAuthAction) {
      throw error;
    }

    options.signal?.throwIfAborted();

    // A late 401 may belong to a request sent before another request refreshed.
    if (version === sessionVersion) {
      await refreshSession();
    }

    options.signal?.throwIfAborted();

    return request<T>(path, options);
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";
  const requestHeaders = new Headers(options.headers);
  requestHeaders.set("Accept", "application/json");

  if (options.body && !(options.body instanceof FormData)) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: requestHeaders,
    credentials: "include",
  });

  if (!response.ok) {
    let problem: ApiProblem | undefined;

    try {
      problem = (await response.json()) as ApiProblem;
    } catch {
      /* non-JSON backend failure */
    }

    throw new ApiError(response.status, problem);
  }

  return response.json() as Promise<T>;
}

export function publicApiUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1"}${path}`;
}
