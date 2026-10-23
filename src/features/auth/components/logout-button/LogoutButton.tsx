"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { browserApi } from "@/shared/api/client";
import type { Locale } from "@/shared/i18n/config";
import { localizedPath } from "@/shared/i18n/routing";
import { Button, LogoutIcon } from "@/shared/ui";

export function LogoutButton({
  label,
  locale,
  className,
}: {
  label: string;
  locale: Locale;
  className?: string;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const logoutMutation = useMutation({
    mutationFn: () => browserApi("/auth/logout", { method: "POST" }),
    onSuccess: () => {
      queryClient.clear();
      router.push(localizedPath(locale));
      router.refresh();
    },
  });

  return (
    <Button
      className={className}
      disabled={logoutMutation.isPending}
      loading={logoutMutation.isPending}
      loadingLabel={label}
      size="sm"
      variant="ghost"
      onClick={() => logoutMutation.mutate()}
    >
      <LogoutIcon className="size-5 shrink-0" />

      {label}
    </Button>
  );
}
