"use client";

import { useState } from "react";
import type { Currency } from "@/shared/api/types";
import { currencies, formatConvertedMoney } from "@/shared/currency/currency";
import { useCurrency } from "@/shared/currency/components/currency-provider/CurrencyProvider";
import type { Locale } from "@/shared/i18n/config";
import { formatMoney } from "@/shared/lib/format";
import { Button } from "@/shared/ui/button/Button";
import { Modal } from "@/shared/ui/modal";
import { getCurrencyConverterCopy } from "./listing-currency-converter.copy";

export function ListingCurrencyConverter({
  amount,
  currency,
  locale,
}: {
  amount: string | number;
  currency: Currency;
  locale: Locale;
}) {
  const [open, setOpen] = useState(false);
  const context = useCurrency();
  const copy = getCurrencyConverterCopy(locale);
  const snapshot = context?.snapshot;
  const sourceRate = Number(snapshot?.rates[currency]);
  const targets = currencies.filter((target) => target !== currency);
  const available =
    Number.isFinite(Number(amount)) &&
    Number.isFinite(sourceRate) &&
    sourceRate > 0 &&
    targets.every((target) => {
      const rate = Number(snapshot?.rates[target]);

      return Number.isFinite(rate) && rate > 0;
    });

  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        {copy.trigger}
      </Button>

      <Modal
        open={open}
        title={copy.title}
        description={copy.hint}
        closeLabel={copy.close}
        onClose={() => setOpen(false)}
      >
        <div className="grid gap-4">
          <div className="rounded-control bg-surface-muted p-4">
            <p className="text-body-sm text-muted">{copy.original}</p>

            <p className="text-h3">{formatMoney(amount, currency, locale)}</p>
          </div>

          {available ? (
            <dl className="grid gap-3">
              {targets.map((target) => (
                <div
                  key={target}
                  className="flex items-baseline justify-between gap-4 border-b border-border-light pb-3"
                >
                  <dt className="text-body-sm text-muted">{target}</dt>

                  <dd className="text-h3">
                    {formatConvertedMoney(
                      amount,
                      currency,
                      target,
                      locale,
                      snapshot,
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <p role="status" className="text-body-sm text-muted">
              {copy.unavailable}
            </p>
          )}
        </div>
      </Modal>
    </>
  );
}
