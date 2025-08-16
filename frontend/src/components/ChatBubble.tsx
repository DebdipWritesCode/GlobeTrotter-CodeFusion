import { useState, useEffect, useRef } from "react";
import { Bot } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

interface Message {
  role: "user" | "bot";
  text: string;
}

const ChatBubble = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", text: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://python.rjmun-backend.shop/v1/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversation: updatedMessages, // send whole conversation to backend
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const botMessage: Message = {
        role: "bot",
        text: data.reply,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Oops! Something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      sendMessage();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          className="h-16 w-16 rounded-full p-3 bg-primary fixed right-10 bottom-10 z-50 flex items-center justify-center cursor-pointer 
          hover:scale-110 transition-transform shadow-lg
          dark:bg-blue-600"
          title="Open Chat"
        >
          <Bot className="h-6 w-6 text-white" />
        </div>
      </DialogTrigger>

      <DialogContent
        className="w-[320px] max-w-full flex flex-col bg-white dark:bg-gray-900 rounded-lg shadow-xl p-4"
        style={{ minHeight: 400 }}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Chatbot
          </DialogTitle>
        </DialogHeader>

        <div
          className="flex-1 overflow-y-auto space-y-3 text-sm mb-4 max-h-[300px] scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700"
          style={{ minHeight: 240 }}
        >
          {messages.length === 0 && (
            <p className="text-center text-gray-400 dark:text-gray-500 select-none">
              Say hi to the bot!
            </p>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[80%] rounded-xl p-3 break-words whitespace-pre-line
                ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white ml-auto rounded-br-none"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none"
                }`}
            >
              <strong className="block mb-1 text-xs uppercase tracking-wide opacity-70 select-none">
                {msg.role === "user" ? "You" : "Bot"}
              </strong>
              <span>{msg.text}</span>
            </div>
          ))}
          {loading && (
            <div className="text-gray-500 dark:text-gray-400 italic select-none">
              Bot is typing...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
              px-3 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none
              focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:border-transparent transition"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={loading}
            autoComplete="off"
          />
          <Button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="flex-shrink-0"
          >
            Send
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatBubble;
