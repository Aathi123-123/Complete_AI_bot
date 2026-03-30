import Chat from '../models/Chat.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import pdfParse from 'pdf-parse';

// Map frontend model selection to valid Gemini model IDs
const getGeminiModel = (model) => {
  const map = {
    'gpt-3.5-turbo': 'gemini-2.5-flash',
    'gpt-4': 'gemini-2.5-pro',
  };
  if (model && model.startsWith('gemini')) return model;
  return map[model] || 'gemini-2.5-flash';
};

export const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user._id }).sort('-updatedAt');
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createChat = async (req, res) => {
  try {
    const chat = await Chat.create({ user: req.user._id, title: 'New Chat', messages: [] });
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteChat = async (req, res) => {
  try {
    await Chat.findByIdAndDelete(req.params.id);
    res.json({ message: 'Chat removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const renameChat = async (req, res) => {
  try {
    const chat = await Chat.findByIdAndUpdate(req.params.id, { title: req.body.title }, { new: true });
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addMessage = async (req, res) => {
  const { chatId, content, role, model, apiKeyOverride, systemPrompt } = req.body;

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    // Add user message
    if (role === 'user') {
      chat.messages.push({ role: 'user', content });
      if (chat.title === 'New Chat') {
        chat.title = content.substring(0, 40) + (content.length > 40 ? '...' : '');
      }
    }

    if (systemPrompt) chat.systemPrompt = systemPrompt;
    await chat.save();

    if (role === 'user') {
      let aiResponse = '';
      try {
        const apiKey = apiKeyOverride || process.env.GEMINI_API_KEY;
        const genAI = new GoogleGenerativeAI(apiKey);
        const geminiModel = getGeminiModel(model);
        const generativeModel = genAI.getGenerativeModel({
          model: geminiModel,
          systemInstruction: chat.systemPrompt,
        });

        // Build history (all messages except the last one, as that's the new user message)
        const history = chat.messages.slice(0, -1).map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

        const geminiChat = generativeModel.startChat({ history });
        const result = await geminiChat.sendMessage(content);
        aiResponse = result.response.text();
      } catch (aiError) {
        aiResponse = `Error communicating with Gemini AI: ${aiError.message}`;
      }

      chat.messages.push({ role: 'assistant', content: aiResponse });
      await chat.save();
      return res.json(chat);
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadFile = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  try {
    const data = await pdfParse(req.file.buffer);
    res.json({ extractedText: data.text });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
