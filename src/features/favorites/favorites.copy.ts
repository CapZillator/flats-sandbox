import type { Locale } from "@/shared/i18n/config";

const copy = {
  en: {
    description:
      "Keep the homes you like here and compare them at your own pace.",
    empty:
      "Save homes from the catalogue using the heart button. They will appear here.",
    browse: "Browse homes",
    errorTitle: "Could not load favorites",
    error: "Could not retrieve your saved homes. Please try again.",
    previous: "Previous",
    next: "Next",
    pagination: "Favorites pages",
    page: "Page",
    of: "of",
    total: "Saved homes",
    updating: "Updating favorites…",
    signIn: "Your session has expired. Sign in to view your favorites.",
  },
  ru: {
    description:
      "Сохраняйте понравившееся жильё и сравнивайте варианты без спешки.",
    empty:
      "Нажмите на сердечко в каталоге — понравившееся жильё появится здесь.",
    browse: "Найти жильё",
    errorTitle: "Не удалось загрузить избранное",
    error: "Не удалось получить сохранённые объявления. Попробуйте ещё раз.",
    previous: "Назад",
    next: "Далее",
    pagination: "Страницы избранного",
    page: "Страница",
    of: "из",
    total: "Сохранено объявлений",
    updating: "Обновляем избранное…",
    signIn: "Сессия истекла. Войдите, чтобы посмотреть избранное.",
  },
  vi: {
    description: "Lưu những căn nhà bạn thích và so sánh khi thuận tiện.",
    empty:
      "Nhấn vào biểu tượng trái tim trong danh sách nhà. Nhà đã lưu sẽ xuất hiện ở đây.",
    browse: "Tìm nhà",
    errorTitle: "Không thể tải mục yêu thích",
    error: "Không thể tải nhà đã lưu. Vui lòng thử lại.",
    previous: "Trước",
    next: "Tiếp",
    pagination: "Các trang yêu thích",
    page: "Trang",
    of: "trên",
    total: "Nhà đã lưu",
    updating: "Đang cập nhật mục yêu thích…",
    signIn: "Phiên đăng nhập đã hết hạn. Đăng nhập để xem mục yêu thích.",
  },
};

export function getFavoritesCopy(locale: Locale) {
  return copy[locale];
}
