import React from 'react';
import { X, Settings2, Shield, Cpu, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const SettingsPanel = ({ close, model, setModel, apiKeyOverride, setApiKeyOverride, systemPrompt, setSystemPrompt }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/60 z-50 flex justify-center items-center p-4 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="glass-panel rounded-2xl p-8 w-full max-w-md shadow-2xl relative border border-white/10"
      >
        <button 
          onClick={close} 
          className="absolute right-5 top-5 p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-gradient-to-tr from-purple-500/20 to-blue-500/20 rounded-xl text-purple-400">
            <Settings2 size={24} />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Configuration</h2>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <Cpu size={16} className="text-blue-400" />
              AI Model
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-colors shadow-inner"
            >
              <option value="gpt-3.5-turbo">Gemini 2.5 Flash (Fast)</option>
              <option value="gpt-4">Gemini 2.5 Pro (Most Powerful)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <Shield size={16} className="text-emerald-400" />
              API Key Override
            </label>
            <input
              type="password"
              placeholder="sk-..."
              value={apiKeyOverride}
              onChange={(e) => setApiKeyOverride(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-colors shadow-inner placeholder:text-gray-600"
            />
            <p className="text-xs text-gray-500 mt-1">Leave blank to use default server key.</p>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <Sparkles size={16} className="text-amber-400" />
              System Instructions
            </label>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white h-28 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-colors shadow-inner custom-scrollbar resize-none placeholder:text-gray-600"
              placeholder="You are a helpful assistant."
            />
          </div>
        </div>

        <button 
          onClick={close} 
          className="mt-8 w-full bg-white text-black font-semibold rounded-xl py-3 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
        >
          Select & Save
        </button>
      </motion.div>
    </motion.div>
  );
};

export default SettingsPanel;
