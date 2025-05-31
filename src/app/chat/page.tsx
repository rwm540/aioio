// app/chat/page.tsx
'use client';

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card"; // فقط Card و CardContent مورد نیاز است
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// Custom Components
import Loading from '@/components/Loading'; // مطمئن شوید این کامپوننت وجود دارد

// Global Styles
import "../globals.css";

// Type Definitions
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatSession {
  id: string;
  name: string;
  messages: Message[];
}

export default function ChatRoomPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Controls Sheet visibility for mobile sidebar

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat sessions from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSessions = localStorage.getItem('oio_chat_sessions');
      if (savedSessions) {
        // Parse dates correctly when loading from JSON
        const parsedSessions: ChatSession[] = JSON.parse(savedSessions).map((session: ChatSession) => ({
          ...session,
          messages: session.messages.map(msg => ({ ...msg, timestamp: new Date(msg.timestamp) }))
        }));
        setChatSessions(parsedSessions);
        const lastActiveId = localStorage.getItem('oio_last_active_chat_id');
        // Set active chat based on last active ID or the first session
        if (lastActiveId && parsedSessions.some(s => s.id === lastActiveId)) {
          setActiveChatId(lastActiveId);
        } else if (parsedSessions.length > 0) {
          setActiveChatId(parsedSessions[0].id);
        }
      }
    }
  }, []);

  // Save chat sessions and active chat ID to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem('oio_chat_sessions', JSON.stringify(chatSessions));
      if (activeChatId) {
        localStorage.setItem('oio_last_active_chat_id', activeChatId);
      } else {
        localStorage.removeItem('oio_last_active_chat_id');
      }
    }
  }, [chatSessions, activeChatId]);

  // Extract messages for the currently active chat
  const activeChatMessages = activeChatId
    ? chatSessions.find(session => session.id === activeChatId)?.messages || []
    : [];

  // Scroll to the bottom of the messages whenever activeChatMessages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChatMessages]);

  // Redirect unauthenticated users to the homepage
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Handle user sign out
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/", redirect: true });
  };

  // Handle creating a new chat session
  const handleNewChat = () => {
    const newChat: ChatSession = {
      id: `chat-${Date.now()}`,
      name: `گفتگوی جدید - ${new Date().toLocaleDateString('fa-IR')}`,
      messages: [],
    };
    setChatSessions(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setInputMessage('');
    if (isSidebarOpen) setIsSidebarOpen(false); // Close sidebar on mobile after creating new chat
  };

  // Handle selecting an existing chat session from the sidebar
  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    setInputMessage('');
    if (isSidebarOpen) setIsSidebarOpen(false); // Close sidebar on mobile after selecting chat
  };

  // Handle sending a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() === '') return;

    let targetChatId = activeChatId;
    let newChatCreated = false;

    // If no active chat or current active chat has no messages, create a new one
    if (!activeChatId || activeChatMessages.length === 0) {
      targetChatId = `chat-${Date.now()}`;
      const newChat: ChatSession = {
        id: targetChatId,
        name: `مکالمه ${chatSessions.length + 1}`, // Temporary name
        messages: [],
      };
      setChatSessions(prev => [newChat, ...prev]);
      setActiveChatId(targetChatId);
      newChatCreated = true;
    }

    const newUserMessage: Message = {
      id: `msg-${Date.now()}-user`,
      text: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    // Update chat sessions with the new user message
    setChatSessions(prevSessions => {
      return prevSessions.map(sessionItem => {
        if (sessionItem.id === targetChatId) {
          const updatedMessages = [...sessionItem.messages, newUserMessage];

          // Simulate AI response
          const aiResponseText = `پاسخ OIO به: "${newUserMessage.text.substring(0, 50)}${newUserMessage.text.length > 50 ? '...' : ''}"`;
          const newAiMessage: Message = {
            id: `msg-${Date.now()}-ai`,
            text: aiResponseText,
            sender: 'ai',
            timestamp: new Date(Date.now() + 500), // Simulate a small delay for AI response
          };
          return { ...sessionItem, messages: [...updatedMessages, newAiMessage] };
        }
        return sessionItem;
      });
    });

    // If a new chat was created, update its name based on the first message
    if (newChatCreated && newUserMessage.text.length > 5) {
      setChatSessions(prevSessions => {
        return prevSessions.map(sessionItem => {
          if (sessionItem.id === targetChatId) {
            return { ...sessionItem, name: newUserMessage.text.substring(0, 25) + (newUserMessage.text.length > 25 ? '...' : '') };
          }
          return sessionItem;
        });
      });
    }

    setInputMessage(''); // Clear input field
  };

  // Handle Enter key for sending message (without Shift)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
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
        staggerChildren: 0.05,
      },
    },
  };

  const sidebarVariants = {
    hidden: { x: 100, opacity: 0 }, // For desktop sidebar animation (from right)
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const chatAreaVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut", delay: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 }, // For animating individual items in sidebar
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  // Display Loading component while session is loading
  if (status === "loading") {
    return <Loading message="در حال بررسی..." />;
  }

  // Main Chat Room Page UI
  if (status === "authenticated") {
    return (
      <motion.div
        className="flex h-screen bg-gray-100 text-gray-800" // Full height, light gray background
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        dir="rtl" // Set overall direction to RTL
      >

        {/* Desktop/Tablet Sidebar */}
        <motion.aside
          className="hidden md:flex flex-col w-72 bg-white p-6 shadow-xl border-l border-gray-200 rounded-r-xl relative z-10"
          variants={sidebarVariants} // Apply sidebar animation variants
          initial="hidden"
          animate="visible"
        >
          <div className="flex-1 flex flex-col"> {/* Use flex-1 to push logout button to bottom */}
            <motion.div variants={itemVariants} className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">OIO</h2>
              <p className="text-sm text-gray-500">پنل چت هوش مصنوعی</p>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-8 text-xl font-semibold text-center">
              <p>سلام، {session?.user?.name?.split(' ')[0] || "کاربر"}!</p>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-6">
              <Button
                onClick={handleNewChat}
                className="w-full text-lg px-4 py-2 bg-blue-600 text-white hover:bg-blue-700
                           rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <i className="fas fa-plus ml-2"></i> مکالمه جدید
              </Button>
            </motion.div>

            <Separator className="my-6 bg-gray-200" />

            {/* List of saved chat sessions */}
            <motion.div variants={itemVariants} className="flex-1 min-h-0"> {/* flex-1 and min-h-0 for scrollable content */}
              <h3 className="text-gray-500 text-sm mb-2 pr-2">تاریخچه مکالمات:</h3>
              <ScrollArea className="h-full rounded-md border border-gray-200 p-2"> {/* Full height for ScrollArea */}
                {chatSessions.length === 0 ? (
                  <p className="text-gray-400 text-center text-sm p-4">هیچ مکالمه ذخیره شده‌ای نیست.</p>
                ) : (
                  chatSessions.map((chat) => (
                    <Button
                      key={chat.id}
                      variant="ghost" // Shadcn ghost button style
                      onClick={() => handleSelectChat(chat.id)}
                      className={`block w-full text-right justify-end h-auto p-3 mb-1 text-wrap break-words
                                  ${activeChatId === chat.id ? 'bg-blue-100 text-blue-800 font-bold hover:bg-blue-200' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      {chat.name}
                    </Button>
                  ))
                )}
              </ScrollArea>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="mt-6"> {/* Margin top to separate from scroll area */}
            <Button
              onClick={handleSignOut}
              variant="destructive" // Shadcn destructive button style (red)
              className="w-full text-lg px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <i className="fas fa-sign-out-alt ml-2"></i> خروج از سیستم
            </Button>
          </motion.div>
        </motion.aside>
        

        {/* Main Chat Area */}
        <motion.main
          className="flex-1 flex flex-col p-4 md:p-8 bg-white rounded-l-xl m-0 md:m-4 shadow-xl relative z-0"
          variants={chatAreaVariants} // Apply chat area animation variants
          initial="hidden"
          animate="visible"
        >
          {/* Hamburger menu for mobile only */}
          <div className="md:hidden flex justify-between items-center mb-4">
            <h1 className="text-2xl font-extrabold text-gray-900">گفتگو با OIO</h1>
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <i className="fas fa-bars text-gray-700"></i>
                  <span className="sr-only">باز کردن منو</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 bg-white flex flex-col p-6 border-none">
                <div className="flex-1 flex flex-col"> {/* Use flex-1 to push logout button to bottom */}
                  <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">OIO</h2>
                    <p className="text-sm text-gray-500">پنل چت هوش مصنوعی</p>
                  </div>
                  <div className="mb-8 text-xl font-semibold text-center">
                    <p>سلام، {session?.user?.name?.split(' ')[0] || "کاربر"}!</p>
                  </div>
                  <div className="mb-6">
                    <Button
                      onClick={handleNewChat}
                      className="w-full text-lg px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-md"
                    >
                      <i className="fas fa-plus ml-2"></i> مکالمه جدید
                    </Button>
                  </div>
                  <Separator className="my-6 bg-gray-200" />
                  <h3 className="text-gray-500 text-sm mb-2 pr-2">تاریخچه مکالمات:</h3>
                  <ScrollArea className="flex-1 rounded-md border border-gray-200 p-2">
                    {chatSessions.length === 0 ? (
                      <p className="text-gray-400 text-center text-sm p-4">هیچ مکالمه ذخیره شده‌ای نیست.</p>
                    ) : (
                      chatSessions.map((chat) => (
                        <Button
                          key={chat.id}
                          variant="ghost"
                          onClick={() => handleSelectChat(chat.id)}
                          className={`block w-full text-right justify-end h-auto p-3 mb-1 text-wrap break-words
                                      ${activeChatId === chat.id ? 'bg-blue-100 text-blue-800 font-bold hover:bg-blue-200' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                          {chat.name}
                        </Button>
                      ))
                    )}
                  </ScrollArea>
                </div>
                <Button
                  onClick={handleSignOut}
                  variant="destructive"
                  className="w-full text-lg px-6 py-3 rounded-lg shadow-md mt-auto"
                >
                  <i className="fas fa-sign-out-alt ml-2"></i> خروج از سیستم
                </Button>
              </SheetContent>
            </Sheet>
          </div>

          {/* Title for Desktop only */}
          <h1 className="hidden md:block text-3xl font-extrabold mb-6 text-center text-gray-900">
            گفتگو با OIO
          </h1>

          {/* Chat Messages Display Area */}
          <ScrollArea className="flex-1 p-4 space-y-4 bg-gray-50 rounded-xl shadow-inner mb-4">
            {activeChatMessages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500 text-lg">
                {!activeChatId && chatSessions.length === 0
                  ? "برای شروع اولین مکالمه، پیامی تایپ کنید."
                  : "برای شروع یک مکالمه جدید، پیامی تایپ کنید."}
              </div>
            ) : (
              <AnimatePresence>
                {activeChatMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card // Use Shadcn Card for message bubbles
                      className={`max-w-xl p-4 shadow-md border-none ${
                        msg.sender === 'user'
                          ? 'bg-blue-500 text-white rounded-bl-none'
                          : 'bg-gray-200 text-gray-800 rounded-br-none'
                      }`}
                      style={{ direction: 'rtl' }} // Ensure text direction within bubble is RTL
                    >
                      <CardContent className="p-0">
                        <p className="leading-relaxed">{msg.text}</p> {/* leading-relaxed for better readability */}
                        <span className="block text-xs opacity-70 mt-1">
                          {msg.timestamp.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Chat Input Form */}
          <form onSubmit={handleSendMessage} className="mt-6 flex items-center gap-2 bg-gray-100 p-3 rounded-lg shadow-md border border-gray-200">
            <Input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="پیام خود را تایپ کنید..."
              className="flex-1 p-3 rounded-lg bg-white text-gray-800 placeholder-gray-500
                         focus-visible:ring-blue-500 border border-gray-300 text-right"
              dir="rtl" // Ensure input direction is RTL
            />
            <Button
              type="submit"
              size="icon" // Small, icon-only button
              className="bg-blue-600 hover:bg-blue-700 text-white w-12 h-12 rounded-full shadow-md hover:shadow-lg flex items-center justify-center transition-all"
            >
              <i className="fas fa-paper-plane"></i> {/* Font Awesome send icon */}
              <span className="sr-only">ارسال</span> {/* Screen reader text for accessibility */}
            </Button>
          </form>
        </motion.main>
      </motion.div>
    );
  }

  return null;
}