import type { Locale } from "@/shared/i18n/config";

const copy = {
  en: {
    action: "Unpublish",
    description:
      "The listing will disappear from the catalogue and return to drafts. Photos and availability will be preserved. Publishing again requires moderation.",
    confirm: "Return to draft",
    cancel: "Cancel",
    success: "Listing returned to drafts",
    error: "Could not unpublish the listing. Please try again.",
    conflict: "The listing status has changed. Refresh the page and check it.",
  },
  ru: {
    action: "Снять с публикации",
    description:
      "Объявление исчезнет из каталога и вернётся в черновики. Фотографии и календарь сохранятся. Для повторной публикации понадобится модерация.",
    confirm: "Вернуть в черновик",
    cancel: "Отмена",
    success: "Объявление возвращено в черновики",
    error: "Не удалось снять объявление с публикации. Попробуйте ещё раз.",
    conflict: "Статус объявления изменился. Обновите страницу и проверьте его.",
  },
  vi: {
    action: "Ngừng đăng",
    description:
      "Tin sẽ biến mất khỏi danh mục và trở về bản nháp. Ảnh và lịch còn trống được giữ lại. Đăng lại cần được duyệt.",
    confirm: "Chuyển về bản nháp",
    cancel: "Hủy",
    success: "Tin đã chuyển về bản nháp",
    error: "Không thể ngừng đăng tin. Vui lòng thử lại.",
    conflict: "Trạng thái tin đã thay đổi. Hãy tải lại trang để kiểm tra.",
  },
};

export function getUnpublishCopy(locale: Locale) {
  return copy[locale];
}
