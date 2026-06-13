import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, AlertCircle, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { trackUserBehavior, getActiveSegmentation } from '../lib/personalization';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  createdAt: string;
}

interface CustomerServiceChatProps {
  onAddToCart: (productId: string) => void;
}

export default function CustomerServiceChat({ onAddToCart }: CustomerServiceChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'model',
      text: "Secured uplink established. Welcome to SHIPSAFE AI. I am Aetheria, your expert system security advisor.\n\nWe provide bulletproof coding-agent guardrails and launch checklists instantly upon upfront payment. Tell me about your release bottlenecks or codebase setups, and I will recommend the perfect license or issue a premium authorized developer discount code.",
      createdAt: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    setError(null);
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      text: inputMessage,
      createdAt: new Date().toISOString()
    };

    // Feed conversational details to behavioral log trigger
    trackUserBehavior("chat_query", "customer_chat", inputMessage);

    setMessages(prev => [...prev, userMsg]);
    const promptToSend = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      const activeSeg = getActiveSegmentation();
      
      // Proxying conversation memory as a sequence of dialogue roles with dynamic customer segment
      const response = await fetch('/api/gemini/sales-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: promptToSend,
          history: messages.map(m => ({ role: m.role, text: m.text })),
          userSegment: activeSeg.segment.id
        })
      });

      if (!response.ok) {
        throw new Error(" concierge is refreshing operations. Please try again.");
      }

      const data = await response.json();
      
      const modelMsg: ChatMessage = {
        id: `msg-${Date.now()}-model`,
        role: 'model',
        text: data.text || "I apologize, my system neural path is focusing. How else may I direct your business scaling?",
        createdAt: new Date().toISOString()
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch (err: any) {
      setError(err.message || "Network timeout.");
      setMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now()}-error`,
          role: 'model',
          text: "My neural link experienced a high-traffic routing delay. Feel free to use checkout directly, or enter coupon 'AETHER10' to receive 10% off of any purchase!",
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const selectShortcut = (text: string) => {
    setInputMessage(text);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            id="chat-trigger-btn"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 bg-black text-white rounded-full p-4 md:px-5 md:py-3.5 shadow-2xl hover:bg-neutral-800 transition-all border border-transparent max-w-xs cursor-pointer font-mono text-xs tracking-widest font-black uppercase"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="hidden md:inline">Ask Aetheria</span>
            <div className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 bg-[#1a1a1a] rounded-full border-2 border-white animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="customer-service-chat-card"
            initial={{ opacity: 0, y: 100, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.98 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="w-[92vw] sm:w-[380px] h-[540px] bg-white rounded-[3rem] border border-neutral-150 shadow-2xl flex flex-col overflow-hidden text-black"
          >
            {/* Header */}
            <div className="p-6 bg-neutral-50 border-b border-neutral-100 flex items-center justify-between text-black">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-neutral-200 flex items-center justify-center border border-neutral-150">
                    <Sparkles className="w-4 h-4 text-black animate-pulse" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#000000] rounded-full border-2 border-white" />
                </div>
                <div>
                  <h3 className="font-display font-black text-xs tracking-widest uppercase text-black">Aetheria AI</h3>
                  <p className="font-mono text-[9px] text-[#737373] tracking-widest font-bold uppercase">CONVERSION ADVISOR</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#737373] hover:text-black p-1.5 rounded-full hover:bg-neutral-150 transition"
                id="close-chat-btn"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Thread */}
            <div className="flex-1 p-6 overflow-y-auto fancy-scrollbar space-y-4 bg-white">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-[1.5rem] px-4 py-3 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-black text-white rounded-tr-none shadow-md'
                        : 'bg-neutral-50 border border-neutral-100 text-black rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line text-[11px] font-sans leading-relaxed">{msg.text}</p>
                    <span className="block text-[8px] text-[#a3a3a3] mt-1.5 text-right font-mono font-bold uppercase tracking-wider">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-neutral-50 border border-neutral-100 rounded-[1.5rem] px-4 py-3 flex items-center gap-1.5 shadow-sm">
                    <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" />
                  </div>
                </div>
              )}

              {error && (
                <div className="flex justify-center">
                  <div className="flex items-center gap-1.5 text-black text-[9px] py-1 bg-neutral-100 px-3 rounded-full border border-neutral-200 font-mono">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span className="uppercase tracking-widest font-black">Neural routing timeout; coupon active.</span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            <div className="px-3 py-2 bg-white border-t border-neutral-100 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5">
              <button
                onClick={() => selectShortcut("Which license includes corporate resell rights?")}
                className="text-[9px] bg-neutral-50 hover:bg-neutral-100 text-[#737373] hover:text-black hover:border-neutral-250 px-4 py-2 border border-neutral-150 rounded-full font-mono cursor-pointer transition uppercase tracking-wider font-extrabold"
              >
                Resell Rights
              </button>
              <button
                onClick={() => selectShortcut("Can I have a discounts coupon?")}
                className="text-[9px] bg-neutral-50 hover:bg-neutral-100 text-[#737373] hover:text-black hover:border-neutral-250 px-4 py-2 border border-neutral-150 rounded-full font-mono cursor-pointer transition uppercase tracking-wider font-extrabold"
              >
                Claim Coupon
              </button>
              <button
                onClick={() => selectShortcut("How do I download templates after payment?")}
                className="text-[9px] bg-neutral-50 hover:bg-neutral-100 text-[#737373] hover:text-black hover:border-neutral-250 px-4 py-2 border border-neutral-150 rounded-full font-mono cursor-pointer transition uppercase tracking-wider font-extrabold"
              >
                Downloads Info
              </button>
            </div>

            {/* Active Checkout Trigger inside Chat (Conversion) */}
            <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-[9px] text-[#737373] font-mono uppercase font-bold tracking-wider">
              <span className="flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-black" />
                <span>Bundle discounts apply</span>
              </span>
              <button
                onClick={() => onAddToCart("asset_commercial")}
                className="text-black hover:text-neutral-800 font-extrabold uppercase text-[9px] hover:underline cursor-pointer tracking-widest font-mono"
              >
                Add Commercial +
              </button>
            </div>

            {/* Message Input Form */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-neutral-100 flex items-center gap-2">
              <input
                id="chat-input-field"
                type="text"
                placeholder="Message Aetheria..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isLoading}
                className="flex-1 bg-neutral-50 border border-neutral-200 rounded-full px-5 py-3 text-xs text-black focus:outline-none focus:border-black font-mono transition placeholder-neutral-400"
              />
              <button
                id="submit-chat-btn"
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="bg-black text-white p-3 border border-transparent rounded-full hover:bg-neutral-800 disabled:opacity-45 transition cursor-pointer shadow-lg shadow-black/10 shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
