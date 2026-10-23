import { beforeEach, describe, expect, it, vi } from "vitest";
import { requireAdmin } from "./admin.access";

const { session } = vi.hoisted(() => ({ session: vi.fn() }));
vi.mock("@/shared/api/endpoints", () => ({ api: { session } }));
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NOT_FOUND");
  },
  redirect: (path: string) => {
    throw new Error(`REDIRECT:${path}`);
  },
}));

describe("requireAdmin", () => {
  beforeEach(() => {
    session.mockReset();
  });
  it("preserves the moderator return path for signed-out users", async () => {
    session.mockResolvedValue(null);

    await expect(requireAdmin("ru", "/admin/listings/example")).rejects.toThrow(
      "REDIRECT:/ru/login?callbackUrl=%2Fru%2Fadmin%2Flistings%2Fexample",
    );
  });
  it.each(["TENANT", "LANDLORD"])("denies %s", async (role) => {
    session.mockResolvedValue({ role });

    await expect(requireAdmin("en")).rejects.toThrow("NOT_FOUND");
  });
  it("allows admins", async () => {
    session.mockResolvedValue({ role: "ADMIN", id: "admin" });

    await expect(requireAdmin("en")).resolves.toEqual({
      role: "ADMIN",
      id: "admin",
    });
  });
  it("does not turn a backend outage into authorization", async () => {
    session.mockRejectedValue(new Error("Offline"));

    await expect(requireAdmin("en")).rejects.toThrow("Offline");
  });
});
