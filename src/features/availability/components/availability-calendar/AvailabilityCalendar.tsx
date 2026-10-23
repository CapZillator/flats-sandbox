"use client";

import { enUS, ru, vi } from "date-fns/locale";
import { DayPicker } from "react-day-picker";

import type { Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/dictionaries";

const dateLocales = { en: enUS, ru, vi };

export function AvailabilityCalendar({
  locale,
  blocks,
  start,
  end,
  availableFrom,
}: {
  locale: Locale;
  blocks: Array<{ startsOn: string; endsOn: string }>;
  start: string;
  end?: string;
  availableFrom?: string | null;
}) {
  const copy = getDictionary(locale).listing;
  const first = new Date(`${start}T00:00:00Z`);
  const last = end
    ? new Date(`${end}T00:00:00Z`)
    : new Date(first.getTime() + 365 * 86400000);
  const unavailable = (date: Date) => {
    const value = date.toISOString().slice(0, 10);

    return (
      Boolean(availableFrom && value < availableFrom.slice(0, 10)) ||
      blocks.some(
        (block) =>
          block.startsOn.slice(0, 10) <= value &&
          block.endsOn.slice(0, 10) >= value,
      )
    );
  };

  return (
    <div className="mx-auto grid w-full max-w-sm gap-3 lg:mx-0">
      <div>
        <DayPicker
          className="nestly-calendar"
          locale={dateLocales[locale]}
          timeZone="UTC"
          defaultMonth={first}
          startMonth={first}
          endMonth={last}
          hidden={[{ before: first }, { after: last }]}
          fixedWeeks
          showOutsideDays
          navLayout="around"
          modifiers={{ blocked: unavailable }}
          modifiersClassNames={{
            blocked: "blocked bg-danger/10 text-danger line-through",
          }}
          labels={{
            labelGridcell: (date) =>
              `${date.toISOString().slice(0, 10)}, ${unavailable(date) ? copy.unavailable : copy.available.toLowerCase()}`,
          }}
        />
      </div>

      <p className="flex items-center justify-center gap-2 text-caption text-muted">
        <span
          aria-hidden="true"
          className="size-3 rounded-compact bg-danger/10 ring-1 ring-danger/30"
        />

        {copy.unavailable}
      </p>
    </div>
  );
}
