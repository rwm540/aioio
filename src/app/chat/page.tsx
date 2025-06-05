// app/chat/page.tsx
"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { motion } from "framer-motion";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
 // New import for avatars
import Image from "next/image";

// Global Styles
import "../globals.css"; // Make sure this CSS file is present and correctly configured

// Type Definitions (Consider moving to a shared types/chat.ts file)
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

// Custom Components
import ChatSidebar from "../components/chat/ChatSidebar";
import ChatMessages from "../components/chat/ChatMessages"; // Import the new ChatMessages component
import ChatInput from "../components/chat/ChatInput";
import MobileSidebar from "../components/chat/MobileSidebar";

export default function ChatRoomPage() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Controls Sheet visibility for mobile sidebar

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat sessions from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSessions = localStorage.getItem("oio_chat_sessions");
      if (savedSessions) {
        const parsedSessions: ChatSession[] = JSON.parse(savedSessions).map(
          (session: ChatSession) => ({
            ...session,
            messages: session.messages.map((msg) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }))
          })
        );
        setChatSessions(parsedSessions);
        const lastActiveId = localStorage.getItem("oio_last_active_chat_id");
        if (lastActiveId && parsedSessions.some((s) => s.id === lastActiveId)) {
          setActiveChatId(lastActiveId);
        }
        else if (parsedSessions.length > 0) {
          setActiveChatId(parsedSessions[0].id);
        }
      }
    }
  }, []);

  // Save chat sessions and active chat ID to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("oio_chat_sessions", JSON.stringify(chatSessions));
      if (activeChatId) {
        localStorage.setItem("oio_last_active_chat_id", activeChatId);
      }
      else {
        localStorage.removeItem("oio_last_active_chat_id");
      }
    }
  }, [chatSessions, activeChatId]);

  // Extract messages for the currently active chat
  const activeChatMessages = useMemo(() => {
    return activeChatId
      ? chatSessions.find((session) => session.id === activeChatId)?.messages ||
        []
      : [];
  }, [activeChatId, chatSessions]); 

  // Scroll to the bottom of the messages whenever activeChatMessages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChatMessages]);

  // Handle creating a new chat session
  const handleNewChat = () => {
    const newChat: ChatSession = {
      id: `chat-${Date.now()}`,
      name: `گفتگوی جدید - ${new Date().toLocaleDateString("fa-IR")}`,
      messages: []
    };
    setChatSessions((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setInputMessage("");
    if (isSidebarOpen) setIsSidebarOpen(false); // Close sidebar on mobile after creating new chat
  };

  // Handle selecting an existing chat session from the sidebar
  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    setInputMessage("");
    if (isSidebarOpen) setIsSidebarOpen(false); // Close sidebar on mobile after selecting chat
  };

  // Handle sending a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;

    let targetChatId = activeChatId;
    let newChatCreated = false;

    // --- تغییرات اینجا اعمال می‌شود ---
    // شرط جدید: چت جدید فقط زمانی ایجاد شود که
    // 1. هیچ چت فعالی وجود نداشته باشد (targetChatId === null)
    // 2. و هیچ چت ذخیره شده ای هم وجود نداشته باشد (chatSessions.length === 0)
    if (targetChatId === null && chatSessions.length === 0) { //
      targetChatId = `chat-${Date.now()}`; //
      const newChat: ChatSession = { //
        id: targetChatId, //
        name: `مکالمه ${chatSessions.length + 1}`, // Temporary name
        messages: [] //
      };
      setChatSessions((prev) => [newChat, ...prev]); //
      setActiveChatId(targetChatId); //
      newChatCreated = true; //
    }
    // اگر چت فعالی وجود دارد، از همان استفاده می‌کنیم.
    // اگر چت فعالی وجود ندارد اما چت‌های ذخیره شده‌ای هست، پیام به اولین چت ذخیره شده اضافه می‌شود (این حالت بعید است چون activeChatId تنظیم می‌شود).
    // مهم: اگر targetChatId هنوز null باشد (یعنی نه چت فعال بود و نه چت ذخیره شده‌ای داشتیم اما به دلایلی شرط بالا فعال نشد),
    // باید یک کنترل اضافه کنیم تا مطمئن شویم پیام به جایی ارسال می‌شود.
    // اما با منطق جدید، این سناریو نباید رخ دهد.

    const newUserMessage: Message = { //
      id: `msg-${Date.now()}-user`, //
      text: inputMessage.trim(), //
      sender: "user", //
      timestamp: new Date() //
    };

    // Update chat sessions with the new user message
    // مطمئن می‌شویم که targetChatId الان حتماً یک مقدار دارد
    if (!targetChatId) { //
        // این حالت نباید رخ دهد اگر منطق بالا درست کار کند
        // اما برای اطمینان بیشتر می‌توان یک fallback ایجاد کرد.
        // مثلاً ایجاد یک چت جدید اجباری اگر هنوز targetChatId مشخص نشده
        console.error("No active chat ID to send message to. This should not happen."); //
        return; 
    }

    setChatSessions((prevSessions) => { 
      return prevSessions.map((sessionItem) => { 
        if (sessionItem.id === targetChatId) { 
          const updatedMessages = [...sessionItem.messages, newUserMessage]; 

          // Simulate AI response
          const aiResponseText = newUserMessage.text; 
          const newAiMessage: Message = { 
            id: `msg-${Date.now()}-ai`, 
            text: aiResponseText, 
            sender: "ai", 
            timestamp: new Date(Date.now() + 500) 
          };
          return { 
            ...sessionItem, 
            messages: [...updatedMessages, newAiMessage] 
          };
        }
        return sessionItem; 
      });
    });

    // If a new chat was created, update its name based on the first message
    if (newChatCreated && newUserMessage.text.length > 5) { //
      setChatSessions((prevSessions) => { //
        return prevSessions.map((sessionItem) => { //
          if (sessionItem.id === targetChatId) { //
            return { //
              ...sessionItem, //
              name: //
                newUserMessage.text.substring(0, 25) + //
                (newUserMessage.text.length > 25 ? "..." : "") //
            };
          }
          return sessionItem; //
        });
      });
    }

    setInputMessage(""); // Clear input field
  };
  // Update chat sessions with the new user message



  // Handle Enter key for sending message (without Shift)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  // Framer Motion Variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.05
      }
    }
  };

  const sidebarVariants = {
    hidden: { x: 100, opacity: 0 }, // For desktop sidebar animation (from right)
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const chatAreaVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut", delay: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 }, // For animating individual items in sidebar
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  // تابع جدید برای حذف چت
  const handleDeleteChat = (id: string) => {
    setChatSessions((prev) => {
      const updatedSessions = prev.filter((chat) => chat.id !== id);
      // اگر چت فعلی حذف شد، یک چت دیگر را فعال کن یا null
      if (activeChatId === id) {
        setActiveChatId(
          updatedSessions.length > 0 ? updatedSessions[0].id : null
        );
      }
      return updatedSessions;
    });
  };

  const handleBuyAIClick = () => {
    // اینجا می‌توانید کد مربوط به هدایت کاربر به صفحه خرید یا باز کردن مودال را قرار دهید
    console.log("دکمه خرید پنل AI کلیک شد!");
    // مثال: هدایت به یک URL
    // window.location.href = "/buy-ai-panel";
    // یا باز کردن یک مودال
    // openBuyPanelModal();
  };

  return (
    <>
      <motion.div
        className="flex h-screen bg-gradient-to-br from-gray-800 via-blue-900 to-purple-900"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        dir="rtl"
      >
        {/* Chat AI - این Div حالا با fixed به گوشه بالا-چپ می‌چسبد */}
        <motion.div
          variants={itemVariants}
          className="fixed top-9 left-4 z-50 flex items-center gap-2 p-2 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-white"
        >
          <Image
            src="/iconAI/WhiteGPT.png"
            alt="هوش مصنوعی OIO"
            width={30}
            height={30}
            priority
            className="drop-shadow-lg"
          />
          <span className="text-white text-20 font-semibold whitespace-nowrap">
            ChatGPT4O
          </span>
        </motion.div>
        {/* استفاده از کامپوننت Button از Shadcn UI */}
        <Button
          onClick={handleBuyAIClick}
          className="fixed top-9 left-45 z-50 flex w-30 h-[48] items-center gap-2 p-2 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-white
             transition-all duration-300 ease-in-out 
             hover:bg-white/10 hover:scale-105"
        >
          خرید پنل AI
        </Button>
        {/* Chat AI */}

        {/* Desktop/Tablet Sidebar */}
        <ChatSidebar
          chatSessions={chatSessions}
          activeChatId={activeChatId}
          handleNewChat={handleNewChat}
          handleSelectChat={handleSelectChat}
          handleDeleteChat={handleDeleteChat}
          sidebarVariants={sidebarVariants}
          itemVariants={itemVariants}
        />
        {/* Desktop/Tablet Sidebar */}

        {/* Main Chat Area */}
        <motion.main
          className="flex-1 flex flex-col p-4 md:p-8 m-0 md:my-4 md:ml-4 relative z-0" // More rounded, stronger shadow, subtle border
          variants={chatAreaVariants}
          initial="hidden"
          animate="visible"
        >
          {/* منوی ساید بار به صورت ریسپانسیو */}
          <MobileSidebar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            chatSessions={chatSessions}
            activeChatId={activeChatId}
            handleNewChat={handleNewChat}
            handleSelectChat={handleSelectChat}
            handleDeleteChat={handleDeleteChat}
          />
          {/* منوی ساید بار به صورت ریسپانسیو */}

          {/* Chat Messages Display Area view messages chat */}
          <ChatMessages
            messages={activeChatMessages}
            activeChatId={activeChatId}
            hasChatSessions={chatSessions.length > 0}
          />
          {/* Chat Messages Display Area view messages chat */}

          {/* Chat Input Form */}
          {/* استفاده از کامپوننت ChatInput جدید */}
          <ChatInput
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            handleSendMessage={handleSendMessage}
            handleKeyDown={handleKeyDown}
          />
          {/* Chat Input Form */}
        </motion.main>
      </motion.div>
    </>
  );
}
