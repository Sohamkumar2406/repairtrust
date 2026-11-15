"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  X,
  Send,
  MessageSquare,
  ShieldCheck,
  User,
  Loader2,
  RefreshCw,
  Phone,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface ChatMessage {
  id: string;
  sender_id: string;
  message_text: string;
  created_at: string;
  sender?: {
    full_name?: string;
    role?: string;
  };
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  recipientName: string;
  recipientRole: "Technician" | "Customer";
  recipientPhone?: string;
  serviceTitle: string;
}

export function ChatModal({
  isOpen,
  onClose,
  bookingId,
  recipientName,
  recipientRole,
  recipientPhone,
  serviceTitle,
}: ChatModalProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
    if (!bookingId) return;
    try {
      const res = await fetch(`/api/chat/messages?bookingId=${bookingId}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setMessages(data.messages || []);
      }
    } catch {
      // Ignore background poll errors
    } finally {
      setIsLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    if (!isOpen || !bookingId) return;
    setIsLoading(true);
    fetchMessages();

    // Auto-refresh chat every 4 seconds while modal is open
    const interval = setInterval(fetchMessages, 4000);
    return () => clearInterval(interval);
  }, [isOpen, bookingId, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || !bookingId || isSending) return;

    setIsSending(true);
    setInputText("");

    // Optimistic UI update
    const tempId = `temp-${Date.now()}`;
    const optimisticMsg: ChatMessage = {
      id: tempId,
      sender_id: user?.id || "",
      message_text: text,
      created_at: new Date().toISOString(),
      sender: { full_name: "You" },
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          messageText: text,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchMessages();
      }
    } catch {
      // Revert if failed
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  const quickReplies =
    recipientRole === "Technician"
      ? [
          "Please call when you reach the gate",
          "What time will you arrive?",
          "Flat # is on 3rd floor, lift available",
        ]
      : [
          "I'm on my way, arriving in 15 mins",
          "I have arrived at the location",
          "Inspection completed, repair starting now",
        ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[580px] max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Chat Header */}
        <div className="p-4 bg-[#101828] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 flex items-center justify-center font-bold text-sm">
              {recipientName ? recipientName.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white truncate max-w-[200px]">
                  {recipientName || "Service Partner"}
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  {recipientRole}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-[240px]">
                {serviceTitle} • Doorstep Secure Chat
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {recipientPhone && (
              <a
                href={`tel:${recipientPhone}`}
                className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                title={`Call ${recipientPhone}`}
              >
                <Phone className="w-4 h-4 text-emerald-400" />
              </a>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
              <span className="text-xs">Loading conversation...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center mx-auto shadow-sm">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-bold text-slate-800">No messages yet</h4>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                Coordinate doorstep arrival, directions, or ask questions directly with verified {recipientRole}.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.sender_id === user?.id;
              const timeFormatted = new Date(msg.created_at).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs shadow-sm ${
                      isMine
                        ? "bg-emerald-600 text-white rounded-br-xs"
                        : "bg-white text-slate-900 border border-slate-200 rounded-bl-xs"
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.message_text}</p>
                    <span
                      className={`text-[9px] block mt-1 text-right font-medium ${
                        isMine ? "text-emerald-100" : "text-slate-400"
                      }`}
                    >
                      {timeFormatted}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        <div className="px-3 py-2 bg-slate-100/80 border-t border-slate-200 overflow-x-auto flex gap-1.5 no-scrollbar shrink-0">
          {quickReplies.map((qr, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(qr)}
              className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 whitespace-nowrap transition-colors shrink-0 shadow-xs"
            >
              {qr}
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800 placeholder-slate-400"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl shadow-sm transition-colors"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
