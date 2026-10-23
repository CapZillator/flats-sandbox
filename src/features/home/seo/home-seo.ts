import type { Locale } from "@/shared/i18n/config";
import { buildSeoMetadata } from "@/shared/lib/seo";

const copy = {
  en: {
    title: "Homes for rent in Vietnam",
    description:
      "Find apartments, houses and villas for medium- and long-term rent in Vietnam. Compare monthly prices, amenities and rental terms on Manden.",
  },
  ru: {
    title: "Аренда жилья во Вьетнаме",
    description:
      "Квартиры, дома и виллы для среднесрочной и долгосрочной аренды во Вьетнаме. Сравнивайте цены за месяц, удобства и условия аренды на Manden.",
  },
  vi: {
    title: "Nhà cho thuê tại Việt Nam",
    description:
      "Tìm căn hộ, nhà và biệt thự cho thuê trung và dài hạn tại Việt Nam. So sánh giá thuê hàng tháng, tiện nghi và điều kiện thuê trên Manden.",
  },
};

export function buildHomeMetadata(locale: Locale) {
  return buildSeoMetadata({ ...copy[locale], locale, path: "/" });
}
