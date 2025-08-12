import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import { getBackendUrl } from "@/utils/getBackendUrl";
import {
  MessageSquare,
  X,
  CornerUpRight,
  Maximize2,
  Minimize2,
} from "lucide-react";
import type { RootState } from "@/redux/store";

interface Message {
  socketId: string;
  username: string;
  text: string;
  time: string;
  avatar?: string;
}

interface ChatProps {
  onClose: () => void;
}

const Chat: React.FC<ChatProps> = ({ onClose }) => {
  const currentUser = useSelector((state: RootState) => state.auth);

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("chatMessages");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [expanded, setExpanded] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socket = io(`${import.meta.env.VITE_CHAT_API_URL}`);
    socketRef.current = socket;

    socket.on("connect", () => {
      if (currentUser?.name) {
        socket.emit("setDisplayName", currentUser.name);
      }
    });

    socket.on("chatMessage", (msg: Message) => {
      setMessages((prev) => {
        const updated = [...prev, msg];
        localStorage.setItem("chatMessages", JSON.stringify(updated));
        return updated;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUser?.name]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !socketRef.current) return;

    const msg: Message = {
      socketId: socketRef.current.id || "",
      username: currentUser?.name || "Guest",
      text: input.trim(),
      time: new Date().toISOString(),
    };

    socketRef.current.emit("chatMessage", msg);
    setInput("");
  };

  const getAvatarUrl = (username: string) =>
    `https://api.dicebear.com/6.x/identicon/svg?seed=${encodeURIComponent(
      username
    )}`;

  // Date label formatter
  const formatDateLabel = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";

    return date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: today.getFullYear() !== date.getFullYear() ? "numeric" : undefined,
    });
  };

  return (
    <aside
      className={`fixed bg-gray-900 border border-gray-800 rounded-xl shadow-xl p-3 z-50 flex flex-col transition-all duration-300`}
      style={{
        right: expanded ? "20px" : "1rem",
        bottom: expanded ? "20px" : "5rem",
        width: expanded ? "calc(100% - 40px)" : "20rem",
        height: expanded ? "calc(100% - 40px)" : "24rem",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-cyan-300" />
          <div className="font-semibold">Community Chat</div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="p-1 rounded hover:bg-white/5"
            aria-label={expanded ? "Minimize chat" : "Maximize chat"}
          >
            {expanded ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/5"
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 border border-gray-800 rounded p-2 text-sm overflow-y-auto space-y-3">
        {messages.length === 0 ? (
          <div className="text-xs text-gray-500">No messages yet</div>
        ) : (
          (() => {
            let lastDate: string | null = null;
            return messages.map((msg, idx) => {
              const isOwn = msg.username === currentUser?.name;
              const messageDate = new Date(msg.time).toDateString();
              const showDate = messageDate !== lastDate;
              if (showDate) lastDate = messageDate;

              return (
                <React.Fragment key={idx}>
                  {showDate && (
                    <div className="text-center text-[10px] text-gray-400 my-2">
                      {formatDateLabel(msg.time)}
                    </div>
                  )}

                  <div
                    className={`flex items-start gap-2 w-full ${
                      isOwn ? "justify-end" : "justify-start"
                    }`}
                  >
                    {/* Other user: avatar left */}
                    {!isOwn && (
                      <img
                        src={msg.avatar || getAvatarUrl(msg.username)}
                        alt={msg.username}
                        className="w-7 h-7 rounded-full flex-shrink-0"
                      />
                    )}

                    <div
                      className={`p-2 break-words rounded-lg ${
                        isOwn
                          ? "bg-cyan-500 text-white rounded-br-none text-right max-w-[85%] sm:max-w-[65%]"
                          : "bg-gray-700 text-gray-100 rounded-bl-none text-left max-w-[85%] sm:max-w-[65%]"
                      }`}
                    >
                      <div className="text-[10px] mb-1 font-semibold">
                        {msg.username}
                      </div>
                      <div>{msg.text}</div>
                      <div className="text-[9px] text-gray-300 mt-1 text-right">
                        {new Date(msg.time).toLocaleTimeString()}
                      </div>
                    </div>

                    {/* Current user: avatar right */}
                    {isOwn && (
                      <img
                        src={msg.avatar || getAvatarUrl(msg.username)}
                        alt={msg.username}
                        className="w-7 h-7 rounded-full flex-shrink-0"
                      />
                    )}
                  </div>
                </React.Fragment>
              );
            });
          })()
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="mt-2 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 p-2 rounded bg-white/5 border border-gray-800 text-sm outline-none text-white"
          aria-label="Message input"
        />
        <button
          onClick={sendMessage}
          className="px-3 py-2 rounded bg-cyan-500 hover:bg-cyan-400"
          aria-label="Send message"
        >
          <CornerUpRight className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};

export default Chat;