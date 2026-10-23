import type { Locale } from "./config";

const copy = {
  en: {
    label: "Advertiser",
    unknown: "Not specified",
    OWNER: "Owner",
    REALTOR: "Realtor",
    ownersOnly: "Owners only",
    hint: "Your role appears on all your listings. Please state it honestly to avoid having your account blocked.",
  },
  ru: {
    label: "Кто сдаёт жильё",
    unknown: "Не указан",
    OWNER: "Собственник",
    REALTOR: "Риэлтор",
    ownersOnly: "Только от собственников",
    hint: "Роль отображается во всех ваших объявлениях. Пожалуйста, указывайте её честно, чтобы избежать блокировки аккаунта.",
  },
  vi: {
    label: "Người đăng tin",
    unknown: "Chưa xác định",
    OWNER: "Chủ sở hữu",
    REALTOR: "Môi giới",
    ownersOnly: "Chỉ chủ sở hữu",
    hint: "Vai trò của bạn hiển thị trên tất cả tin đăng. Vui lòng khai báo trung thực để tránh bị khóa tài khoản.",
  },
};

export function getLandlordTypeCopy(locale: Locale) {
  return copy[locale];
}
