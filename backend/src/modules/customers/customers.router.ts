import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { authenticate } from '@/middleware/auth.middleware';
import * as controller from './customers.controller';

const upload = multer({
  dest: path.join(process.cwd(), 'uploads', 'customers'),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
});

const router = Router();

// All customer routes require authentication
router.use(authenticate);

router.get('/', controller.list);
router.post('/', controller.create);
router.get('/:id', controller.get);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

router.get('/:id/notes', controller.listNotes);
router.post('/:id/notes', controller.addNote);

router.get('/:id/files', controller.listFiles);
router.post('/:id/files', upload.single('file'), controller.uploadFile);
router.delete('/:id/files/:fileId', controller.deleteFile);

router.get('/:id/timeline', controller.listTimeline);

export default router;
