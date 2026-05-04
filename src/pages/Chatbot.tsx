import { useState, useEffect, useRef } from 'react';
import { 
  Send, Bot, User, Sparkles, Brain, Code, Database, Search, 
  Mic, Paperclip, MoreHorizontal, Settings, History, Plus,
  Shield, Zap, Globe, MessageSquare, Terminal, Phone, Cpu, Command
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  tools?: { name: string; status: 'using' | 'done' }[];
  thoughts?: string;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am your Agentic AI Assistant for I.T.S. I have access to the knowledge base and CRM tools. How can I assist you with student inquiries today?',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!response.ok) throw new Error('Chat failed');

      const data = await response.json();
      
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content,
        timestamp: new Date(),
        thoughts: "Analyzing student request... Matching with Knowledge Base... Formulating Hinglish response...",
        tools: [
          { name: 'KB Search', status: 'done' },
          { name: 'Context Analysis', status: 'done' }
        ]
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error connecting to my core brain. Please check the ANTHROPIC_API_KEY in the .env file.',
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-[#050506] text-gray-100 overflow-hidden font-sans">
      {/* Sidebar - Modern Dark */}
      <div className="w-72 border-r border-white/5 bg-[#09090b] hidden lg:flex flex-col">
        <div className="p-6">
          <button 
            onClick={() => setMessages([{
              id: '1',
              role: 'assistant',
              content: 'New session started. How can I help?',
              timestamp: new Date(),
            }])}
            className="w-full flex items-center gap-2 justify-center px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-lg shadow-indigo-600/20 font-semibold text-sm border border-white/10"
          >
            <Plus className="w-4 h-4" /> New Consultation
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar">
          <div className="px-3 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Recent Sessions</div>
          {[
            'B.Tech Admission Query',
            'Placement Statistics 2026',
            'Campus Tour Scheduling',
            'Scholarship Eligibility'
          ].map((chat, i) => (
            <button key={i} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all text-left group">
              <MessageSquare className="w-4 h-4 opacity-50 group-hover:opacity-100" />
              <span className="truncate">{chat}</span>
            </button>
          ))}
        </div>

        <div className="p-6 border-t border-white/5 bg-black/20">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate text-white">Agent Core v4.2</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Anthropic Sonnet</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative bg-gradient-to-b from-[#0a0a0b] to-[#050506]">
        {/* Futuristic Header */}
        <div className="h-16 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full animate-pulse"></div>
              <div className="relative w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner">
                <Brain className="w-6 h-6" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black tracking-tight text-white uppercase">I.T.S AI ADMISSIONS</h2>
                <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[8px] font-black border border-indigo-500/20">BETA</span>
              </div>
              <p className="text-[10px] text-gray-500 font-bold tracking-widest flex items-center gap-1.5">
                <Globe className="w-3 h-3 text-indigo-500" /> KNOWLEDGE BASE CONNECTED
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 px-4 py-1.5 bg-white/5 rounded-full border border-white/10">
              <div className="flex -space-x-2">
                <div className="w-5 h-5 rounded-full border-2 border-[#09090b] bg-blue-500 flex items-center justify-center text-[8px] font-bold">DB</div>
                <div className="w-5 h-5 rounded-full border-2 border-[#09090b] bg-green-500 flex items-center justify-center text-[8px] font-bold">CL</div>
              </div>
              <span className="text-[10px] font-black text-gray-300">ACTIVE TOOLS</span>
            </div>
            <button className="p-2 hover:bg-white/5 rounded-xl transition-colors">
              <Settings className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Messages - Premium Bubble Style */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar scroll-smooth">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
              <div className={`flex gap-5 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-2xl transition-transform hover:scale-110 ${
                  msg.role === 'assistant' 
                    ? 'bg-gradient-to-tr from-indigo-600 to-violet-600 text-white border border-white/20' 
                    : 'bg-white/10 border border-white/10 text-gray-400'
                }`}>
                  {msg.role === 'assistant' ? <Bot className="w-6 h-6" /> : <User className="w-6 h-6" />}
                </div>
                
                <div className={`space-y-4 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-5 rounded-3xl shadow-2xl leading-relaxed text-[15px] ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-none border border-white/10'
                      : 'bg-[#161618] text-gray-200 border border-white/5 rounded-tl-none shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]'
                  }`}>
                    {msg.content}
                  </div>
                  
                  {msg.thoughts && msg.role === 'assistant' && (
                    <div className="w-full p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 backdrop-blur-sm">
                      <div className="flex items-center gap-2 mb-2 text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em]">
                        <Sparkles className="w-3.5 h-3.5 animate-spin-slow" /> Agent Reasoning
                      </div>
                      <p className="text-xs text-gray-400 italic leading-relaxed font-medium">
                        {msg.thoughts}
                      </p>
                    </div>
                  )}

                  {msg.tools && msg.tools.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {msg.tools.map((tool, i) => (
                        <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-gray-400">
                          <div className={`w-1.5 h-1.5 rounded-full ${tool.status === 'using' ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`}></div>
                          {tool.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start animate-in fade-in slide-in-from-left-4">
              <div className="flex gap-5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center animate-pulse border border-white/20">
                  <Bot className="w-6 h-6" />
                </div>
                <div className="p-5 bg-[#161618] border border-white/5 rounded-3xl rounded-tl-none shadow-2xl flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-duration:0.8s]"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Floating Input Dock */}
        <div className="p-8 pt-0">
          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-[28px] blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
            
            <div className="relative bg-[#161618]/80 backdrop-blur-2xl border border-white/10 rounded-[24px] shadow-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 bg-black/20">
                <button className="px-3 py-1.5 hover:bg-white/5 rounded-lg text-[10px] font-bold text-gray-400 flex items-center gap-2 transition-all">
                  <Database className="w-3.5 h-3.5 text-blue-500" /> CRM DATA
                </button>
                <div className="w-px h-3 bg-white/10"></div>
                <button className="px-3 py-1.5 hover:bg-white/5 rounded-lg text-[10px] font-bold text-gray-400 flex items-center gap-2 transition-all">
                  <Globe className="w-3.5 h-3.5 text-purple-500" /> KNOWLEDGE BASE
                </button>
              </div>

              <div className="flex items-end gap-2 p-4">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Ask me about student enrollment, fees, or placements..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 min-h-[44px] max-h-[200px] resize-none text-white placeholder-gray-600"
                />
                <div className="flex items-center gap-2 pb-1">
                  <button className="p-2.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-20 disabled:grayscale text-white rounded-2xl shadow-lg shadow-indigo-600/30 transition-all transform active:scale-95"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-2 text-[9px] font-black text-gray-600 uppercase tracking-[0.2em]">
                <Command className="w-3 h-3" /> COMMAND CENTER ACTIVE
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Capabilities Overview - Right Sidebar */}
      <div className="w-80 border-l border-white/5 bg-[#09090b] hidden xl:flex flex-col overflow-y-auto">
        <div className="p-8 space-y-10">
          <section>
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6">Autonomous Tools</h3>
            <div className="grid grid-cols-1 gap-4">
              {[
                { name: 'Turso Database', icon: Database, color: 'bg-blue-500/10 text-blue-400', desc: 'CRM Data Access' },
                { name: 'Ringg AI Sync', icon: Phone, color: 'bg-green-500/10 text-green-400', desc: 'Voice Agent Control' },
                { name: 'Anthropic Core', icon: Zap, color: 'bg-amber-500/10 text-amber-400', desc: 'Claude 3.5 Sonnet' },
                { name: 'Markdown KB', icon: Globe, color: 'bg-purple-500/10 text-purple-400', desc: 'I.T.S Knowledge Base' }
              ].map((tool, i) => (
                <div key={i} className="group p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl ${tool.color}`}>
                      <tool.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{tool.name}</p>
                      <p className="text-[10px] text-gray-500 font-medium">{tool.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6">Console Output</h3>
            <div className="p-5 bg-black/40 rounded-2xl border border-white/5 font-mono text-[10px] space-y-3 shadow-inner">
              <div className="flex gap-3">
                <span className="text-indigo-500 font-bold">»</span>
                <span className="text-gray-400">INITIALIZING_NEURAL_NET</span>
              </div>
              <div className="flex gap-3">
                <span className="text-green-500 font-bold">»</span>
                <span className="text-gray-300">KB_READY: itsecgn.md</span>
              </div>
              <div className="flex gap-3">
                <span className="text-indigo-500 font-bold">»</span>
                <span className="text-gray-400">AGENT_LISTENING...</span>
              </div>
              <div className="flex gap-3 animate-pulse">
                <span className="text-indigo-500 font-bold">_</span>
                <span className="text-gray-700">AWAITING_INPUT</span>
              </div>
            </div>
          </section>

          <div className="p-5 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:scale-125 transition-transform">
              <Shield className="w-12 h-12 text-indigo-500" />
            </div>
            <p className="text-xs font-black text-white mb-2">Neural Guardrails</p>
            <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
              Enterprise safety layers active. All interactions are monitored for compliance and data privacy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
