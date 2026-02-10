import React, { useState, useEffect, useRef } from "react";
import { Send, MoreVertical, AlertTriangle, Flag } from "lucide-react";
import MessageBubble from "./MessageBubble";
import { cn } from "../lib/utils";

interface ChatWindowProps {
  chat: any;
  messages: any[];
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  currentUser: any;
  onTyping?: (isTyping: boolean) => void;
  typingUsers: string[];
  socket: any;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  chat,
  messages,
  setMessages,
  currentUser,
  onTyping,
  typingUsers,
  socket,
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
    if (socket) {
      socket.on("newMessage", (message: any) => {
        if (message.chatId === chat._id) {
          setMessages((prev) => {
            // Optimistic replacement & deduplication
            if (prev.some((m) => m._id === message._id)) return prev;

            const tempMessageIndex = prev.findIndex(
              (m) =>
                m._id.startsWith("temp-") &&
                m.content === message.content &&
                m.senderId._id === message.senderId._id,
            );

            if (tempMessageIndex !== -1) {
              const newMessages = [...prev];
              newMessages[tempMessageIndex] = message;
              return newMessages;
            }

            return [...prev, message];
          });
        }
      });

      socket.on("messageReaction", (updatedMessage: any) => {
        if (updatedMessage.chatId === chat._id) {
          setMessages((prev) =>
            prev.map((m) =>
              m._id === updatedMessage._id ? updatedMessage : m,
            ),
          );
        }
      });

      socket.on("messageError", (error: any) => {
        console.error("Message sending error:", error);
      });
    }

    return () => {
      if (socket) {
        socket.off("newMessage");
        socket.off("messageReaction");
        socket.off("messageError");
      }
    };
  }, [socket, chat._id, currentUser.id]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Scroll on messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    // Explicitly stop typing when sending
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    onTyping?.(false);

    const content = newMessage;
    setNewMessage("");
    setPriority("normal");

    // Optimistic UI Update
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      _id: tempId,
      content: content,
      senderId: { _id: currentUser.id, username: currentUser.username },
      priority: priority as "normal" | "important" | "urgent",
      createdAt: new Date().toISOString(),
      chatId: chat._id,
      status: "sending",
      reactions: [],
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      // Emit message to server
      socket.emit("sendMessage", {
        chatId: chat._id,
        content: content,
        priority,
      });
    } catch (err) {
      console.error("Failed to emit message:", err);
    }

    // onSendMessage(content, priority); // Handling internally now
  };

  const handleReact = (messageId: string, emoji: string) => {
    if (!socket) return;
    socket.emit("reactToMessage", {
      chatId: chat._id,
      messageId,
      emoji,
    });

    // Optimistic reaction update
    setMessages((prev) =>
      prev.map((m) => {
        if (m._id === messageId) {
          const reactions = m.reactions ? [...m.reactions] : [];
          const existingIdx = reactions.findIndex(
            (r: any) => r.userId === currentUser.id,
          ); // Type any/fix later

          if (existingIdx > -1) {
            if (reactions[existingIdx].emoji === emoji) {
              reactions.splice(existingIdx, 1);
            } else {
              reactions[existingIdx].emoji = emoji;
            }
          } else {
            reactions.push({ userId: currentUser.id, emoji });
          }
          return { ...m, reactions };
        }
        return m;
      }),
    );
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
            onReact={(emoji) => handleReact(msg._id, emoji)}
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
        <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
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
