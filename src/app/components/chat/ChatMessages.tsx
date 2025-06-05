'use client';

import { useEffect, useRef, useState } from "react"; 
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar} from "@/components/ui/avatar";
import Image from "next/image";
import { Copy, Edit, Check, X } from "lucide-react"; 
import { Button } from "@/components/ui/button"; 
import { Textarea } from "@/components/ui/textarea"; 

// Type Definitions
interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  isEditing?: boolean; 
}

interface ChatMessagesProps {
  messages: Message[];
  activeChatId: string | null;
  hasChatSessions: boolean;
  onEditMessage?: (messageId: string, newText: string) => void; 
  onCopyMessage?: (text: string) => void; 
}

export default function ChatMessages({
  messages,
  activeChatId,
  hasChatSessions,
  onEditMessage, 
  onCopyMessage, 
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedMessageText, setEditedMessageText] = useState<string>("");
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null); // State جدید برای مدیریت پیام کپی شد

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const handleCopy = async (text: string, messageId: string) => { // messageId به عنوان آرگومان اضافه شد
    try {
      await navigator.clipboard.writeText(text);
      console.log("Text copied to clipboard:", text);
      setCopiedMessageId(messageId); // تنظیم پیام به کپی شده
      setTimeout(() => {
        setCopiedMessageId(null); // مخفی کردن پیام بعد از 2 ثانیه
      }, 300); 

      if (onCopyMessage) {
        onCopyMessage(text);
      }
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleStartEdit = (message: Message) => {
    setEditingMessageId(message.id);
    setEditedMessageText(message.text);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditedMessageText("");
  };

  const handleSaveEdit = (messageId: string) => {
    if (onEditMessage && editedMessageText.trim() !== "") {
      onEditMessage(messageId, editedMessageText);
      setEditingMessageId(null);
      setEditedMessageText("");
    } else {
      console.warn("Cannot save empty message or onEditMessage is not provided.");
    }
  };

  return (
    <ScrollArea className="flex-1 py-4 px-8 space-y-6 mb-6 top-18 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-white max-h-[65vh]">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500 text-lg flex-col p-2">
          <motion.div variants={itemVariants} className="mb-4 text-center">
            <Image
              src="/OIO_M1.png"
              alt="هوش مصنوعی OIO"
              width={50}
              height={50}
              priority
              className="drop-shadow-lg mx-auto mb-3"
            />
          </motion.div>
          <p className="text-center font-medium">
            {!activeChatId && !hasChatSessions
              ? "چطوری میتونم بهت کمک کنم؟"
              : "در مورد چی میخوای صحبت کنیم؟"}
          </p>
          <p className="text-sm text-gray-400 mt-2"></p>
        </div>
      ) : (
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              className={`flex items-start gap-4 ${
                msg.sender === "user" ? "justify-end" : "justify-end" 
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Card برای پیام (همیشه قبل از آواتار برای چینش صحیح در RTL) */}
              <Card
                className={`max-w-[calc(100%-60px)] p-4 mt-5 border-none ${
                  msg.sender === "user"
                    ? "bg-white-600/1 text-white" 
                    : "bg-black/30 backdrop-blur-lg border border-white text-gray-100 rounded-2xl"
                } relative`}
                style={{ direction: "rtl" }}
              >
                <CardContent className="pt-8 pb-0 pr-0 pl-0">
                  {editingMessageId === msg.id ? (
                    <div className="flex flex-col gap-2">
                      <Textarea
                        value={editedMessageText}
                        onChange={(e) => setEditedMessageText(e.target.value)}
                        className="w-full min-h-[80px] bg-white border border-gray-300 rounded-md p-2 text-gray-800"
                        style={{ direction: "rtl" }}
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleCancelEdit}
                          className="text-red-500 hover:bg-red-100"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleSaveEdit(msg.id)}
                          className="text-green-500 hover:bg-green-100"
                          disabled={editedMessageText.trim() === ''}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="leading-relaxed text-base whitespace-pre-wrap">{msg.text}</p>
                      <span className="block text-xs opacity-70 mt-1 text-right">
                        {msg.timestamp.toLocaleTimeString("fa-IR", {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </>
                  )}
                </CardContent>

                {/* دکمه‌های کپی/ویرایش - فقط برای پیام‌های AI و در حالت نمایش عادی */}
                {msg.sender === "ai" && editingMessageId !== msg.id && (
                  <div className="absolute top-1 left-1 flex gap-1 z-10">
                    {copiedMessageId === msg.id ? ( // نمایش پیام "کپی شد"
                      <motion.span
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="text-green-400 text-sm py-1 px-2 rounded-md"
                      >
                        کپی شد!
                      </motion.span>
                    ) : (
                      <> {/* دکمه‌ها را فقط زمانی که پیام "کپی شد" نیست، نمایش دهید */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopy(msg.text, msg.id)} // ارسال messageId به handleCopy
                          className="h-6 w-6 text-gray-400 hover:text-gray-600"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleStartEdit(msg)}
                          className="h-6 w-6 text-gray-400 hover:text-gray-600"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                )}

              </Card>

              {/* Avatar برای AI (اینجا قرار می‌گیرد، در سمت راست پیام AI) */}
              {msg.sender === "ai" && (
                <Avatar className="h-20 w-10 min-w-[31px] text-gray flex-shrink-0 overflow-hidden">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      height: "100%"
                    }}
                  >
                    <Image
                      src="/OIO_M1.png"
                      alt="هوش مصنوعی OIO"
                      width={25}
                      height={25}
                      priority
                      className="drop-shadow-lg"
                    />
                  </motion.div>
                </Avatar>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      )}
      <div ref={messagesEndRef} />
    </ScrollArea>
  );
}