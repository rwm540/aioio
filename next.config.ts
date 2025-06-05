
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  //  output: 'export', 
};

export default nextConfig;

// const nextConfig = {
//   reactStrictMode: true,
//   // === تنظیمات i18n برای Next.js ===
//   // این بخش به Next.js می‌گه که URLها باید شامل پیشوند زبان باشن
//   // و چه زبان‌هایی رو پشتیبانی می‌کنیم.
//   i18n: {
//     // همه زبان‌هایی که می‌خواید برنامه‌تون ازشون پشتیبانی کنه
//     locales: ['en', 'fa', 'ar', 'fr', 'de', 'ru', 'zh', 'ko', 'ja'],
//     // زبان پیش‌فرض؛ اگر کاربر وارد آدرس بدون پیشوند زبان بشه (مثلاً فقط /)، این زبان نمایش داده می‌شه.
//     defaultLocale: 'en',
//     // localeDetection: false, // اگر نمی‌خواید Next.js به صورت خودکار زبان مرورگر کاربر رو تشخیص بده، این خط رو از کامنت خارج کنید.
//   },
//   theme: {
//     extend: {
      
//       boxShadow: {
//         'glow-blue': '0 0 15px rgba(59, 130, 246, 0.8), 0 0 25px rgba(59, 130, 246, 0.6)',
//       },
//     },
//   },
//   plugins: [
//     require('tailwind-scrollbar'),
//   ],
//   important: true,
//   output: 'export',
// };

// export default nextConfig;
