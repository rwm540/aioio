/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  // === تنظیمات i18n برای Next.js ===
  // این بخش به Next.js می‌گه که URLها باید شامل پیشوند زبان باشن
  // و چه زبان‌هایی رو پشتیبانی می‌کنیم.
  i18n: {
    // همه زبان‌هایی که می‌خواید برنامه‌تون ازشون پشتیبانی کنه
    locales: ['en', 'fa', 'ar', 'fr', 'de', 'ru', 'zh', 'ko', 'ja'],
    // زبان پیش‌فرض؛ اگر کاربر وارد آدرس بدون پیشوند زبان بشه (مثلاً فقط /)، این زبان نمایش داده می‌شه.
    defaultLocale: 'en',
    // localeDetection: false, // اگر نمی‌خواید Next.js به صورت خودکار زبان مرورگر کاربر رو تشخیص بده، این خط رو از کامنت خارج کنید.
  },
};

export default nextConfig;
