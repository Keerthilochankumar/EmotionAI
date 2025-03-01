/* eslint-disable @typescript-eslint/consistent-type-imports */
"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/nextjs";

interface ChatMessage {
  sender: string;
  text: string;
}

export default function Chat() {
  const { user } = useUser();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: "EmotionBot", text: "Hello! How can I assist you today?" },
  ]);
  const [input, setInput] = useState<string>("");
  const [chatId, setChatId] = useState<string | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { sender: "You", text: userMessage }]);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMessage,
          userId: user.id,
          chatId: chatId
        }),
      });

      type ChatResponse = { response?: string; chatId?: string; error?: string };
      const data: ChatResponse = await res.json() as ChatResponse;

      if (data.response) {
        setMessages((prev) => [
          ...prev,
          { sender: "EmotionBot", text: data.response ?? "No response from AI" },
        ]);
        if (data.chatId && !chatId) {
          setChatId(data.chatId);
        }
      } else {
        throw new Error(data.error ?? "No response from AI");
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "System", text: "Error: Could not get response","error":error  },
      ]);
    }
  };

  return (
    <>
      <SignedIn>
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#D4EDDA] via-[#A8D5BA] to-[#76C893]">
          <div className="w-[400px] h-[500px] border border-gray-300 rounded-lg bg-white/80 p-2.5 flex flex-col shadow-lg">
            <div className="flex-1 overflow-y-auto mb-2.5 px-2">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`my-1.5 ${
                    msg.sender === "You"
                      ? "text-right text-[#2F6B50]"
                      : msg.sender === "EmotionBot"
                      ? "text-left text-[#3E8E67]"
                      : "text-center text-red-500"
                  }`}
                >
                  <strong>{msg.sender}:</strong> {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2.5">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3E8E67]"
              />
              <button
                type="submit"
                className="px-2.5 py-1.5 bg-[#3E8E67] text-white rounded hover:bg-[#2F6B50] transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn redirectUrl="/" />
      </SignedOut>
    </>
  );
}