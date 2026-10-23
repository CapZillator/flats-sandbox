import type { Locale } from "@/shared/i18n/config";

const copy = {
  en: {
    searchTitle: "Search",
    searchHint: "Choose a city, home type and move-in date.",
    citiesTitle: "Start with a city",
    citiesCopy: "Already know which city you'd like to live in?",
    citiesEmpty: "Cities will appear here as the location directory grows.",
    locationsError:
      "Cities could not be loaded. You can still search across Vietnam.",
    natureEmpty: "Landscape filters will appear here when available.",
    natureError:
      "Landscape filters could not be loaded. Explore the catalogue instead.",
    allHomes: "Explore all homes",
    map: "Explore on the map",
    recentTitle: "Fresh off the press",
    recentCopy: "Fresh finds are waiting for you.",
    recentEmptyTitle: "A new place to find your place",
    recentEmptyCopy:
      "Published homes will appear here. Have a place to rent? Be among the first to list it.",
    recentErrorTitle: "Homes could not be loaded",
    recentErrorCopy: "Try opening the catalogue again in a moment.",
    benefits: [
      {
        title: "A place you love",
        description: "Search by city or by the nature you'd like around you.",
      },
      {
        title: "On your terms",
        description: "Compare prices, lease terms and availability.",
      },
      {
        title: "Connect directly",
        description: "Contact the advertiser as soon as you register.",
      },
    ],
    hostTitle: "Renting out your home?",
    hostCopy: "List your property and start earning.",
    hostAction: "List your home",
  },
  ru: {
    searchTitle: "Искать",
    searchHint: "Выберите город, тип жилья и дату заезда.",
    citiesTitle: "Начните с города",
    citiesCopy: "Уже знаете, в каком городе хотите жить?",
    citiesEmpty: "Города появятся здесь по мере заполнения справочника.",
    locationsError:
      "Не удалось загрузить города. Поиск по всему Вьетнаму доступен.",
    natureEmpty: "Здесь появятся доступные фильтры по природе рядом.",
    natureError:
      "Не удалось загрузить фильтры по природе. Вы можете перейти в каталог.",
    allHomes: "Все объявления",
    map: "Посмотреть на карте",
    recentTitle: "С пылу, с жару",
    recentCopy: "Свежие варианты уже ждут.",
    recentEmptyTitle: "Место для вашего будущего дома",
    recentEmptyCopy:
      "Опубликованные объявления появятся здесь. Сдаёте жильё? Добавьте его одним из первых.",
    recentErrorTitle: "Не удалось загрузить объявления",
    recentErrorCopy: "Попробуйте открыть каталог немного позже.",
    benefits: [
      {
        title: "Любимое место",
        description:
          "Ищите по городу или природе, которую хочется видеть вокруг.",
      },
      {
        title: "На ваших условиях",
        description: "Сравнивайте цены, сроки аренды и доступность жилья.",
      },
      {
        title: "Общайтесь напрямую",
        description: "Контакты арендодателя доступны сразу после регистрации.",
      },
    ],
    hostTitle: "Сдаёте жильё в аренду?",
    hostCopy: "Разместите своё предложение и начните зарабатывать.",
    hostAction: "Добавить объявление",
  },
  vi: {
    searchTitle: "Tìm kiếm",
    searchHint: "Chọn thành phố, loại nhà và ngày chuyển vào.",
    citiesTitle: "Bắt đầu từ một thành phố",
    citiesCopy: "Bạn đã biết mình muốn sống ở thành phố nào chưa?",
    citiesEmpty:
      "Các thành phố sẽ xuất hiện khi danh mục địa điểm được bổ sung.",
    locationsError:
      "Không thể tải thành phố. Bạn vẫn có thể tìm trên toàn Việt Nam.",
    natureEmpty: "Bộ lọc cảnh quan sẽ xuất hiện khi có sẵn.",
    natureError:
      "Không thể tải bộ lọc cảnh quan. Bạn vẫn có thể xem danh sách nhà.",
    allHomes: "Xem tất cả nhà",
    map: "Khám phá trên bản đồ",
    recentTitle: "Mới ra lò",
    recentCopy: "Những lựa chọn mới đang chờ bạn.",
    recentEmptyTitle: "Một nơi để tìm ngôi nhà của bạn",
    recentEmptyCopy:
      "Nhà đã đăng sẽ xuất hiện ở đây. Có nhà cho thuê? Hãy là một trong những người đầu tiên đăng tin.",
    recentErrorTitle: "Không thể tải nhà",
    recentErrorCopy: "Vui lòng thử mở lại danh sách sau ít phút.",
    benefits: [
      {
        title: "Nơi bạn yêu thích",
        description:
          "Tìm theo thành phố hoặc cảnh quan thiên nhiên bạn muốn ở gần.",
      },
      {
        title: "Theo ý bạn",
        description: "So sánh giá thuê, thời hạn thuê và lịch trống.",
      },
      {
        title: "Liên hệ trực tiếp",
        description: "Xem thông tin liên hệ người đăng ngay sau khi đăng ký.",
      },
    ],
    hostTitle: "Bạn có nhà cho thuê?",
    hostCopy: "Đăng tin cho thuê và bắt đầu kiếm thêm thu nhập.",
    hostAction: "Đăng nhà",
  },
};

export function getHomeCopy(locale: Locale) {
  return copy[locale];
}
