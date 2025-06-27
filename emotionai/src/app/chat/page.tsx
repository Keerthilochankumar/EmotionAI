/* eslint-disable @typescript-eslint/consistent-type-imports */
"use client";
import { useState, useRef, useEffect, FormEvent } from "react";
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  sender: string;
  text: string;
}

export default function Chat() {
  const { user } = useUser();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: "EmotionBot", text: "Hello! How are you?" },
  ]);
  const [input, setInput] = useState<string>("");
  const [chatId, setChatId] = useState<string | undefined>();
  const [isAudioLoading, setIsAudioLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayingRef = useRef<boolean>(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const playAudio = async (text: string) => {
    if (isPlayingRef.current) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      isPlayingRef.current = false;
    }

    try {
      setIsAudioLoading(true);
      isPlayingRef.current = true;

      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate audio");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      audioRef.current = new Audio(url);
      audioRef.current.play();
      audioRef.current.onended = () => {
        URL.revokeObjectURL(url);
        isPlayingRef.current = false;
      };
    } catch (error) {
      console.error("Error playing audio:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "System", text: "Error: Could not play audio" },
      ]);
      isPlayingRef.current = false;
    } finally {
      setIsAudioLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user || isAudioLoading) return;

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
          chatId: chatId,
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
        await playAudio(data.response);
      } else {
        throw new Error(data.error ?? "No response from AI");
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "System", text: "Error: Could not get response" },
      ]);
    }
  };

  return (
    <>
      <SignedIn>
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#D4EDDA] via-[#A8D5BA] to-[#76C893] p-4">
          <div className="w-full max-w-[600px] h-[700px] border border-gray-300 rounded-2xl bg-white/90 p-4 flex flex-col shadow-2xl">
            <div className="flex-1 overflow-y-auto mb-4 px-3 scrollbar-thin scrollbar-thumb-[#3E8E67] scrollbar-track-gray-100">
              <AnimatePresence>
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className={`my-2 p-3 rounded-lg ${
                      msg.sender === "You"
                        ? "ml-12 bg-[#2F6B50]/10 text-[#2F6B50] text-right"
                        : msg.sender === "EmotionBot"
                        ? "mr-12 bg-[#3E8E67]/10 text-[#3E8E67] text-left"
                        : "text-center text-red-500 bg-red-100/50"
                    }`}
                  >
                    <strong className="font-semibold">{msg.sender}:</strong>{" "}
                    <span className="break-words">{msg.text}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isAudioLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-gray-500 text-sm"
                >
                  Generating audio...
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E8E67] bg-white/80 text-gray-800 placeholder-gray-400"
                disabled={isAudioLoading}
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2.5 bg-[#3E8E67] text-white rounded-lg hover:bg-[#2F6B50] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isAudioLoading}
              >
                Send
              </motion.button>
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