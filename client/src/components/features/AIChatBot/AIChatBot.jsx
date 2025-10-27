// client/src/components/features/AIChatBot/AIChatBot.jsx - FINAL SCROLL FIX ATTEMPT

import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, Loader2, MessageSquare } from 'lucide-react';
import api from '../../../services/api.js';

const AIChatBot = ({ projectTitle, projectDescription }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: `Hello! I am the project AI. I can explain "${projectTitle}" in detail. Ask about the system architecture, hardware decisions, or machine learning model used!` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollContainerRef = useRef(null); // Ref for the scrollable container
  const messagesEndRef = useRef(null); // Ref for the end div (fallback)

  // --- FINAL SCROLLING LOGIC ---
  useEffect(() => {
    const scrollToBottom = () => {
      // Method 1: Direct scrollTop (Usually more reliable)
      if (scrollContainerRef.current) {
        // console.log("Scrolling using scrollTop"); // DEBUG
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
      }
      // Method 2: Fallback using scrollIntoView on the end element
      // else if (messagesEndRef.current) {
      //   console.log("Scrolling using scrollIntoView"); // DEBUG
      //   messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      // }
    };

    // Use requestAnimationFrame to ensure scroll happens after DOM paint
    const rafId = requestAnimationFrame(() => {
        // Further delay with setTimeout can sometimes help complex layouts
        const timerId = setTimeout(scrollToBottom, 50); 
        return () => clearTimeout(timerId);
    });

    // Cleanup function for requestAnimationFrame
    return () => cancelAnimationFrame(rafId);

  }, [messages]); // Dependency remains [messages]

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    // Optimistically update UI first
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const fullQuery = { query: userMessage, context: { title: projectTitle, description: projectDescription } };
      const response = await api.post('/ai/chat', fullQuery);
      const assistantResponse = response.data.text;
      // Update UI with assistant response
      setMessages(prev => [...prev, { role: 'assistant', text: assistantResponse }]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      let errorMessage = "Sorry, I encountered an issue connecting to the AI service.";
      // ... (error message logic)
      setMessages(prev => [...prev, { role: 'assistant', text: errorMessage }]);
    } finally {
      setLoading(false);
    }
  };

  const MessageBubble = ({ role, text }) => {
    const isUser = role === 'user';
    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`flex items-start max-w-lg p-3 rounded-xl shadow-md ${
          isUser 
            ? 'bg-pcb-green text-gray-900 rounded-br-none' 
            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-tl-none'
        }`}>
          {isUser ? ( <User className="w-5 h-5 mr-3 mt-1 flex-shrink-0 text-gray-700 dark:text-gray-400 opacity-80" /> ) 
                  : ( <Bot className="w-5 h-5 mr-3 mt-1 flex-shrink-0 text-pcb-green dark:text-pcb-green-light" /> )}
          <p className="text-sm whitespace-pre-wrap break-words">{text}</p>
        </div>
      </div>
    );
  };

  return (
    // Main container - Fixed Height, Overflow Hidden
    <div className="flex flex-col h-[500px] bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      
      {/* Header (Fixed) */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center bg-gray-50 dark:bg-gray-900 rounded-t-xl flex-shrink-0">
        <MessageSquare className="w-5 h-5 mr-2 text-pcb-green" />
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Project AI Assistant</h3>
      </div>

      {/* Messages Window (Scrollable with ref) */}
      <div 
        ref={scrollContainerRef} // Assign ref to the scrollable container
        className="flex-grow p-4 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
      > 
        {messages.map((msg, index) => (
          <MessageBubble key={index} role={msg.role} text={msg.text} />
        ))}
        {loading && (<div className="flex justify-start items-center mb-4 p-2">
           <Loader2 className="w-5 h-5 animate-spin text-pcb-green" />
           <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 font-medium">Thinking...</span>
        </div>
      )}
        {/* End ref div (mostly for scrollIntoView fallback) */}
        <div ref={messagesEndRef} style={{ height: '1px' }}/> 
      </div>

      {/* Input Form (Fixed) */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700 flex bg-gray-50 dark:bg-gray-900 rounded-b-xl flex-shrink-0">
        {/* Input */}
         <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about components, models..."
          disabled={loading}
          className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-l-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pcb-green focus:border-transparent outline-none disabled:opacity-70 placeholder-gray-400 dark:placeholder-gray-500"
        />
        {/* Button */}
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-pcb-green text-gray-900 p-3 rounded-r-lg hover:bg-pcb-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-pcb-green transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default AIChatBot;