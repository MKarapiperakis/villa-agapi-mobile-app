import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import en from "./en";
import gr from "./gr";
import de from "./de";

// Set the key-value pairs for the different languages you want to support.
const translations = {
  gr: gr,
  en: en,
  de: de,
};
const i18n = new I18n(translations);

i18n.locale = "en";

i18n.enableFallback = true;

export default i18n;
