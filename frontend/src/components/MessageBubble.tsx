import React from "react";
import { cn } from "../lib/utils";

interface Message {
  _id: string;
  content: string;
  senderId: { _id: string; username: string };
  priority: "normal" | "important" | "urgent";
  createdAt: string;
  status?: "sent" | "delivered" | "read";
  reactions?: { userId: string; emoji: string }[];
}

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

import { Check, CheckCheck, Smile } from "lucide-react";

const MessageBubble: React.FC<
  MessageBubbleProps & { onReact?: (emoji: string) => void }
> = ({ message, isOwn, onReact }) => {
  const isUrgent = message.priority === "urgent";
  const isImportant = message.priority === "important";

  // Quick reaction emojis
  const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "😡"];

  const [showReactionPicker, setShowReactionPicker] = React.useState(false);

  return (
    <div
      className={cn(
        "flex w-full mb-4 group", // added group for hover effects
        isOwn ? "justify-end" : "justify-start",
      )}
      onMouseLeave={() => setShowReactionPicker(false)}
    >
      <div
        className={cn(
          "relative flex items-end gap-2",
          isOwn ? "flex-row-reverse" : "flex-row",
        )}
      >
        {/* Reaction Picker Trigger */}
        <button
          className={cn(
            "opacity-0 group-hover:opacity-100 transition p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full",
            showReactionPicker && "opacity-100",
          )}
          onClick={(e) => {
            e.stopPropagation();
            setShowReactionPicker(!showReactionPicker);
          }}
        >
          <Smile className="w-4 h-4 text-gray-400" />
        </button>

        {showReactionPicker && (
          <div
            className={cn(
              "absolute bottom-8 z-10 bg-white dark:bg-slate-800 shadow-lg rounded-full p-1 flex gap-1 border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200",
              isOwn ? "right-8" : "left-8",
            )}
          >
            {REACTION_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  onReact?.(emoji);
                  setShowReactionPicker(false);
                }}
                className="hover:scale-125 transition p-1 text-lg leading-none"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

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

          <p className="text-sm break-words">{message.content}</p>

          <div className="flex items-center justify-end gap-1 mt-1 opacity-70">
            <span
              className={cn(
                "text-[10px]",
                isOwn ? "text-white" : "text-text-muted",
              )}
            >
              {new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {isOwn && (
              <span>
                {/* Simple status logic: if message has an ID it's sent. read/delivered would require more complex backend logic tracking socket acks */}
                {message.status === "read" ? (
                  <CheckCheck className="w-3 h-3 text-blue-200" />
                ) : message.status === "delivered" ? (
                  <CheckCheck className="w-3 h-3" />
                ) : (
                  <Check className="w-3 h-3" />
                )}
              </span>
            )}
          </div>

          {/* Reactions Display */}
          {message.reactions && message.reactions.length > 0 && (
            <div
              className={cn(
                "absolute -bottom-2 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm rounded-full px-1.5 py-0.5 flex gap-0.5 items-center text-xs",
                isOwn ? "left-0" : "right-0",
              )}
            >
              {message.reactions.slice(0, 3).map((r, i) => (
                <span key={i}>{r.emoji}</span>
              ))}
              {message.reactions.length > 3 && (
                <span className="text-text-muted text-[10px] ml-1">
                  +{message.reactions.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
