// components/Loading.tsx
'use client';

import React, { useEffect, useState } from 'react'; // 💡 ایمپورت useState و useEffect برای مدیریت ابعاد پنجره و ذرات برف
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  message?: string;
  showSpinner?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ message, showSpinner = true }) => {
  // 💡 اضافه شدن وضعیت برای ابعاد پنجره و رندر سمت کلاینت (مشابه SnowfallBackground)
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      setIsClient(true);

      const handleResize = () => {
        setWindowDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  // 💡 تولید ذرات برف مستقیماً در اینجا
  const particleCount = 50;
  const particleColor = '#FFFFFF';
  const particleOpacity = 0.8;
  const minSize = 1;
  const maxSize = 4;
  const speed = 1.5;

  const snowParticles = Array.from({ length: particleCount }).map((_, i) => {
    const randomInitialX = Math.random();
    const randomInitialY = Math.random();

    // برای جلوگیری از خطای رندرینگ قبل از اینکه ابعاد پنجره محاسبه شود
    if (!isClient || windowDimensions.width === 0) return null;

    return (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          backgroundColor: particleColor,
          opacity: particleOpacity,
          width: `${Math.random() * (maxSize - minSize) + minSize}px`,
          height: `${Math.random() * (maxSize - minSize) + minSize}px`,
          top: `${randomInitialY * 100}%`,
          left: `${randomInitialX * 100}%`,
        }}
        initial={{
          y: -50,
          x: windowDimensions.width * randomInitialX,
          opacity: 0,
          scale: Math.random() * 0.5 + 0.5,
        }}
        animate={{
          y: [windowDimensions.height * randomInitialY, windowDimensions.height + 50],
          x: [
            windowDimensions.width * randomInitialX,
            windowDimensions.width * randomInitialX + (Math.random() - 0.5) * 100,
          ],
          opacity: [0, particleOpacity, particleOpacity, 0],
          scale: [
            Math.random() * 0.5 + 0.5,
            Math.random() * 0.5 + 0.5,
            Math.random() * 0.5 + 0.5,
          ],
        }}
        transition={{
          duration: Math.random() * 8 + 4 / speed,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
          delay: Math.random() * 5,
        }}
      />
    );
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut", when: "beforeChildren", staggerChildren: 0.1 },
    },
    exit: { opacity: 0, transition: { duration: 0.4, ease: "easeIn" } },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay: 0.5 } },
  };

  const spinnerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.8 } },
  };

  return (
    <motion.div
      className="relative flex flex-col items-center justify-center min-h-screen
                 bg-gray-900 text-foreground p-4 overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* 💡 ذرات برف مستقیماً اینجا رندر می‌شوند */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {snowParticles}
      </div>

      {/* محتوای اصلی لودینگ (اسپینر و پیام) */}
      <motion.div className="relative z-10 flex flex-col items-center justify-center">
        {showSpinner && (
          <motion.div variants={spinnerVariants} className="mb-6">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
          </motion.div>
        )}

        {message && (
          <motion.p
            variants={textVariants}
            className="text-xl md:text-2xl font-vazirmatn text-white text-center opacity-80"
          >
            {message}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Loading;