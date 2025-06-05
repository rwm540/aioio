// app/components/chat/ChatSidebar.tsx
"use client";

import { motion,Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// وارد کردن آیکون‌های جدید از Lucide React
import {
  Plus,
  MessageSquare,
  Trash2
} from "lucide-react";


// وارد کردن کامپوننت‌های Shadcn UI برای دیالوگ هشدار (AlertDialog)
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";

// Type Definitions (همچنان پیشنهاد می‌شود اینها را به types/chat.ts منتقل کنید)
interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface ChatSession {
  id: string;
  name: string;
  messages: Message[];
}

interface ChatSidebarProps {
  chatSessions: ChatSession[];
  activeChatId: string | null;
  handleNewChat: () => void;
  handleSelectChat: (id: string) => void;
  handleDeleteChat: (id: string) => void; 
  sidebarVariants: Variants; 
  itemVariants: Variants; 
}

export default function ChatSidebar({
  chatSessions,
  activeChatId,
  handleNewChat,
  handleSelectChat,
  handleDeleteChat,
  sidebarVariants,
  itemVariants
}: ChatSidebarProps) {
  return (
    <>
      <div className="hidden md:flex h-screen items-center justify-start py-8 pl-4">
        <motion.aside
          className="flex  left-[-20px] flex-col w-72 bg-gradient-to-br from-gray-900 via-blue-950 to-purple-950 p-6 shadow-2xl border border-gray-700 relative z-10
                       h-[90vh] rounded-3xl overflow-hidden"
          variants={sidebarVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex-1 flex flex-col">
            {/* New Chat Button */}
            <motion.div
              variants={itemVariants}
              className="mb-8 flex justify-center"
            >
              <Button
                onClick={handleNewChat}
                className="w-full
               sm:w-auto sm:max-w-[200px]
               lg:max-w-[220px] 
               text-base md:text-lg 
               px-4 py-2 md:px-5 md:py-3
               bg-gradient-to-r from-purple-600 to-blue-600 text-white
               hover:from-purple-700 hover:to-blue-700
               rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-95
               flex items-center justify-center space-x-2 rtl:space-x-reverse
               font-bold tracking-wide
               relative overflow-hidden
               before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:left-[-100%] before:animate-shimmer // افکت شیمر
               "
              >
                <Plus className="h-5 w-5 stroke-2" />{" "}
                {/* اندازه آیکون ثابت نگه داشته می‌شود */}
                <span className="text-white relative z-10">چت جدید</span>
              </Button>
            </motion.div>

            <Separator className="my-6 bg-gray-700" />

            {/* List of saved chat sessions */}
            <motion.div
              variants={itemVariants}
              className="flex-1 min-h-0 flex flex-col"
            >
              <ScrollArea className="rounded-lg border border-gray-700 p-2 bg-gray-800/60 overflow-y-auto max-h-[calc(100%-40px)]">
                {chatSessions.length === 0 ? (
                  <p className="text-gray-500 text-center text-sm p-4">
                   هیچ  چتی وجود  ندارد
                  </p>
                ) : (
                  chatSessions.map((chat) => (
                    <div
                      key={chat.id}
                      className={`relative flex items-center w-full h-auto p-2 mb-2 text-wrap break-words rounded-lg transition-all
                      ${
                        activeChatId === chat.id
                          ? "bg-blue-600/30 text-blue-200 font-semibold shadow-md border border-blue-500"
                          : "bg-gray-800/40 text-gray-300 hover:bg-gray-700/50"
                      }
                    `}
                    >
                      <Button
                        variant="ghost"
                        onClick={() => handleSelectChat(chat.id)}
                        // Adjust padding-right to make space for the trash icon on the left
                        className="flex-1 text-right justify-end p-1 h-auto font-normal text-current hover:bg-transparent pr-8"
                      >
                        <MessageSquare className="ml-2 h-4 w-4 shrink-0" />
                        <span className="truncate">{chat.name}</span>
                      </Button>

                      {/* Always Visible Delete Icon */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost" // 'ghost' به طور پیش‌فرض پس‌زمینه ندارد، اما می‌تواند اثر هاور داشته باشد
                            size="icon"
                            className="absolute left-1 h-8 w-8 text-red-400 rounded-full
             hover:bg-transparent hover:text-red-300 md:right-4" // تغییرات در اینجا
                          >
                            <Trash2 className="mr-2 h-4 w-4" />{" "}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent
                          // اضافه کردن dir="rtl" به AlertDialogContent
                          dir="rtl"
                          className="bg-gray-800 text-white border-gray-700 rounded-lg
               w-[90%] max-w-md mx-auto p-4 md:p-6" // عرض واکنش‌گرا و پدینگ
                        >
                          <AlertDialogHeader>
                            <AlertDialogTitle
                              className="text-white text-xl font-bold text-right" // راست‌چین کردن عنوان
                            >
                              آیا از حذف این مکالمه اطمینان دارید؟
                            </AlertDialogTitle>
                            <AlertDialogDescription
                              className="text-gray-400 text-sm mt-2 text-right" // راست‌چین کردن توضیحات
                            >
                              این عملیات غیرقابل بازگشت است و تمام پیام‌های این
                              مکالمه حذف خواهند شد.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter
                            className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-start sm:space-x-reverse sm:space-x-3 rtl:space-x-reverse"
                            // چینش دکمه‌ها برای RTL: Cancel سمت راست، Action سمت چپ
                            // sm:justify-start برای زمانی که دکمه‌ها در یک ردیف قرار می‌گیرند (چینش از راست به چپ)
                            // sm:space-x-reverse sm:space-x-3 برای فاصله بین دکمه‌ها در RTL
                          >
                            <AlertDialogCancel
                              className="bg-gray-700 text-gray-200 hover:bg-gray-600 border-none transition-colors duration-200
                   w-full sm:w-auto mt-2 sm:mt-0" // عرض کامل در موبایل، خودکار در دسکتاپ
                            >
                              لغو
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteChat(chat.id)}
                              className="bg-red-600 text-white hover:bg-red-700 transition-colors duration-200
                   w-full sm:w-auto" // عرض کامل در موبایل، خودکار در دسکتاپ
                            >
                              حذف کن
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ))
                )}
              </ScrollArea>
            </motion.div>
          </div>
        </motion.aside>
      </div>
    </>
  );
}
