import type { Locale } from "@/shared/i18n/config";

const copy = {
  en: {
    action: "Delete listing",
    description:
      "Delete this listing permanently? Photos will be deleted from Cloudflare; cleanup is retried automatically if the provider is unavailable. The listing cannot be restored.",
    confirm: "Delete permanently",
    cancel: "Cancel",
    success: "Listing deleted. Photo cleanup queued.",
    error: "Could not delete the listing. Please try again.",
  },
  ru: {
    action: "Удалить объявление",
    description:
      "Удалить объявление навсегда? Фотографии будут удалены из Cloudflare; при сбое провайдера очистка повторится автоматически. Восстановить объявление не получится.",
    confirm: "Удалить навсегда",
    cancel: "Отмена",
    success: "Объявление удалено. Очистка фото поставлена в очередь.",
    error: "Не удалось удалить объявление. Попробуйте ещё раз.",
  },
  vi: {
    action: "Xóa tin",
    description:
      "Xóa tin vĩnh viễn? Ảnh sẽ được xóa khỏi Cloudflare; hệ thống tự thử lại nếu nhà cung cấp không khả dụng. Không thể khôi phục tin.",
    confirm: "Xóa vĩnh viễn",
    cancel: "Hủy",
    success: "Đã xóa tin. Ảnh đã được đưa vào hàng đợi xóa.",
    error: "Không thể xóa tin. Vui lòng thử lại.",
  },
};

export function getDeleteCopy(locale: Locale) {
  return copy[locale];
}
