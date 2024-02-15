import i18n from 'i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from "react-i18next";
import {getLanguage} from "../store/user/index";

const language = getLanguage()

i18n.use(Backend).use(LanguageDetector).use(initReactI18next).init({
    fallbackLng: language,
    debug: true,
    detection: {
        order: ['querystring', 'cookie'],
        cache: ['cookie']
    },
    interpolation: {
        escapeValue: false
    }
})

export default i18n