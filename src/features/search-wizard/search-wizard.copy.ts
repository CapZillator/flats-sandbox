import type { Locale } from "@/shared/i18n/config";

const copy = {
  en: {
    title: "Answer a few questions and find your next home",
    titleHighlight: "home",
    subtitle: "Tell us what you are looking for, one step at a time.",
    location: "Where are you looking?",
    propertyType: "What kind of home would you like?",
    bedrooms: "How many bedrooms do you need?",
    maxPrice: "What is your maximum monthly rent?",
    currency: "Which currency would you like to use?",
    priceHint:
      "Leave blank for any budget. Choose your currency in the next step.",
    next: "Next",
    back: "Back",
    step: "Step",
    of: "of",
    searching: "Searching…",
    initial: "Your matches will appear here after you finish the questions.",
    locationsError:
      "Locations could not be loaded. Please reload the page to choose a city.",
  },
  ru: {
    title: "Ответь на несколько вопросов — и мы подберём подходящее жильё",
    titleHighlight: "жильё",
    subtitle: "Расскажи, что ищешь, шаг за шагом.",
    location: "Где ищем?",
    propertyType: "Какое жильё ищешь?",
    bedrooms: "Сколько спален нужно?",
    maxPrice: "Какая максимальная цена в месяц?",
    currency: "В какой валюте считаем?",
    priceHint:
      "Оставь поле пустым, если бюджет не ограничен. Валюту выберем на следующем шаге.",
    next: "Далее",
    back: "Назад",
    step: "Шаг",
    of: "из",
    searching: "Ищем…",
    initial: "Подходящие варианты появятся здесь после ответов на вопросы.",
    locationsError:
      "Не удалось загрузить города. Обнови страницу, чтобы выбрать город.",
  },
  vi: {
    title: "Trả lời vài câu hỏi để tìm ngôi nhà phù hợp",
    titleHighlight: "nhà",
    subtitle: "Cho chúng tôi biết từng bước bạn đang tìm kiếm điều gì.",
    location: "Bạn muốn tìm nhà ở đâu?",
    propertyType: "Bạn muốn loại nhà nào?",
    bedrooms: "Bạn cần bao nhiêu phòng ngủ?",
    maxPrice: "Ngân sách thuê tối đa mỗi tháng là bao nhiêu?",
    currency: "Bạn muốn sử dụng loại tiền tệ nào?",
    priceHint:
      "Để trống nếu không giới hạn ngân sách. Chọn tiền tệ ở bước tiếp theo.",
    next: "Tiếp theo",
    back: "Quay lại",
    step: "Bước",
    of: "trên",
    searching: "Đang tìm…",
    initial:
      "Các căn nhà phù hợp sẽ xuất hiện tại đây sau khi bạn trả lời xong.",
    locationsError:
      "Không tải được danh sách thành phố. Vui lòng tải lại trang để chọn thành phố.",
  },
} satisfies Record<Locale, Record<string, string>>;

export function getSearchWizardCopy(locale: Locale) {
  return copy[locale];
}
