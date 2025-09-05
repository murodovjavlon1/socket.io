"use client";

import { useEffect, useState } from "react";
import ChatForm from "@/components/chatFrom";
import ChatMessage from "@/components/ChatMessage";
import { socket } from "@/lib/socketClient";

export default function Home() {
  const [room, setRoom] = useState("");
  const [userName, setUserName] = useState("");
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; message: string }[]>([]);

  // Socket eventlar
  useEffect(() => {
    // Xabar kelganda
    socket.on("message", (data) => {
      console.log("Message received:", data);
      setMessages((prev) => [...prev, data]);
    });

    // Foydalanuvchi xonaga qo‘shilganda
    socket.on("user_joined", (msg) => {
      setMessages((prev) => [...prev, { sender: "system", message: msg }]);
    });

    // Cleanup
    return () => {
      socket.off("message");
      socket.off("user_joined");
    };
  }, []);

  // Xonaga qo‘shilish
  const joinRoom = () => {
    if (!room || !userName) return;
    socket.emit("join-room", { room, username: userName });
    setJoined(true);
  };

  // Xabar yuborish
  const sendMessage = (message: string) => {
    const data = { room, message, sender: userName };
    setMessages((prev) => [...prev, data]);
    socket.emit("message", data);
  };

  // UI
  if (!joined) {
    return (
      <div className="flex flex-col items-center mt-24 w-full max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Join a chat</h1>
        <input
          type="text"
          placeholder="Enter username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full mb-4 px-4 py-2 border-2 rounded-lg"
        />
        <input
          type="text"
          placeholder="Enter chat room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          className="w-full mb-4 px-4 py-2 border-2 rounded-lg"
        />
        <button
          onClick={joinRoom}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Join
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-24 px-4">
      <h1 className="text-2xl font-bold mb-4">Chat: {room}</h1>
      <div className="h-[500px] overflow-y-auto mb-4 p-4 bg-gray-200 border-2 rounded-lg">
        {messages.map((msg, i) => (
          <ChatMessage
            key={i}
            sender={msg.sender}
            message={msg.message}
            isOwnMessage={msg.sender === userName}
          />
        ))}
      </div>
      <ChatForm onSendMessage={sendMessage} />
    </div>
  );
}
