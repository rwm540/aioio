// app/components/chat/ChatInput.tsx
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Plus, Sparkles,Settings,MoreVertical} from "lucide-react"; // Sparkles هم اضافه شد

// وارد کردن کامپوننت‌های DropdownMenu از shadcn/ui
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: (e: React.FormEvent | React.KeyboardEvent) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export default function ChatInput({
  inputMessage,
  setInputMessage,
  handleSendMessage,
  handleKeyDown,
}: ChatInputProps) {
  return (
    <form
      onSubmit={handleSendMessage}
      className="mt-auto flex items-center gap-3 p-3 md:p-4 rounded-3xl shadow-2xl
      bg-black/30 backdrop-blur-lg  
      border border-white            
      relative overflow-hidden"
      dir="rtl" // فرم برای زبان‌های راست به چپ
    >
      {/* انیمیشن شیمر برای جلوه بصری */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                   left-[-100%] animate-shimmer pointer-events-none rounded-3xl"
        style={{ animationDuration: '3s' }}
      ></div>

      {/* DropdownMenu برای دکمه‌های اضافی (مثل AI، افزودن فایل و ...) */}
      {/* این DropdownMenuTrigger در سمت راست نوار ورودی قرار می‌گیرد (به دلیل dir="rtl" روی form) */}
      <DropdownMenu dir="rtl">
        <DropdownMenuTrigger asChild>
          <Button
            type="button" // مهم: نوع "button" باشد تا فرم را ارسال نکند
            size="icon"
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white
                       hover:from-purple-700 hover:to-blue-700
                       w-11 h-11 md:w-12 md:h-12 rounded-full shadow-lg hover:shadow-xl
                       flex items-center justify-center transition-all transform hover:scale-[1.05] active:scale-95
                       relative z-10"
            aria-label="گزینه‌های بیشتر" // برای دسترسی‌پذیری بهتر
          >
            {/* <Plus className="h-5 w-5 stroke-2" /> */}
            {/* <Menu className="h-5 w-5 stroke-2" /> */}
            <MoreVertical className="h-4 w-4 stroke-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-48  bg-gray-800 text-gray-100 border border-gray-700 shadow-lg"
          align="start"
          sideOffset={26}
          alignOffset={-10}
        >
          {/* آیتم "گزینه AI" */}
          <DropdownMenuItem
            onClick={() => {
              console.log("گزینه AI کلیک شد");
              // TODO: اینجا تابع مربوط به فعال‌سازی قابلیت AI را فراخوانی کنید
            }}
          >
            <Sparkles className="h-4 w-4 ml-2" />
           AI
          </DropdownMenuItem>

          {/* آیتم "افزودن فایل" */}
          <DropdownMenuItem
            onClick={() => {
              console.log("افزودن فایل کلیک شد");
             
            }}
          >
            <Plus className="h-5 w-5 stroke-2" />
            افزودن فایل
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              console.log("افزودن فایل کلیک شد");
              // TODO: اینجا تابع مربوط به باز کردن پنجره انتخاب فایل را فراخوانی کنید
            }}
          >
            <Settings className="h-5 w-5 stroke-2" />
            {/* <MoreHorizontal className="h-4 w-4 ml-2" /> */}
          </DropdownMenuItem>

          {/* می‌توانید آیتم‌های DropdownMenuItem بیشتری را اینجا اضافه کنید */}
          
         
        
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ناحیه ورودی متن */}
      <Textarea
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="سوال خود را بپرسید..."
        className="flex-1 p-2 md:p-3 rounded-2xl
         text-gray-100 placeholder-gray-400
            focus:outline-none focus:ring-0 focus-visible:ring-0
        text-right text-base md:text-lg
        transition-all duration-200
        min-h-[40px] max-h-[150px] resize-y
        custom-textarea-scrollbar border-none
       "
        dir="rtl"
      />

      {/* دکمه ارسال پیام */}
      {/* این دکمه در انتهای فرم (یعنی سمت چپ در حالت RTL) قرار می‌گیرد و فرم را ارسال می‌کند */}
      <Button
        type="submit" // این دکمه فرم را ارسال می‌کند
        size="icon"
        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white
                   hover:from-purple-700 hover:to-blue-700
                   w-11 h-11 md:w-12 md:h-12 rounded-full shadow-lg hover:shadow-xl
                   flex items-center justify-center transition-all transform hover:scale-[1.05] active:scale-95
                   relative z-10"
        aria-label="ارسال پیام"
      >
        <Send className="h-5 w-5 stroke-2" />
      </Button>
    </form>
  );
}