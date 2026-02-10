import React, { useState, useEffect, useRef } from "react";
import { Send, MoreVertical, AlertTriangle, Flag } from "lucide-react";
import MessageBubble from "./MessageBubble";
import { cn } from "../lib/utils";

interface ChatWindowProps {
  chat: any;
  messages: any[];
  currentUser: any;
  onSendMessage: (content: string, priority: string) => void;
  onTyping?: (isTyping: boolean) => void;
  typingUsers: string[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  chat,
  messages,
  currentUser,
  onSendMessage,
  onTyping,
  typingUsers,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [priority, setPriority] = useState<"normal" | "important" | "urgent">(
    "normal",
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    onSendMessage(newMessage, priority);
    setNewMessage("");
    setPriority("normal");

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    onTyping?.(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    onTyping?.(true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      onTyping?.(false);
    }, 2000);
  };

  const getChatName = () => {
    if (chat.type === "group") return chat.name;
    const otherParticipant = chat.participants.find(
      (p: any) => p._id !== currentUser.id,
    );
    return otherParticipant?.username || "Unknown User";
  };

  const getChatStatus = () => {
    if (chat.type === "group") return null;
    const otherParticipant = chat.participants.find(
      (p: any) => p._id !== currentUser.id,
    );
    return otherParticipant?.status === "online" ? "Online" : "Offline";
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background dark:bg-slate-950">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-surface dark:bg-slate-900 flex justify-between items-center shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {getChatName()[0]?.toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-text-main dark:text-gray-100">
              {getChatName()}
            </h3>
            <p
              className={cn(
                "text-xs",
                getChatStatus() === "Online"
                  ? "text-green-500"
                  : "text-gray-500",
              )}
            >
              {getChatStatus()}
            </p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full">
          <MoreVertical className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <MessageBubble
            key={msg._id}
            message={msg}
            isOwn={msg.senderId._id === currentUser.id}
          />
        ))}
        {typingUsers.length > 0 && (
          <div className="text-sm text-text-muted italic ml-4 animate-pulse">
            {typingUsers.length === 1
              ? `${typingUsers[0]} is typing...`
              : `${typingUsers.length} people are typing...`}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-surface dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800">
        <form onSubmit={handleSend} className="flex flex-col gap-2">
          <div className="flex gap-2 mb-2">
            <button
              type="button"
              onClick={() => setPriority("normal")}
              className={cn(
                "px-3 py-1 text-xs rounded-full border transition",
                priority === "normal"
                  ? "bg-gray-200 text-gray-800 border-gray-300"
                  : "text-gray-500 border-transparent hover:bg-gray-100",
              )}
            >
              Normal
            </button>
            <button
              type="button"
              onClick={() => setPriority("important")}
              className={cn(
                "px-3 py-1 text-xs rounded-full border transition flex items-center gap-1",
                priority === "important"
                  ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                  : "text-gray-500 border-transparent hover:bg-gray-100",
              )}
            >
              <Flag className="w-3 h-3" /> Important
            </button>
            <button
              type="button"
              onClick={() => setPriority("urgent")}
              className={cn(
                "px-3 py-1 text-xs rounded-full border transition flex items-center gap-1",
                priority === "urgent"
                  ? "bg-red-100 text-red-700 border-red-300"
                  : "text-gray-500 border-transparent hover:bg-gray-100",
              )}
            >
              <AlertTriangle className="w-3 h-3" /> Urgent
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={handleInputChange}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border rounded-full focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 dark:bg-slate-800 dark:border-gray-700 dark:text-white"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="p-2 bg-primary text-white rounded-full hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
