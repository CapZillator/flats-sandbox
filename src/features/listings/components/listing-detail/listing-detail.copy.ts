import type { Locale } from "@/shared/i18n/config";

const copies = {
  en: {
    photos: "Property photos",
    photo: "Photo",
    noPhotos: "No photos yet",
    previous: "Previous photo",
    next: "Next photo",
    terms: "Rental terms",
    minimumLease: "Minimum lease",
    months: "months",
    yes: "Yes",
    no: "No",
    nearby: "Nature nearby",
    meters: "m",
    owner: "About the landlord",
    calendarHint:
      "Marked dates are unavailable. Confirm your dates with the landlord.",
    calendarError:
      "The calendar could not be loaded. Please confirm availability with the landlord.",
    contactError: "Could not load contacts. Please try again.",
    noContacts: "The landlord has not added any contacts yet.",
    primary: "Primary",
    reveal: "Show contacts",
    errorTitle: "Could not load this home",
    errorCopy: "Please try again in a moment.",
    contactTypes: {
      PHONE: "Phone",
      EMAIL: "Email",
      WHATSAPP: "WhatsApp",
      ZALO: "Zalo",
      TELEGRAM: "Telegram",
    },
  },
  ru: {
    photos: "Фотографии жилья",
    photo: "Фото",
    noPhotos: "Фотографий пока нет",
    previous: "Предыдущее фото",
    next: "Следующее фото",
    terms: "Условия аренды",
    minimumLease: "Минимальный срок",
    months: "мес.",
    yes: "Да",
    no: "Нет",
    nearby: "Природа рядом",
    meters: "м",
    owner: "Об арендодателе",
    calendarHint:
      "Отмеченные даты недоступны. Уточните свои даты у арендодателя.",
    calendarError:
      "Не удалось загрузить календарь. Уточните доступность у арендодателя.",
    contactError: "Не удалось загрузить контакты. Попробуйте ещё раз.",
    noContacts: "Арендодатель пока не добавил контакты.",
    primary: "Основной",
    reveal: "Показать контакты",
    errorTitle: "Не удалось загрузить объявление",
    errorCopy: "Попробуйте ещё раз через некоторое время.",
    contactTypes: {
      PHONE: "Телефон",
      EMAIL: "Email",
      WHATSAPP: "WhatsApp",
      ZALO: "Zalo",
      TELEGRAM: "Telegram",
    },
  },
  vi: {
    photos: "Ảnh nhà",
    photo: "Ảnh",
    noPhotos: "Chưa có ảnh",
    previous: "Ảnh trước",
    next: "Ảnh tiếp theo",
    terms: "Điều kiện thuê",
    minimumLease: "Thời hạn thuê tối thiểu",
    months: "tháng",
    yes: "Có",
    no: "Không",
    nearby: "Thiên nhiên gần đây",
    meters: "m",
    owner: "Về chủ nhà",
    calendarHint:
      "Các ngày được đánh dấu không còn trống. Vui lòng xác nhận ngày với chủ nhà.",
    calendarError:
      "Không thể tải lịch. Vui lòng xác nhận lịch trống với chủ nhà.",
    contactError: "Không thể tải liên hệ. Vui lòng thử lại.",
    noContacts: "Chủ nhà chưa thêm thông tin liên hệ.",
    primary: "Chính",
    reveal: "Xem liên hệ",
    errorTitle: "Không thể tải tin đăng",
    errorCopy: "Vui lòng thử lại sau ít phút.",
    contactTypes: {
      PHONE: "Điện thoại",
      EMAIL: "Email",
      WHATSAPP: "WhatsApp",
      ZALO: "Zalo",
      TELEGRAM: "Telegram",
    },
  },
};

export function getListingDetailCopy(locale: Locale) {
  return copies[locale];
}
