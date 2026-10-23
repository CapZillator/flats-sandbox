"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ApiError, browserApi, publicApiUrl } from "@/shared/api/client";
import { queryKeys } from "@/shared/api/query-keys";
import type { CurrentUser } from "@/shared/api/types";
import type { Locale } from "@/shared/i18n/config";
import type { Dictionary } from "@/shared/i18n/dictionaries";
import { localizedPath } from "@/shared/i18n/routing";
import { ControlledTextField } from "@/shared/forms";
import { Button, ButtonLink } from "@/shared/ui";
import { getSafeCallbackUrl } from "@/features/auth/callback-url";

const magicCodePattern = /^[A-HJ-NP-Z2-9]{8}$/;

type EmailFormValues = { email: string };
type CodeFormValues = { code: string };

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizeMagicCode(code: string): string {
  return code.replace(/[\s-]/g, "").toUpperCase();
}

export function AuthForm({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const search = useSearchParams();
  const callbackUrl = getSafeCallbackUrl(
    search.get("callbackUrl"),
    localizedPath(locale, "/account"),
  );
  const [requestedEmail, setRequestedEmail] = useState("");
  const [serverError, setServerError] = useState("");
  const queryClient = useQueryClient();

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(
      z.object({
        email: z
          .string()
          .refine(
            (value) => z.email().safeParse(normalizeEmail(value)).success,
            dictionary.auth.emailInvalid,
          ),
      }),
    ),
    defaultValues: { email: "" },
  });

  const codeForm = useForm<CodeFormValues>({
    resolver: zodResolver(
      z.object({
        code: z
          .string()
          .refine(
            (value) => magicCodePattern.test(normalizeMagicCode(value)),
            dictionary.auth.codeInvalid,
          ),
      }),
    ),
    defaultValues: { code: "" },
  });

  const requestMutation = useMutation({
    mutationFn: (email: string) =>
      browserApi("/auth/magic-link/request", {
        method: "POST",
        body: JSON.stringify({
          email,
          locale,
          callbackUrl,
        }),
      }),
    onMutate: () => setServerError(""),
    onSuccess: (_data, email) => setRequestedEmail(email),
    onError: (error) => {
      setServerError(
        error instanceof ApiError ? error.message : dictionary.auth.sendError,
      );
    },
  });
  const verifyMutation = useMutation({
    mutationFn: (code: string) =>
      browserApi<{ user: CurrentUser }>("/auth/magic-link/verify-code", {
        method: "POST",
        body: JSON.stringify({
          email: requestedEmail,
          code,
        }),
      }),
    onMutate: () => setServerError(""),
    onSuccess: ({ user }) => {
      queryClient.setQueryData(queryKeys.session, user);
      window.location.assign(callbackUrl);
    },
    onError: (error) => {
      setServerError(
        error instanceof ApiError ? error.message : dictionary.auth.verifyError,
      );
    },
  });
  const submitEmail = emailForm.handleSubmit(({ email }) =>
    requestMutation.mutate(normalizeEmail(email)),
  );
  const submitCode = codeForm.handleSubmit(({ code }) =>
    verifyMutation.mutate(normalizeMagicCode(code)),
  );

  const useAnotherEmail = () => {
    codeForm.reset();
    requestMutation.reset();
    verifyMutation.reset();
    setRequestedEmail("");
    setServerError("");
  };

  return (
    <div className="grid gap-6 rounded-surface border border-border bg-surface p-5 sm:p-7">
      {requestedEmail ? (
        <>
          <div className="grid gap-3 rounded-surface border border-success bg-success/10 p-4">
            <span
              aria-hidden="true"
              className="flex size-8 items-center justify-center rounded-full bg-success text-sm font-bold text-white"
            >
              ✓
            </span>

            <p className="text-body-sm text-foreground">
              {dictionary.auth.sent}
            </p>

            <p className="break-all text-body-sm font-semibold text-foreground">
              {requestedEmail}
            </p>
          </div>

          <form className="grid gap-4" noValidate onSubmit={submitCode}>
            <ControlledTextField
              control={codeForm.control}
              name="code"
              label={dictionary.auth.code}
              autoComplete="one-time-code"
              autoCapitalize="characters"
              className="uppercase tracking-[0.2em]"
              maxLength={12}
              spellCheck={false}
              required
            />

            <Button
              type="submit"
              fullWidth
              loading={verifyMutation.isPending}
              loadingLabel={dictionary.common.loading}
            >
              {dictionary.auth.verify}
            </Button>

            <Button
              type="button"
              variant="ghost"
              fullWidth
              onClick={useAnotherEmail}
            >
              {dictionary.auth.changeEmail}
            </Button>
          </form>
        </>
      ) : (
        <form className="grid gap-4" noValidate onSubmit={submitEmail}>
          <ControlledTextField
            control={emailForm.control}
            name="email"
            label={dictionary.auth.email}
            type="email"
            autoComplete="email"
            inputMode="email"
            required
          />

          <Button
            type="submit"
            fullWidth
            loading={requestMutation.isPending}
            loadingLabel={dictionary.common.loading}
          >
            {dictionary.auth.send}
          </Button>
        </form>
      )}

      <div className="flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-border-light" />

        <span className="text-caption uppercase tracking-[0.08em] text-muted">
          {dictionary.auth.or}
        </span>

        <span className="h-px flex-1 bg-border-light" />
      </div>

      <ButtonLink
        href={`${publicApiUrl("/auth/google")}?callbackUrl=${encodeURIComponent(callbackUrl)}`}
        variant="outline"
        fullWidth
      >
        <span
          aria-hidden="true"
          className="flex size-6 shrink-0 items-center justify-center text-body-lg font-bold"
        >
          G
        </span>

        {dictionary.auth.google}
      </ButtonLink>

      {serverError ? (
        <p
          className="rounded-control border border-danger bg-danger/10 p-3 text-body-sm font-medium text-danger"
          role="alert"
        >
          {serverError}
        </p>
      ) : null}
    </div>
  );
}
