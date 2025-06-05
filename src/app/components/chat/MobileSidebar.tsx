// app/components/chat/MobileSidebar.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Plus, MessageSquare, Menu, Trash2} from "lucide-react";

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

interface MobileSidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  chatSessions: ChatSession[];
  activeChatId: string | null;
  handleNewChat: () => void;
  handleSelectChat: (id: string) => void;
  handleDeleteChat: (id: string) => void;
}

export default function MobileSidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  chatSessions,
  activeChatId,
  handleNewChat,
  handleSelectChat,
  handleDeleteChat,
}: MobileSidebarProps) {
  return (
    <div className="md:hidden fixed top-0 right-0 z-50 p-2">
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-gray-200 bg-gray-800 hover:bg-gray-700 rounded-full"
          >
            <Menu className="h-5 w-5 stroke-2" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-72 bg-gradient-to-br from-gray-900 via-blue-950 to-purple-950 p-6 shadow-2xl border border-gray-700 rounded-3xl
                      flex flex-col overflow-hidden text-white"
        >
          
          <div className="flex-1 flex flex-col pt-8">

            <div className="mb-8 flex justify-center">
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
                before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:left-[-100%] before:animate-shimmer"
              >
                <span className="text-white relative z-10">چت جدید</span>
                <Plus className="h-5 w-5 stroke-2" />
              </Button>
            </div>

            <Separator className="my-6 bg-gray-700" />

            <ScrollArea className="flex-1 rounded-lg border border-gray-700 p-2 bg-gray-800/60 overflow-y-auto max-h-[calc(100%-40px)]">
              {chatSessions.length === 0 ? (
                <p className="text-gray-500 text-center text-sm p-4">
                  هیچ چتی وجود ندارد
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
                      onClick={() => {
                        handleSelectChat(chat.id);
                        setIsSidebarOpen(false);
                      }}
                      className="flex-1 text-right justify-end p-1 h-auto font-normal text-current hover:bg-transparent pr-8"
                    >
                      <MessageSquare className="ml-2 h-4 w-4 shrink-0" />
                      <span className="truncate">{chat.name}</span>
                    </Button>


                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute left-1 h-8 w-8 text-red-400 rounded-full
                            hover:bg-transparent hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent
                        dir="rtl"
                        className="bg-gray-800 text-white border-gray-700 rounded-lg
                          w-[90%] max-w-md mx-auto p-4 md:p-6"
                      >
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white text-xl font-bold text-right">
                            آیا از حذف این مکالمه اطمینان دارید؟
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-400 text-sm mt-2 text-right">
                            این عملیات غیرقابل بازگشت است و تمام پیام‌های این
                            مکالمه حذف خواهند شد.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter
                          className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-start sm:space-x-reverse sm:space-x-3 rtl:space-x-reverse"
                        >
                          <AlertDialogCancel className="bg-gray-700 text-gray-200 hover:bg-gray-600 border-none transition-colors duration-200 w-full sm:w-auto mt-2 sm:mt-0">
                            لغو
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              handleDeleteChat(chat.id);
                            }}
                            className="bg-red-600 text-white hover:bg-red-700 transition-colors duration-200 w-full sm:w-auto"
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
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}