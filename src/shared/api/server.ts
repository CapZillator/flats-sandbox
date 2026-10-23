import "server-only";
import { headers } from "next/headers";
import { ApiError } from "./client";
import type { ApiProblem } from "./types";

const serverApiUrl = process.env.API_URL ?? "http://localhost:3000/api/v1";

function toQuery(params?: Record<string, unknown>): string {
  if (!params) {
    return "";
  }

  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => query.append(key, String(item)));
    } else {
      query.set(key, String(value));
    }
  });

  return query.size ? `?${query}` : "";
}

export async function serverApi<T>(
  path: string,
  options: RequestInit & {
    query?: Record<string, unknown>;
    auth?: boolean;
  } = {},
): Promise<T> {
  const requestHeaders = new Headers(options.headers);
  requestHeaders.set("Accept", "application/json");

  if (options.auth) {
    const cookie = (await headers()).get("cookie");

    if (cookie) {
      requestHeaders.set("cookie", cookie);
    }
  }

  const response = await fetch(
    `${serverApiUrl}${path}${toQuery(options.query)}`,
    { ...options, headers: requestHeaders, cache: options.cache ?? "no-store" },
  );

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
