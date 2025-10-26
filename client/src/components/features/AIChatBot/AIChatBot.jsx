// client/src/components/features/AIChatBot/AIChatBot.jsx - UPGRADED VERSION

import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, Loader2, MessageSquare } from 'lucide-react'; // Removed AlertTriangle as it's not used here
import api from '../../../services/api.js';

const AIChatBot = ({ projectTitle, projectDescription }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: `Hello! I am the project AI. I can explain "${projectTitle}" in detail. Ask me about the system architecture, hardware decisions, or machine learning model used!` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null); // Ref to scroll to
  const scrollContainerRef = useRef(null);
  // --- SCROLLING FIX: useEffect for Scrolling ---
  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollContainerRef.current) {
        // More reliable method: Directly set the scrollTop property
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
      }
      // Alternative: Keep scrollIntoView if direct scrollTop fails
      // messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
    // Run after a slight delay
    const timer = setTimeout(scrollToBottom, 50); 
    return () => clearTimeout(timer);
  }, [messages]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const fullQuery = {
        query: userMessage,
        context: { title: projectTitle, description: projectDescription },
      };
      const response = await api.post('/ai/chat', fullQuery);
      const assistantResponse = response.data.text;
      setMessages(prev => [...prev, { role: 'assistant', text: assistantResponse }]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      // Use a more user-friendly error message, perhaps less technical
      let errorMessage = "Sorry, I encountered an issue connecting to the AI service. Please try again later.";
      if (error.message.includes('API key is missing')) {
          errorMessage = "AI service configuration error on the server. Please contact the administrator.";
      }
      setMessages(prev => [...prev, { role: 'assistant', text: errorMessage }]);
    } finally {
      setLoading(false);
    }
  };

  // --- Message Bubble Component with Improved Visibility ---
  const MessageBubble = ({ role, text }) => {
    const isUser = role === 'user';
    // Improved styling for contrast and appearance
    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`flex items-start max-w-lg p-3 rounded-xl shadow-md ${
          isUser 
            ? 'bg-pcb-green text-gray-900 rounded-br-none' // User message: Green background, dark text
            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-tl-none' // Assistant: Gray bg, light/dark text
        }`}>
          {/* Icons with adjusted colors */}
          {isUser ? (
            <User className="w-5 h-5 mr-3 mt-1 flex-shrink-0 text-gray-700 dark:text-gray-400 opacity-80" />
          ) : (
            <Bot className="w-5 h-5 mr-3 mt-1 flex-shrink-0 text-pcb-green dark:text-pcb-green-light" />
          )}
          {/* Ensure text wraps correctly and is readable */}
          <p className="text-sm whitespace-pre-wrap break-words">{text}</p>
        </div>
      </div>
    );
  };

  // --- Main Component Return ---
  return (
    // Main container - Darker background, defined height
    <div className="flex flex-col h-[500px] bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
      
      {/* Header - Improved contrast */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center bg-gray-50 dark:bg-gray-900 rounded-t-xl">
        <MessageSquare className="w-5 h-5 mr-2 text-pcb-green" />
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Project AI Assistant</h3>
      </div>

      {/* Messages Window - Ensure correct scrolling setup */}
      <div className="flex-grow p-4 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {messages.map((msg, index) => (
          <MessageBubble key={index} role={msg.role} text={msg.text} />
        ))}
        {/* Loading Indicator - Improved visibility */}
        {loading && (
          <div className="flex justify-start items-center mb-4 p-2">
             <Loader2 className="w-5 h-5 animate-spin text-pcb-green" />
             <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 font-medium">Thinking...</span>
          </div>
        )}
        {/* Scroll target div */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form - Improved contrast and styling */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700 flex bg-gray-50 dark:bg-gray-900 rounded-b-xl">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about components, models..."
          disabled={loading}
          className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-l-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                     focus:ring-2 focus:ring-pcb-green focus:border-transparent outline-none disabled:opacity-70
                     placeholder-gray-400 dark:placeholder-gray-500" // Placeholder color
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-pcb-green text-gray-900 p-3 rounded-r-lg hover:bg-pcb-green-dark 
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-pcb-green
                     transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default AIChatBot;