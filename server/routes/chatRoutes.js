import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/authMiddleware.js';
import { getChats, createChat, addMessage, deleteChat, renameChat, uploadFile } from '../controllers/chatController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(protect);

router.route('/').get(getChats).post(createChat);
router.route('/:id').delete(deleteChat).put(renameChat);
router.post('/message', addMessage);
router.post('/upload', upload.single('file'), uploadFile);

export default router;
