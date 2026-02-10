import React, { useState, useRef } from "react";
import { User, Search, Plus, MessageSquare, Camera } from "lucide-react";
import { cn } from "../lib/utils";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../lib/utils";

interface Chat {
  _id: string;
  name?: string;
  type: "one-to-one" | "group";
  participants: any[];
  lastMessage?: any;
}

interface ChatSidebarProps {
  chats: Chat[];
  currentChatId: string | null;
  onSelectChat: (chat: Chat) => void;
  onCreateChat: (userId: string) => Promise<void>;
  currentUser: any;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chats,
  currentChatId,
  onSelectChat,
  onCreateChat,
  currentUser,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateUser, token } = useAuth();

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length > 1) {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/search?q=${query}`);
        setSearchResults(res.data);
        setIsSearching(true);
      } catch (err) {
        console.error("Search failed", err);
      }
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  const startChat = async (userId: string) => {
    try {
      await onCreateChat(userId);
      setSearchQuery("");
      setSearchResults([]);
      setIsSearching(false);
    } catch (err) {
      console.error("Failed to start chat", err);
    }
  };

  const getChatName = (chat: Chat) => {
    if (chat.type === "group") return chat.name;
    const otherParticipant = chat.participants.find(
      (p) => p._id !== currentUser.id,
    );
    return otherParticipant?.username || "Unknown User";
  };

  const getChatAvatar = (chat: Chat) => {
    if (chat.type === "group") return null;
    const otherParticipant = chat.participants.find(
      (p) => p._id !== currentUser.id,
    );
    return otherParticipant?.avatar;
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/users/upload-avatar`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      updateUser({ avatar: res.data.avatarUrl });
    } catch (err) {
      console.error("Failed to upload avatar", err);
    }
  };

  return (
    <div className="w-80 border-r border-gray-200 dark:border-gray-800 bg-surface dark:bg-slate-900 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
        <div
          className="relative group cursor-pointer"
          onClick={handleAvatarClick}
        >
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-700">
            {currentUser.avatar ? (
              <img
                src={`${API_BASE_URL}${currentUser.avatar}`}
                alt={currentUser.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-6 h-6 text-primary" />
            )}
          </div>
          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-4 h-4 text-white" />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <div>
          <h3 className="font-bold text-text-main dark:text-gray-100">
            {currentUser.username}
          </h3>
          <p className="text-xs text-text-muted">Online</p>
        </div>
      </div>

      <div className="p-4 border-b border-gray-200 dark:border-gray-800 space-y-4">
        <h2 className="text-xl font-bold text-primary flex items-center justify-between">
          Messages{" "}
          <Plus className="w-5 h-5 cursor-pointer hover:text-secondary action-icon" />
        </h2>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent bg-gray-50 dark:bg-slate-800 dark:border-gray-700 dark:text-white"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isSearching ? (
          <div className="p-2 space-y-1">
            <h3 className="text-xs font-semibold text-text-muted px-2 py-1 uppercase tracking-wider">
              Found Users
            </h3>
            {searchResults.length === 0 ? (
              <div className="p-4 text-center text-sm text-text-muted">
                No users found
              </div>
            ) : (
              searchResults.map((user) => (
                <button
                  key={user._id}
                  onClick={() => startChat(user._id)}
                  className="w-full p-2 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition text-left"
                >
                  <div className="relative w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary overflow-hidden">
                    {user.avatar ? (
                      <img
                        src={`${API_BASE_URL}${user.avatar}`}
                        alt={user.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-text-main dark:text-gray-100">
                      {user.username}
                    </p>
                    <p className="text-xs text-text-muted">{user.email}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        ) : /* Existing Chat List */
        chats.length === 0 ? (
          <div className="p-8 flex flex-col items-center justify-center text-center text-text-muted h-64">
            <MessageSquare className="w-12 h-12 mb-2 opacity-20" />
            <p>No active chats.</p>
            <p className="text-sm mt-1">
              Search for a user to start messaging.
            </p>
          </div>
        ) : (
          chats.map((chat) => (
            <button
              key={chat._id}
              onClick={() => onSelectChat(chat)}
              className={cn(
                "w-full p-4 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-slate-800 transition text-left border-l-4 border-transparent",
                currentChatId === chat._id &&
                  "bg-gray-50 dark:bg-slate-800 border-primary",
              )}
            >
              <div className="relative w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden shrink-0">
                {getChatAvatar(chat) ? (
                  <img
                    src={`${API_BASE_URL}${getChatAvatar(chat)}`}
                    alt={getChatName(chat)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold text-text-main dark:text-gray-100 truncate">
                    {getChatName(chat)}
                  </h3>
                  {chat.lastMessage && (
                    <span className="text-[10px] text-text-muted shrink-0">
                      {new Date(
                        chat.lastMessage.createdAt,
                      ).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-muted truncate">
                  {chat.lastMessage
                    ? chat.lastMessage.content
                    : "No messages yet"}
                </p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
