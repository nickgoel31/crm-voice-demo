import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Brain, X, Cpu } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! I am the I.T.S AI Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!response.ok) throw new Error('Chat failed');

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I am having trouble connecting to my core brain.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[9999] flex flex-col items-end font-sans">
      {/* Chat Window - Premium Dark Style */}
      {isOpen && (
        <div className="mb-6 w-[420px] h-[600px] bg-[#0d0d0f] rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] border border-white/10 flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-500 backdrop-blur-2xl">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-[#1a1a1c] to-[#0d0d0f] border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500/20 blur-lg rounded-full animate-pulse"></div>
                <div className="relative w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Brain className="w-6 h-6" />
                </div>
              </div>
              <div>
                <p className="text-sm font-black text-white tracking-tight uppercase">I.T.S AI CORE</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Autonomous Mode</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-2 hover:bg-white/5 text-gray-500 hover:text-white rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.05),transparent)]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center mt-1 shadow-lg ${
                    msg.role === 'assistant' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-gray-400'
                  }`}>
                    {msg.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <div className={`p-4 rounded-2xl text-[14px] leading-relaxed shadow-xl ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none border border-white/10' 
                      : 'bg-[#1a1a1c] text-gray-200 border border-white/5 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center animate-pulse shadow-lg">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-4 bg-[#1a1a1c] rounded-2xl rounded-tl-none border border-white/5 shadow-xl">
                    <div className="flex gap-1.5">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-duration:0.8s]"></div>
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions Dock */}
          <div className="px-6 py-3 border-t border-white/5 bg-black/20 flex gap-2 overflow-x-auto no-scrollbar">
            {['Admission Query', 'Fee Structure', 'B.Tech Courses', 'Placements'].map((tag) => (
              <button 
                key={tag}
                onClick={() => { setInput(tag); }}
                className="whitespace-nowrap px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-gray-400 hover:text-white hover:bg-indigo-600/20 hover:border-indigo-500/30 transition-all uppercase tracking-wider"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-white/5 bg-[#0d0d0f]">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-2 focus-within:border-indigo-500/50 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask your query..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-white placeholder-gray-600 py-2"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl disabled:opacity-20 transition-all shadow-lg shadow-indigo-600/30"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-gray-600 text-center mt-4 font-bold uppercase tracking-[0.2em]">
              Powered by Anthropic Claude 3.5
            </p>
          </div>
        </div>
      )}

      {/* Modern Floating Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative w-16 h-16 rounded-[22px] flex items-center justify-center shadow-[0_20px_40px_-8px_rgba(79,70,229,0.4)] transition-all duration-500 transform hover:scale-110 active:scale-95 ${
          isOpen ? 'bg-white text-gray-900 rotate-180' : 'bg-indigo-600 text-white hover:bg-indigo-500'
        }`}
      >
        <div className={`absolute inset-0 bg-indigo-500/30 blur-2xl rounded-full transition-opacity duration-500 ${isOpen ? 'opacity-0' : 'opacity-100 group-hover:opacity-100'}`}></div>
        <div className="relative">
          {isOpen ? <X className="w-7 h-7" /> : <Brain className="w-8 h-8" />}
        </div>
        {!isOpen && (
          <div className="absolute top-0 right-0 w-5 h-5 bg-pink-500 rounded-full border-4 border-[#050506] flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
          </div>
        )}
      </button>
    </div>
  );
}
