// app/page.tsx
'use client'

import "./globals.css";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import React, { useEffect, useState} from 'react';
import Image from 'next/image';
import Loading from '@/components/Loading';



export default function Home() {
  

  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [isClient, setIsClient] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  // 💡 جدید: وضعیت برای کنترل نمایش لودینگ هنگام کلیک روی دکمه
  const [showButtonLoading, setShowButtonLoading] = useState(false);


  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      setIsClient(true);

      const loadingTimer = setTimeout(() => {
        setDataLoaded(true); // بعد از این تأخیر، محتوا آماده نمایش است
      }, 2000); // 2000 میلی‌ثانیه = 2 ثانیه. می‌توانید این مقدار را تغییر دهید.

      const handleResize = () => {
        setWindowDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        clearTimeout(loadingTimer); // 💡 پاک کردن تایمر در صورت unmount شدن کامپوننت
      };
    }
  }, []);

  // 💡 اگر SnowfallBackground را از app/page.tsx حذف کرده و فقط در Loading.tsx قرار داده‌اید،
  // این کد particles را می‌توانید حذف کنید:
  const particles = Array.from({ length: 50 }).map((_, i) => {
    const randomInitialX = Math.random();
    const randomInitialY = Math.random();

    return (
      <motion.div
        key={i}
        className="absolute bg-white rounded-full opacity-60"
        initial={{
          x: windowDimensions.width * randomInitialX,
          y: windowDimensions.height * randomInitialY,
          scale: Math.random() * 0.5 + 0.5,
          opacity: 0,
        }}
        animate={{
          y: [
            windowDimensions.height * randomInitialY,
            windowDimensions.height * (randomInitialY + 0.1) + 100,
          ],
          x: [
            windowDimensions.width * randomInitialX,
            windowDimensions.width * (randomInitialX + 0.05) + 50,
          ],
          opacity: [0, 0.6, 0.4, 0.6, 0],
          scale: [
            Math.random() * 0.5 + 0.5,
            Math.random() * 0.5 + 0.5,
            Math.random() * 0.5 + 0.5,
          ],
        }}
        transition={{
          duration: Math.random() * 10 + 5,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
        }}
        style={{
          width: `${Math.random() * 4 + 2}px`,
          height: `${Math.random() * 4 + 2}px`,
        }}
      />
    );
  });
// 💡 پایان کد particles که می‌توان حذف کرد


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.5,
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };
  
  // 💡 تابع جدید برای مدیریت کلیک روی دکمه شروع
  const handleStartClick = async () => {
    setShowButtonLoading(true); // لودینگ را فعال کن
    
    //await signIn("google", { callbackUrl: "/chat" }); // فرآیند احراز هویت گوگل را شروع کن
    // توجه: بعد از signIn، صفحه ریدایرکت می‌شود، بنابراین کد بعدی اجرا نمی‌شود
    // اگر ریدایرکت نشد (مثلا در صورت خطا)، باید setShowButtonLoading(false) را اینجا اضافه کنید.
    window.location.href = "/chat";
  };

  // 💡 شرط نمایش کامپوننت Loading حالا شامل 'dataLoaded' و 'showButtonLoading' می‌شود.
  if (!isClient || windowDimensions.width === 0 || !dataLoaded || showButtonLoading) {
    // 💡 اگر showButtonLoading فعال باشد، پیام مناسبی برای لودینگ احراز هویت نشان دهید
    const loadingMessage = showButtonLoading ? "درحال  اتصال  به  پنل..." : "";
    return <Loading message={loadingMessage} />;
  }

  return (
    <motion.div
      className="relative flex flex-col items-center justify-center min-h-screen
                 bg-gradient-to-br from-gray-800 via-blue-900 to-purple-900
                 text-white text-center px-4 overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      
      {/* 💡 در غیر این صورت، از این div particles استفاده کنید (اگر حذف نکرده‌اید): */}
      <div className="absolute inset-0 z-0">{particles}</div>


      <motion.div className="relative z-10 flex flex-col items-center justify-center">
        {/* 💡 تغییرات اصلی در این motion.div اعمال شده است */}
        <motion.div
          className="mb-6 flex items-center justify-center w-36 h-36 sm:w-48 sm:h-48"
          initial={{ opacity: 1, y: 0, scale: 1 }}
          animate={{
            y: [0, -10, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
          style={{ transformOrigin: 'center center', willChange: 'transform' }}
        >
          <Image
            src="/OIO_M1.png"
            alt="هوش مصنوعی OIO"
            width={120}
            height={120}
            priority
            className="drop-shadow-lg"
          />
        </motion.div>

        {/* 💡 تغییر onClick دکمه و حذف Link */}
        <motion.div variants={itemVariants}>
          <Button
            onClick={handleStartClick} // 💡 فراخوانی تابع جدید
            className="text-lg px-6 py-3 bg-black text-white hover:bg-gray-800" // 💡 رنگ دکمه را برای وضوح بیشتر تغییر دادم
          >
            بیا صحبت  کنیم
          </Button>
        </motion.div>

      </motion.div>
    </motion.div>
  );
}