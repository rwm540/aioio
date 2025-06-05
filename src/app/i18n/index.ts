// app/i18n/index.ts

import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';
;

import { fallbackLng, languages, defaultNS } from './settings';

// تابعی برای مقداردهی اولیه i18next در هر درخواست.
// تغییر: نوع `ns` را به `string | string[] | undefined` تغییر دهید.
// این به آن اجازه می‌دهد که یک رشته عمومی یا یک آرایه از رشته‌ها را بپذیرد.
const initI18next = async (lng = fallbackLng, ns: string | string[] | undefined = defaultNS) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend((language: string, namespace: string) =>
        import(`../../public/locales/${language}/${namespace}.json`)
      )
    )
    .init({
      lng,
      ns, // این خط الان `string | string[] | undefined` را می‌پذیرد.
      fallbackLng,
      supportedLngs: languages,
      defaultNS,
      fallbackNS: defaultNS,
      preload: typeof window === 'undefined' ? languages : [],
    });
  return i18nInstance;
};

// هوک useTranslation سمت سرور
export async function useTranslation(
  lng: string,
  ns: typeof defaultNS | string[] = defaultNS,
  options: { keyPrefix?: string } = {}
) {
  const i18nextInstance = await initI18next(
    lng,
    Array.isArray(ns) ? ns : ns // اگر ns آرایه بود، همان آرایه را پاس بدهید.
  );

  return {
    t: i18nextInstance.getFixedT(
      lng,
      Array.isArray(ns) ? ns[0] : ns, // اینجا می‌توانید از ns[0] استفاده کنید زیرا getFixedT یک رشته برای ns می‌خواهد.
      options.keyPrefix
    ),
    i18n: i18nextInstance,
  };
}