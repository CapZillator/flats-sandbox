import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const fetchMock = vi.fn<typeof fetch>();

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });

  return { promise, resolve };
}

describe("browserApi session refresh", () => {
  beforeEach(() => {
    vi.resetModules();
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("refreshes on 401 and retries a mutation with its original body and headers", async () => {
    const { browserApi } = await import("./client");
    fetchMock
      .mockResolvedValueOnce(json({}, 401))
      .mockResolvedValueOnce(json({ user: { id: "user" } }))
      .mockResolvedValueOnce(json({ saved: true }));
    const options = {
      method: "PATCH",
      body: JSON.stringify({ name: "Home" }),
      headers: { "X-Request-ID": "request" },
    };

    await expect(browserApi("/users/me", options)).resolves.toEqual({
      saved: true,
    });
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock.mock.calls[1]).toEqual([
      expect.stringContaining("/auth/refresh"),
      expect.objectContaining({ method: "POST", credentials: "include" }),
    ]);
    const retriedOptions = fetchMock.mock.calls[2][1]!;
    expect(retriedOptions).toMatchObject({
      ...options,
      headers: expect.any(Headers),
      credentials: "include",
    });
    expect(new Headers(retriedOptions.headers).get("X-Request-ID")).toBe(
      "request",
    );
    expect(new Headers(retriedOptions.headers).get("Content-Type")).toBe(
      "application/json",
    );
  });

  it("shares one refresh across parallel unauthorized requests", async () => {
    const { browserApi } = await import("./client");
    const refresh = deferred<Response>();
    fetchMock
      .mockResolvedValueOnce(json({}, 401))
      .mockResolvedValueOnce(json({}, 401))
      .mockReturnValueOnce(refresh.promise)
      .mockImplementation(async () => json({ ok: true }));
    const first = browserApi("/favorites");
    const second = browserApi("/users/me");
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3));
    refresh.resolve(json({ user: {} }));

    await expect(Promise.all([first, second])).resolves.toEqual([
      { ok: true },
      { ok: true },
    ]);
    expect(fetchMock).toHaveBeenCalledTimes(5);
  });

  it("retries a late 401 without rotating the already refreshed tokens again", async () => {
    const { browserApi } = await import("./client");
    const lateResponse = deferred<Response>();
    fetchMock
      .mockResolvedValueOnce(json({}, 401))
      .mockReturnValueOnce(lateResponse.promise)
      .mockResolvedValueOnce(json({ user: {} }))
      .mockImplementation(async () => json({ ok: true }));
    const first = browserApi("/favorites");
    const second = browserApi("/users/me");
    await first;
    lateResponse.resolve(json({}, 401));
    await second;

    expect(fetchMock).toHaveBeenCalledTimes(5);
    expect(
      fetchMock.mock.calls.filter(([url]) =>
        String(url).endsWith("/auth/refresh"),
      ),
    ).toHaveLength(1);
  });

  it("returns the refresh error without retrying and allows later recovery", async () => {
    const { ApiError, browserApi } = await import("./client");
    fetchMock
      .mockResolvedValueOnce(json({}, 401))
      .mockResolvedValueOnce(json({ message: "Refresh session expired" }, 401));

    await expect(browserApi("/favorites")).rejects.toMatchObject({
      status: 401,
      message: "Refresh session expired",
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    fetchMock
      .mockResolvedValueOnce(json({}, 401))
      .mockResolvedValueOnce(json({ user: {} }))
      .mockResolvedValueOnce(json({}, 401));

    await expect(browserApi("/favorites")).rejects.toBeInstanceOf(ApiError);
    expect(fetchMock).toHaveBeenCalledTimes(5);
  });

  it("does not refresh again if the retried request is still unauthorized", async () => {
    const { browserApi } = await import("./client");
    fetchMock
      .mockResolvedValueOnce(json({}, 401))
      .mockResolvedValueOnce(json({ user: {} }))
      .mockResolvedValueOnce(json({ message: "Session expired" }, 401));

    await expect(browserApi("/favorites")).rejects.toMatchObject({
      status: 401,
    });
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it.each([
    "/auth/refresh",
    "/auth/refresh/?source=test",
    "/auth/logout",
    "/auth/magic-link/verify",
    "/auth/magic-link/verify-code",
  ])("does not refresh failed auth action %s", async (path) => {
    const { browserApi } = await import("./client");
    fetchMock.mockResolvedValueOnce(json({}, 401));

    await expect(browserApi(path, { method: "POST" })).rejects.toMatchObject({
      status: 401,
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("recovers the auth/me request", async () => {
    const { browserApi } = await import("./client");
    fetchMock
      .mockResolvedValueOnce(json({}, 401))
      .mockResolvedValueOnce(json({ user: { id: "user" } }))
      .mockResolvedValueOnce(json({ user: { id: "user" } }));

    await expect(browserApi("/auth/me")).resolves.toEqual({
      user: { id: "user" },
    });
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it.each([403, 500])("does not refresh on %s", async (status) => {
    const { browserApi } = await import("./client");
    fetchMock.mockResolvedValueOnce(json({}, status));

    await expect(browserApi("/favorites")).rejects.toMatchObject({ status });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("does not refresh on a network failure", async () => {
    const { browserApi } = await import("./client");
    const error = new TypeError("Failed to fetch");
    fetchMock.mockRejectedValueOnce(error);

    await expect(browserApi("/favorites")).rejects.toBe(error);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("keeps uploads intact when retrying", async () => {
    const { browserApi } = await import("./client");
    const body = new FormData();
    body.append("photo", new Blob(["image"]), "photo.png");
    fetchMock
      .mockResolvedValueOnce(json({}, 401))
      .mockResolvedValueOnce(json({ user: {} }))
      .mockResolvedValueOnce(json({ uploaded: true }));
    await browserApi("/photos", { method: "POST", body });

    expect(fetchMock.mock.calls[2][1]?.body).toBe(body);
    expect(
      new Headers(fetchMock.mock.calls[2][1]?.headers).has("Content-Type"),
    ).toBe(false);
  });

  it("does not let one cancelled request abort a shared refresh", async () => {
    const { browserApi } = await import("./client");
    const controller = new AbortController();
    const refresh = deferred<Response>();
    fetchMock
      .mockResolvedValueOnce(json({}, 401))
      .mockResolvedValueOnce(json({}, 401))
      .mockReturnValueOnce(refresh.promise)
      .mockResolvedValueOnce(json({ ok: true }));
    const first = browserApi("/favorites", { signal: controller.signal });
    const second = browserApi("/users/me");
    const cancelled = expect(first).rejects.toMatchObject({
      name: "AbortError",
    });
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3));
    controller.abort();
    refresh.resolve(json({ user: {} }));
    await cancelled;
    await expect(second).resolves.toEqual({ ok: true });

    expect(fetchMock.mock.calls[2][1]?.signal).toBeUndefined();
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });
});
