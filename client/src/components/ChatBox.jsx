import React, { useState, useEffect, useRef } from 'react';
import { Send, Menu, Paperclip, Bot, User, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';

const ChatBox = ({ chat, fetchChats, model, apiKeyOverride, systemPrompt, toggleSidebar }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (chat) {
      setMessages(chat.messages);
    } else {
      setMessages([]);
    }
  }, [chat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const { data } = await api.post('/chats/upload', formData);
      setInput((prev) => prev ? prev + `\n\n[Extracted context from ${file.name}]:\n${data.extractedText}` : `[Extracted context from ${file.name}]:\n${data.extractedText}`);
    } catch (error) {
      alert('Error uploading file: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
    
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !chat || loading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const { data } = await api.post('/chats/message', {
        chatId: chat._id,
        content: userMessage,
        role: 'user',
        model,
        apiKeyOverride,
        systemPrompt
      });
      setMessages(data.messages);
      fetchChats();
    } catch (error) {
      alert(error.response?.data?.message || 'Error communicating with the AI. Ensure your API Key is correct.');
      setMessages(prev => prev.slice(0, -1));
      setInput(userMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!chat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#0a0a0b] relative">
        <button className="absolute top-6 left-6 p-2 lg:hidden text-gray-500 hover:text-white glass-panel rounded-lg z-10 transition-colors" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center flex flex-col items-center"
        >
          <div className="w-24 h-24 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/20 mb-6">
             <Bot size={48} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent mb-2">
            AI Assistant
          </h2>
          <p className="text-gray-500 text-lg">Select or create a new chat to start</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0a0b] relative">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center p-4 border-b border-white/5 bg-[#0a0a0b]/80 backdrop-blur-md sticky top-0 z-10">
        <button onClick={toggleSidebar} className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg mr-3 transition-colors">
          <Menu size={20} />
        </button>
        <h1 className="font-semibold text-white truncate flex-1 text-center pr-10">{chat.title}</h1>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto w-full flex flex-col pt-10 pb-4 custom-scrollbar scroll-smooth relative z-0">
        {messages.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="m-auto text-center px-4 max-w-lg">
            <h2 className="text-4xl font-bold mb-4 animate-gradient-text">How can I help?</h2>
            <p className="text-gray-500 text-sm">Ask anything, request code, or upload documents for context.</p>
          </motion.div>
        )}
        
        <AnimatePresence>
          {messages.map((ms, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              key={index} 
              className={`w-full ${ms.role === 'assistant' ? 'bg-white/[0.02] border-y border-white/[0.02]' : ''} py-8 px-4 md:px-0`}
            >
              <div className="max-w-4xl mx-auto flex gap-6">
                <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center shadow-lg ${
                  ms.role === 'user' ? 'bg-gradient-to-tr from-blue-600 to-indigo-600' : 'bg-gradient-to-tr from-purple-600 to-pink-600'
                }`}>
                  {ms.role === 'user' ? <User size={20} className="text-white" /> : <Bot size={22} className="text-white" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="prose prose-invert max-w-none text-gray-200 prose-pre:bg-[#1e1e1e] prose-pre:border prose-pre:border-white/10 prose-pre:shadow-xl mt-1 overflow-x-auto custom-scrollbar font-normal leading-relaxed text-[15px]">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                       {ms.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full bg-white/[0.02] border-y border-white/[0.02] py-8 px-4 md:px-0"
            >
              <div className="max-w-4xl mx-auto flex gap-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 shrink-0 flex items-center justify-center shadow-lg animate-pulse">
                  <Sparkles size={20} className="text-white" />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Futuristic Input Area */}
      <div className="w-full bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b] border-t border-white/5 pt-6 pb-8 z-10">
        <div className="max-w-4xl mx-auto px-4 lg:px-0">
          <div className="relative flex items-center group glass-input rounded-2xl p-2 shadow-xl shadow-black">
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-3 text-gray-400 hover:text-purple-400 hover:bg-white/5 rounded-xl transition-colors shrink-0"
              title="Upload Document"
            >
              <Paperclip size={22} />
              <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.txt" onChange={handleFileUpload} disabled={loading} />
            </button>
            
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(e);
                }
              }}
              placeholder="Ask me anything..."
              className="flex-1 resize-none bg-transparent border-none py-3 px-2 text-[15px] focus:outline-none text-white max-h-48 custom-scrollbar placeholder:text-gray-500"
              rows="1"
              style={{ minHeight: '48px' }}
              disabled={loading}
            />

            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="p-3 ml-2 shrink-0 bg-white text-black rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:hover:bg-white flex items-center justify-center"
            >
              <Send size={20} className={input.trim() ? "fill-black" : ""} />
            </button>
          </div>
          <div className="text-center text-xs text-gray-500 mt-4 font-medium tracking-wide">
            Powered by Generative AI • Verify important information
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
