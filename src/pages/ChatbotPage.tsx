import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from '@/components/Chat/ChatMessage';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am the Kodemy AI Assistant. How can I help you with your learning today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      // NOTE: Replace this endpoint with the actual Hugging Face Space API endpoint provided by the user.
      const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${import.meta.env.VITE_HF_TOKEN}` // Requires a token usually if not a public spaces endpoint wrapper
        },
        body: JSON.stringify({
          inputs: `[INST] ${userMsg} [/INST]`, 
          // Adjust payload structure based on the specific Hugging Face spaces endpoint.
        })
      });

      if (!response.ok) {
        throw new Error('API Error');
      }

      const data = await response.json();
      
      // Attempt to extract response based on common HuggingFace inference API formats
      let aiText = "Sorry, I couldn't process your request.";
      if (Array.isArray(data) && data[0]?.generated_text) {
         // Some models return the full prompt + response. Strip the prompt.
         aiText = data[0].generated_text.replace(`[INST] ${userMsg} [/INST]`, '').trim();
      } else if (data.generated_text) {
         aiText = data.generated_text;
      } else if (typeof data === 'string') {
         aiText = data;
      }

      setMessages(prev => [...prev, { role: 'assistant', content: aiText }]);
    } catch (error) {
       console.error("Chat API Error:", error);
       setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: "Sorry, I'm having trouble connecting to the AI server right now. If linking to a Hugging Face space, please ensure the correct API endpoint is configured." 
       }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white font-sans">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm flex items-center h-16 px-6">
        <h1 className="text-xl font-bold font-serif tracking-tight text-[#1c1d1f]">Kodemy AI Assistant</h1>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="pb-32 pt-4">
          {messages.map((msg, index) => (
            <ChatMessage key={index} role={msg.role} content={msg.content} />
          ))}
          {loading && (
            <div className="py-6 px-4 bg-[#f7f9fa] border-y border-gray-100">
               <div className="max-w-3xl mx-auto flex gap-6">
                 <div className="w-8 h-8 rounded-sm bg-[#a435f0] flex-shrink-0 flex items-center justify-center font-bold text-white text-sm">
                   AI
                 </div>
                 <div className="flex-1 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                 </div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-6 pb-6 px-4">
        <div className="max-w-3xl mx-auto">
          <form 
            onSubmit={handleSubmit}
            className="flex items-end gap-2 bg-white border border-gray-300 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] p-2 focus-within:ring-1 focus-within:ring-[#1c1d1f] focus-within:border-[#1c1d1f]"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Ask me anything..."
              className="flex-1 max-h-48 min-h-[44px] resize-none outline-none bg-transparent p-3 text-[#1c1d1f]"
              rows={1}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-3 bg-[#1c1d1f] text-white rounded-lg hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-0.5"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
          <div className="text-center mt-3">
             <span className="text-xs text-gray-400">AI can make mistakes. Consider verifying important information.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
