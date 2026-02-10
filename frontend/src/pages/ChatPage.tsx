import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";
import { socket } from "../socket";
import axios from "axios";

const ChatPage = () => {
  const { user, token, logout, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [chats, setChats] = useState<any[]>([]);
  const [currentChat, setCurrentChat] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (!token) return;

    socket.io.opts.extraHeaders = {
      Authorization: `Bearer ${token}`,
    };

    if (!socket.connected) {
      socket.connect();
    }

    const fetchChats = async () => {
      try {
        const res = await axios.get("http://localhost:3000/chat");
        setChats(res.data);
      } catch (err) {
        console.error("Failed to fetch chats", err);
      }
    };

    fetchChats();

    return () => {
      socket.disconnect();
    };
  }, [token]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: any) => {
      setMessages((prev) => {
        if (prev.find((m) => m._id === message._id)) return prev;

        if (currentChat && message.chatId === currentChat._id) {
          return [...prev, message];
        }
        return prev;
      });

      setChats((prevChats) =>
        prevChats.map((c) =>
          c._id === message.chatId ? { ...c, lastMessage: message } : c,
        ),
      );
    };

    const handleTyping = (data: any) => {
      if (data.userId !== user?.id) {
        setTypingUsers((prev) => {
          if (data.isTyping) {
            return prev.includes(data.username)
              ? prev
              : [...prev, data.username];
          } else {
            return prev.filter((u) => u !== data.username);
          }
        });
      }
    };

    const handleUserStatusChanged = (data: {
      userId: string;
      status: string;
    }) => {
      setChats((prevChats) =>
        prevChats.map((chat) => {
          const updatedParticipants = chat.participants.map((p: any) => {
            if (p._id === data.userId) {
              return { ...p, status: data.status };
            }
            return p;
          });
          return { ...chat, participants: updatedParticipants };
        }),
      );
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("typing", handleTyping);
    socket.on("userStatusChanged", handleUserStatusChanged);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("typing", handleTyping);
      socket.off("userStatusChanged", handleUserStatusChanged);
    };
  }, [user, currentChat]);

  useEffect(() => {
    setTypingUsers([]);
  }, [currentChat]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  const handleSelectChat = async (chat: any) => {
    setCurrentChat(chat);
    socket.emit("joinRoom", chat._id);
    try {
      const res = await axios.get(
        `http://localhost:3000/chat/${chat._id}/messages`,
      );
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  const handleCreateChat = async (userId: string) => {
    try {
      const res = await axios.post("http://localhost:3000/chat", { userId });
      const chat = res.data;

      // Update chat list if not exists
      setChats((prev) => {
        if (!prev.find((c) => c._id === chat._id)) {
          return [chat, ...prev];
        }
        return prev;
      });

      handleSelectChat(chat);
      return chat;
    } catch (err) {
      console.error("Failed to create chat", err);
    }
  };

  const handleSendMessage = (content: string, priority: string) => {
    if (!currentChat) return;

    socket.emit("sendMessage", {
      chatId: currentChat._id,
      content,
      priority,
    });
  };

  const handleTypingEmit = (isTyping: boolean) => {
    if (!currentChat) return;
    socket.emit("typing", {
      chatId: currentChat._id,
      isTyping,
    });
  };

  if (!user) return null;

  const activeChat =
    chats.find((c) => c._id === currentChat?._id) || currentChat;

  return (
    <div className="flex h-screen bg-background dark:bg-slate-950 overflow-hidden">
      <ChatSidebar
        chats={chats}
        currentChatId={currentChat?._id}
        onSelectChat={handleSelectChat}
        onCreateChat={handleCreateChat}
        currentUser={user}
      />

      {activeChat ? (
        <ChatWindow
          chat={activeChat}
          messages={messages}
          currentUser={user}
          onSendMessage={handleSendMessage}
          onTyping={handleTypingEmit}
          typingUsers={typingUsers}
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-background dark:bg-slate-950">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Welcome back, {user.username}!
          </h2>
          <p className="text-text-muted mb-8">
            Select a conversation to start chatting.
          </p>
          <button
            onClick={logout}
            className="px-6 py-2 border border-gray-300 rounded text-text-muted hover:bg-gray-100 dark:hover:bg-slate-800 transition"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
