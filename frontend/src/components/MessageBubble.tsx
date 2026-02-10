import React from "react";
import { cn } from "../lib/utils";

interface Message {
  _id: string;
  content: string;
  senderId: { _id: string; username: string };
  priority: "normal" | "important" | "urgent";
  createdAt: string;
}

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn }) => {
  const isUrgent = message.priority === "urgent";
  const isImportant = message.priority === "important";

  return (
    <div
      className={cn(
        "flex w-full mb-4",
        isOwn ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "max-w-[70%] rounded-2xl px-4 py-2 shadow-sm relative",
          isOwn
            ? "bg-primary text-white rounded-br-none"
            : "bg-surface dark:bg-slate-800 text-text-main dark:text-gray-100 rounded-bl-none border border-gray-200 dark:border-gray-700",
          isUrgent && "border-2 border-red-500 animate-pulse",
          isImportant && "border-2 border-yellow-500",
        )}
      >
        {isUrgent && (
          <span className="absolute -top-3 right-2 text-xs bg-red-500 text-white px-1.5 rounded">
            URGENT
          </span>
        )}
        {isImportant && (
          <span className="absolute -top-3 right-2 text-xs bg-yellow-500 text-white px-1.5 rounded">
            IMPORTANT
          </span>
        )}

        <p className="text-sm">{message.content}</p>
        <span
          className={cn(
            "text-[10px] mt-1 block text-right opacity-70",
            isOwn ? "text-white" : "text-text-muted",
          )}
        >
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
