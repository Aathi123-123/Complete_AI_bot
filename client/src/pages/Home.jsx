import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ChatBox from '../components/ChatBox';
import SettingsPanel from '../components/SettingsPanel';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [apiKeyOverride, setApiKeyOverride] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful assistant.');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const fetchChats = async () => {
    try {
      const { data } = await api.get('/chats');
      setChats(data);
      if (data.length > 0 && !currentChatId) {
        setCurrentChatId(data[0]._id);
      }
    } catch (error) {
      console.error('Failed to fetch chats from server: Is MongoDB running?');
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const currentChat = chats.find(c => c._id === currentChatId);

  return (
    <div className="flex h-screen bg-[#0a0a0b] overflow-hidden text-gray-200">
      <Sidebar 
        chats={chats} 
        currentChatId={currentChatId} 
        setCurrentChatId={setCurrentChatId} 
        fetchChats={fetchChats}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        setIsSettingsOpen={setIsSettingsOpen}
      />
      
      <div className="flex-1 flex flex-col w-full relative h-full">
        <ChatBox 
          chat={currentChat} 
          fetchChats={fetchChats}
          model={model}
          apiKeyOverride={apiKeyOverride}
          systemPrompt={systemPrompt}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        
        <AnimatePresence>
          {isSettingsOpen && (
            <SettingsPanel 
              close={() => setIsSettingsOpen(false)}
              model={model} setModel={setModel}
              apiKeyOverride={apiKeyOverride} setApiKeyOverride={setApiKeyOverride}
              systemPrompt={systemPrompt} setSystemPrompt={setSystemPrompt}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Home;
