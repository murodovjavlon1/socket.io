"use client";

import { socket } from "@/lib/socketClient";
import React, { useState } from "react";


const ChatForm = ({
  onSendMessage,
}: {
  onSendMessage: (message: string) => void;
}) => {
  const [message, setMessage] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() !== "") {
      onSendMessage(message);
      setMessage("");
    }
  };

  // ...existing code...
const selectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
  const target = e.target;
  if (!target || !target.files || target.files.length === 0) return;
  const file = target.files[0];
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target?.result;
     
      socket.emit('imageUpload', { image: imageData, filename: file.name });
    };
    reader.readAsDataURL(file);
  }
};

  
  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
  <input
    type="text"
    onChange={(e) => setMessage(e.target.value)}
    className="flex-1 px-4 border-2 py-2 rounded-lg focus:outline-none "
    placeholder="Type your message here..."
  />

  <button
    type="submit"
    className="px-4 py-2 text-white rounded-lg bg-blue-500 cursor-pointer" 
  >
    Send
  </button>
  <label className="px-4 py-2 rounded-lg bg-gray-200 cursor-pointer">
    Upload
    <input
      type="file"
      accept="image/*"
      onChange={selectFile}
      className="hidden"
    />
  </label>
</form>
  );
};

export default ChatForm;
