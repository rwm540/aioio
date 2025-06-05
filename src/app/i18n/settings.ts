// app/i18n/settings.ts

// زبان پیش‌فرض که اگر زبان مورد نظر کاربر پیدا نشد، ازش استفاده می‌شه.
export const fallbackLng = 'en';

// آرایه‌ای از تمام کدهای زبان که می‌خواید پروژه‌تون ازشون پشتیبانی کنه.
export const languages = ['en', 'fa', 'ar', 'fr', 'de', 'ru', 'zh', 'ko', 'ja'] as const;

// نام‌گذاری پیش‌فرض برای فایل‌های ترجمه (مثلاً common.json).
// می‌تونید برای بخش‌های مختلف برنامه، نام‌گذاری‌های متفاوتی داشته باشید (مثلاً home.json, auth.json).
export const defaultNS ='translation' as const;