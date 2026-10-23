"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";

import { ApiError, browserApi } from "@/shared/api/client";
import { queryKeys } from "@/shared/api/query-keys";
import type {
  AvailabilityBlock,
  AvailabilityBlockType,
} from "@/shared/api/types";
import {
  ControlledAdaptiveDropdown,
  ControlledDatePicker,
  ControlledTextField,
} from "@/shared/forms";
import { useToast } from "@/shared/hooks/useToast";
import type { Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/dictionaries";
import { formatDate } from "@/shared/lib/format";
import {
  Badge,
  Button,
  CalendarIcon,
  DeleteIcon,
  EmptyState,
} from "@/shared/ui";

import { AvailabilityBlocksLoading } from "../availability-blocks-loading/AvailabilityBlocksLoading";

import {
  createAvailabilityBlockSchema,
  type AvailabilityBlockFormValues,
} from "./availability-manager.schema";

function dateOnly(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getCalendarRange() {
  const today = new Date();
  const future = new Date(today);
  future.setFullYear(future.getFullYear() + 2);

  return { from: dateOnly(today), to: dateOnly(future) };
}

const badgeTones: Record<
  AvailabilityBlockType,
  "neutral" | "warning" | "danger"
> = {
  OCCUPIED: "neutral",
  OWNER_BLOCKED: "warning",
  MAINTENANCE: "danger",
};

export function AvailabilityManager({
  listingId,
  locale,
}: {
  listingId: string;
  locale: Locale;
}) {
  const dictionary = getDictionary(locale);
  const copy = dictionary.availabilityManager;
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [{ from, to }] = useState(getCalendarRange);
  const availabilityKey = queryKeys.availability(listingId, from, to);
  const schema = createAvailabilityBlockSchema(copy.errors);
  const { control, handleSubmit, reset } = useForm<AvailabilityBlockFormValues>(
    {
      resolver: zodResolver(schema),
      defaultValues: {
        startsOn: "",
        endsOn: "",
        type: "OCCUPIED",
        note: "",
      },
    },
  );
  const startsOn = useWatch({ control, name: "startsOn" });
  const availabilityQuery = useQuery({
    queryKey: availabilityKey,
    queryFn: ({ signal }) =>
      browserApi<AvailabilityBlock[]>(
        `/listings/manage/${listingId}/availability?from=${from}&to=${to}`,
        { signal },
      ),
  });
  const createMutation = useMutation({
    mutationFn: (values: AvailabilityBlockFormValues) =>
      browserApi<AvailabilityBlock>(`/listings/${listingId}/availability`, {
        method: "POST",
        body: JSON.stringify({ ...values, note: values.note || null }),
      }),
    onSuccess: async () => {
      reset();
      showToast(copy.added, "success");
      await queryClient.invalidateQueries({ queryKey: availabilityKey });
    },
    onError: (error) =>
      showToast(
        error instanceof ApiError && error.status === 409
          ? copy.overlapError
          : copy.updateError,
        "error",
      ),
  });
  const removeMutation = useMutation({
    mutationFn: (id: string) =>
      browserApi(`/listings/${listingId}/availability/${id}`, {
        method: "DELETE",
      }),
    onSuccess: (_data, id) => {
      queryClient.setQueryData<AvailabilityBlock[]>(
        availabilityKey,
        (blocks = []) => blocks.filter((block) => block.id !== id),
      );
      showToast(copy.removed, "success");
    },
    onError: () => showToast(copy.updateError, "error"),
  });
  const submit = handleSubmit((values) => createMutation.mutate(values));
  const blocks = availabilityQuery.data ?? [];

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(18rem,0.8fr)_minmax(0,1.4fr)] xl:items-start">
      <form
        className="grid gap-4 rounded-surface border border-border bg-surface p-5 sm:p-6"
        noValidate
        onSubmit={submit}
      >
        <div>
          <h2 className="text-h3 text-foreground">{copy.createTitle}</h2>

          <p className="mt-1 text-body-sm text-muted">{copy.intro}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <ControlledDatePicker
            clearLabel={dictionary.common.clear}
            closeLabel={dictionary.common.close}
            control={control}
            dialogLabel={dictionary.common.chooseDate}
            label={copy.startsOn}
            locale={locale}
            max={to}
            min={from}
            name="startsOn"
            placeholder={dictionary.common.datePlaceholder}
            required
            todayLabel={dictionary.common.today}
          />

          <ControlledDatePicker
            clearLabel={dictionary.common.clear}
            closeLabel={dictionary.common.close}
            control={control}
            dialogLabel={dictionary.common.chooseDate}
            label={copy.endsOn}
            locale={locale}
            max={to}
            min={startsOn || from}
            name="endsOn"
            placeholder={dictionary.common.datePlaceholder}
            required
            todayLabel={dictionary.common.today}
          />
        </div>

        <ControlledAdaptiveDropdown
          closeLabel={dictionary.common.close}
          control={control}
          label={copy.reason}
          name="type"
          options={(["OCCUPIED", "OWNER_BLOCKED", "MAINTENANCE"] as const).map(
            (type) => ({ value: type, label: copy.types[type] }),
          )}
          sheetTitle={copy.reason}
          required
        />

        <ControlledTextField
          control={control}
          hint={copy.noteHint}
          label={copy.note}
          maxLength={1000}
          name="note"
          placeholder={copy.notePlaceholder}
        />

        {createMutation.error ? (
          <p className="text-body-sm font-medium text-danger" role="alert">
            {createMutation.error instanceof ApiError &&
            createMutation.error.status === 409
              ? copy.overlapError
              : copy.updateError}
          </p>
        ) : null}

        <Button
          fullWidth
          loading={createMutation.isPending}
          loadingLabel={copy.blocking}
          type="submit"
        >
          {copy.blockDates}
        </Button>
      </form>

      <section
        className="grid gap-3"
        aria-labelledby="availability-blocks-title"
      >
        <div>
          <h2
            className="text-h3 text-foreground"
            id="availability-blocks-title"
          >
            {copy.blockedDates}
          </h2>

          <p className="mt-1 text-body-sm text-muted">{copy.privateHint}</p>
        </div>

        {availabilityQuery.isPending ? (
          <AvailabilityBlocksLoading label={dictionary.common.loading} />
        ) : null}

        {availabilityQuery.isError ? (
          <EmptyState
            action={
              <Button
                onClick={() => void availabilityQuery.refetch()}
                size="sm"
                variant="outline"
              >
                {dictionary.common.retry}
              </Button>
            }
            description={copy.loadError}
            icon={<CalendarIcon className="size-5" />}
            role="alert"
            title={copy.errorTitle}
          />
        ) : null}

        {availabilityQuery.isSuccess && blocks.length === 0 ? (
          <EmptyState
            description={copy.emptyCopy}
            icon={<CalendarIcon className="size-5" />}
            title={copy.empty}
          />
        ) : null}

        {availabilityQuery.isSuccess && blocks.length > 0 ? (
          <div className="grid gap-3">
            {blocks.map((block) => {
              const isRemoving =
                removeMutation.isPending &&
                removeMutation.variables === block.id;

              return (
                <article
                  className="flex flex-col gap-4 rounded-surface border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
                  key={block.id}
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-body font-semibold text-foreground">
                        {formatDate(block.startsOn, locale)}

                        {block.startsOn !== block.endsOn
                          ? ` — ${formatDate(block.endsOn, locale)}`
                          : ""}
                      </h3>

                      <Badge tone={badgeTones[block.type]}>
                        {copy.types[block.type]}
                      </Badge>
                    </div>

                    {block.note ? (
                      <p className="mt-2 break-words text-body-sm text-muted">
                        {block.note}
                      </p>
                    ) : null}
                  </div>

                  <Button
                    className="self-start sm:self-auto"
                    disabled={removeMutation.isPending}
                    loading={isRemoving}
                    loadingLabel={copy.removing}
                    onClick={() => removeMutation.mutate(block.id)}
                    size="sm"
                    variant="outline"
                  >
                    <DeleteIcon className="size-4" />

                    {copy.remove}
                  </Button>
                </article>
              );
            })}
          </div>
        ) : null}
      </section>
    </div>
  );
}
