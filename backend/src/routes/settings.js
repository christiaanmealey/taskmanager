import express from 'express';
import { 
    fetchSetting, 
    fetchSettings,
    createSetting,
    updateSetting,
    deleteSetting 
} from '../controllers/settingsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, fetchSettings);
router.get('/:type', protect, fetchSetting);

router.post('/', protect, createSetting);
router.put('/:id', protect, updateSetting);
router.delete('/:id', protect, deleteSetting);

export default router;