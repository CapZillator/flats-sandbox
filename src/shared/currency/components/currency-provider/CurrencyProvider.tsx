"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { browserApi } from "@/shared/api/client";
import type { Currency } from "@/shared/api/types";
import { currencyCookie, type ExchangeRatesSnapshot } from "../../currency";

type CurrencyContextValue = {
  currency: Currency;
  snapshot?: ExchangeRatesSnapshot;
  setCurrency: (currency: Currency) => void;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({
  children,
  initialCurrency,
  initialSnapshot,
}: {
  children: ReactNode;
  initialCurrency: Currency;
  initialSnapshot?: ExchangeRatesSnapshot;
}) {
  const router = useRouter();
  const [currency, setSelectedCurrency] = useState(initialCurrency);
  const query = useQuery({
    queryKey: ["currencies", "exchange-rates"],
    queryFn: () =>
      browserApi<ExchangeRatesSnapshot>("/currencies/exchange-rates"),
    initialData: initialSnapshot,
    staleTime: 60 * 60 * 1000,
    refetchInterval: 60 * 60 * 1000,
  });

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        snapshot: query.data,
        setCurrency: (next) => {
          document.cookie = `${currencyCookie}=${next}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
          setSelectedCurrency(next);
          router.refresh();
        },
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
