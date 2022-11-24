import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: localStorage.getItem("lang") || "zh-cn",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    returnEmptyString: false,
  });

export default i18n;
