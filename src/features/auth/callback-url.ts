const CALLBACK_ORIGIN = "https://callback.invalid";

export function getSafeCallbackUrl(
  value: string | null,
  fallback: string,
): string {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    /[\\\u0000-\u0020\u007f]/.test(value)
  ) {
    return fallback;
  }

  try {
    const url = new URL(value, CALLBACK_ORIGIN);
    const path = `${url.pathname}${url.search}${url.hash}`;

    if (url.origin !== CALLBACK_ORIGIN || path.startsWith("//")) {
      return fallback;
    }

    return path;
  } catch {
    return fallback;
  }
}
