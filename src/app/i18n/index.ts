// app/i18n/index.ts

import { createInstance } from 'i18next'; // برای ساخت یک نمونه جدید از i18next
import resourcesToBackend from 'i18next-resources-to-backend'; // برای بارگذاری ترجمه‌ها از فایل‌ها
import { initReactI18next } from 'react-i18next/initReactI18next'; // برای ادغام با React و هوک‌هایش

// تنظیماتی که از فایل settings.ts ایمپورت کردیم.
import { fallbackLng, languages, defaultNS } from './settings';

// تابعی برای مقداردهی اولیه i18next در هر درخواست.
const initI18next = async (lng = fallbackLng, ns = defaultNS) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next) // استفاده از هوک‌های React
    .use(
      // استفاده از resourcesToBackend برای بارگذاری فایل‌های JSON ترجمه
      // از مسیر public/locales/${language}/${namespace}.json
      resourcesToBackend((language, namespace) =>
        import(`../../public/locales/${language}/${namespace}.json`)
      )
    )
    .init({
      lng, // زبان فعلی که باید بارگذاری بشه
      ns, // نام‌گذاری (Namespace) فعلی
      fallbackLng, // زبان جایگزین
      supportedLngs: languages, // همه زبان‌های پشتیبانی شده
      defaultNS, // نام‌گذاری پیش‌فرض
      fallbackNS: defaultNS, // نام‌گذاری جایگزین (اگر ترجمه در namespace فعلی پیدا نشد)
      // preload: اگر در سمت سرور هستیم، همه زبان‌ها رو پیش‌بارگذاری کن.
      preload: typeof window === 'undefined' ? languages : [],
    });
  return i18nInstance;
};

// هوک useTranslation سمت سرور
// این هوک رو در کامپوننت‌های سرور خودتون استفاده خواهید کرد تا متن‌ها رو ترجمه کنید.
export async function useTranslation(lng, ns = defaultNS, options = {}) {
  const i18nextInstance = await initI18next(lng, ns);
  return {
    // تابع `t` برای دریافت ترجمه‌ها
    t: i18nextInstance.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns, options.keyPrefix),
    i18n: i18nextInstance,
  };
}