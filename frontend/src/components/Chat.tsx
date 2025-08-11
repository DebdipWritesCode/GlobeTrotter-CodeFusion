import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import { MessageSquare, X, CornerUpRight, Maximize2, Minimize2 } from "lucide-react";
import type { RootState } from "@/redux/store";

interface Message {
  userId: string;
  user: string;
  text: string;
  time: string;
}

interface ChatProps {
  onClose: () => void;
}

const Chat: React.FC<ChatProps> = ({ onClose }) => {
  const currentUser = useSelector((state: RootState) => state.auth);
console.log("Current user in chat:", currentUser);
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("chatMessages");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [expanded, setExpanded] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socket = io("http://localhost:5000");
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to chat server");
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
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !socketRef.current) return;

    const msg: Message = {
      userId: currentUser?.user_id || "guest",

      user: currentUser?.name || "Guest",
      text: input.trim(),
      time: new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    socketRef.current.emit("chatMessage", msg);
    setInput("");
  };

  const getAvatarUrl = (username: string) =>
    `https://api.dicebear.com/6.x/identicon/svg?seed=${encodeURIComponent(username)}`;

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
          >
            {expanded ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/5">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 border border-gray-800 rounded p-2 text-sm overflow-y-auto space-y-3">
        {messages.length === 0 ? (
          <div className="text-xs text-gray-500">No messages yet</div>
        ) : (
          messages.map((msg, idx) => {
            const isOwn = msg.userId === currentUser?.user_id;
            return (
              <div
                key={idx}
                className={`flex items-start gap-2 ${
                  isOwn ? "justify-end" : "justify-start"
                }`}
              >
                {/* Avatar + Username */}
                {!isOwn && (
                  <img
                    src={getAvatarUrl(msg.user)}
                    alt={msg.user}
                    className="w-7 h-7 rounded-full"
                  />
                )}
                <div
                  className={`max-w-[75%] rounded-lg p-2 ${
                    isOwn
                      ? "bg-cyan-500 text-white rounded-br-none"
                      : "bg-gray-700 text-gray-100 rounded-bl-none"
                  }`}
                >
                  <div
                    className={`text-[10px] mb-1 font-semibold flex items-center gap-1 ${
                      isOwn ? "text-white/90" : "text-gray-300"
                    }`}
                  >
                    {msg.user}
                  </div>
                  <div>{msg.text}</div>
                  <div className="text-[9px] text-gray-300 mt-1 text-right">
                    {msg.time}
                  </div>
                </div>
                {isOwn && (
                  <img
                    src={getAvatarUrl(msg.user)}
                    alt={msg.user}
                    className="w-7 h-7 rounded-full"
                  />
                )}
              </div>
            );
          })
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
        />
        <button
          onClick={sendMessage}
          className="px-3 py-2 rounded bg-cyan-500 hover:bg-cyan-400"
        >
          <CornerUpRight className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};

export default Chat;
