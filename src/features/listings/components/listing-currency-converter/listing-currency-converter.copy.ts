import type { Locale } from "@/shared/i18n/config";

const copies = {
  en: {
    trigger: "Convert currency",
    title: "Monthly rent in other currencies",
    original: "Listing price",
    hint: "Indicative amounts based on the latest available exchange rates.",
    unavailable: "Exchange rates are currently unavailable.",
    close: "Close",
  },
  ru: {
    trigger: "Пересчитать валюту",
    title: "Аренда в других валютах",
    original: "Цена в объявлении",
    hint: "Примерные суммы по последним доступным курсам валют.",
    unavailable: "Курсы валют сейчас недоступны.",
    close: "Закрыть",
  },
  vi: {
    trigger: "Quy đổi tiền tệ",
    title: "Tiền thuê hàng tháng bằng các loại tiền khác",
    original: "Giá trong tin đăng",
    hint: "Số tiền tham khảo theo tỷ giá mới nhất hiện có.",
    unavailable: "Hiện không có tỷ giá hối đoái.",
    close: "Đóng",
  },
};

export function getCurrencyConverterCopy(locale: Locale) {
  return copies[locale];
}
