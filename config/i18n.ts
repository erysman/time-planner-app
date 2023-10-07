import * as Localization from 'expo-localization';
import { I18n } from "i18n-js";
import {Translations_EN, Translations_PL} from "../translations"

const translations = { ...Translations_EN, ...Translations_PL};
const i18n = new I18n(translations);
i18n.defaultLocale = "en";
i18n.enableFallback = true;
i18n.locale = Localization.locale;
// i18n.missingBehavior = "guess";

export default i18n;