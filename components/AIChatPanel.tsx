import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, Loader2, Sparkles, ImagePlus } from 'lucide-react';
import { solveMathProblem } from '../services/geminiService';
import { ChatMessage } from '../types';

interface AIChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

const AIChatPanel: React.FC<AIChatPanelProps> = ({ isOpen, onClose, initialQuery }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hi! I'm your Gemini Math Assistant. Ask me to solve word problems, explain concepts, or help with complex calculations."
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && initialQuery) {
      handleSend(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialQuery]);

  const handleSend = async (queryOverride?: string) => {
    const textToSend = queryOverride || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await solveMathProblem(textToSend);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "I'm having trouble connecting right now. Please try again.",
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-40 bg-gray-950 flex flex-col animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg shadow-purple-900/30">
            <Bot className="text-white" size={24} />
          </div>
          <div>
            <h2 className="font-bold text-white text-lg tracking-tight">Gemini Assistant</h2>
            <p className="text-xs text-indigo-300">Powered by Gemini 2.5 Flash</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-gray-800 text-gray-100 rounded-tl-none border border-gray-700'
              }`}
            >
              {msg.role === 'model' && (
                <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                  <Sparkles size={12} /> Gemini Answer
                </div>
              )}
              <div className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-2xl rounded-tl-none p-4 border border-gray-700 flex items-center gap-3">
              <Loader2 className="animate-spin text-indigo-400" size={20} />
              <span className="text-gray-400 text-sm animate-pulse">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-gray-900 border-t border-gray-800">
        <div className="relative flex items-center gap-2">
          {/* File input placeholder for future image analysis features */}
          <button className="p-3 text-gray-400 hover:text-indigo-400 hover:bg-gray-800 rounded-xl transition-colors" title="Upload image (Demo)">
            <ImagePlus size={20} />
          </button>
          
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a math question..."
              className="w-full bg-gray-800 text-white border-0 rounded-xl pl-4 pr-12 py-3 focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
              disabled={isLoading}
            />
            <button 
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
        <p className="text-center text-xs text-gray-600 mt-2">
          AI can make mistakes. Review important calculations.
        </p>
      </div>
    </div>
  );
};

export default AIChatPanel;