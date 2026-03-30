import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Plus, MessageSquare, Trash2, Settings, LogOut, X, Sparkles } from 'lucide-react';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ chats, currentChatId, setCurrentChatId, fetchChats, isOpen, setIsOpen, setIsSettingsOpen }) => {
  const { logout, user } = useContext(AuthContext);

  const createChat = async () => {
    try {
      const { data } = await api.post('/chats');
      await fetchChats();
      setCurrentChatId(data._id);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteChat = async (id, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/chats/${id}`);
      if (currentChatId === id) setCurrentChatId(null);
      fetchChats();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="w-72 bg-[#121214] text-white flex flex-col h-full absolute md:relative z-20 shadow-2xl border-r border-white/5"
        >
          <div className="p-4 flex items-center justify-between">
            <button 
              onClick={createChat}
              className="flex-1 flex items-center gap-2 bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-500 hover:to-blue-500 p-3 rounded-xl transition shadow-lg shadow-purple-500/20 font-medium tracking-wide"
            >
              <Sparkles size={18} className="text-white" />
              New Chat
            </button>
            <button className="md:hidden ml-3 p-2 hover:bg-white/10 rounded-xl transition" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Recent Conversations
          </div>

          <div className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar">
            {chats.map(c => (
              <motion.div 
                whileHover={{ scale: 0.98 }}
                onClick={() => setCurrentChatId(c._id)}
                key={c._id}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer group transition-colors duration-200 ${
                  currentChatId === c._id ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-gray-400'
                }`}
              >
                <MessageSquare size={16} />
                <span className="flex-1 truncate text-sm">{c.title}</span>
                <button 
                  onClick={(e) => deleteChat(c._id, e)}
                  className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </div>

          <div className="p-4 border-t border-white/5">
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-3 w-full p-3 hover:bg-white/5 rounded-xl transition text-sm text-gray-400 hover:text-white"
            >
              <Settings size={18} /> Settings
            </button>
            
            <div className="flex items-center justify-between gap-3 w-full p-3 mt-2 rounded-xl text-sm bg-black/40 border border-white/5 shadow-inner">
              <div className="flex items-center gap-2 truncate">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold font-mono">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="truncate text-gray-300 font-medium">{user?.name}</span>
              </div>
              <button onClick={logout} className="text-gray-500 hover:text-white transition-colors p-1" title="Logout">
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
