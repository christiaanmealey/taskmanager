import express from 'express';
import { 
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    updateProjectStage,
    deleteProject, 
    createProjectStage
} from '../controllers/projectController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, fetchProjects);
router.get('/:id', protect, fetchProject);

router.post('/', protect, createProject);
router.post('/stage/:id', protect, createProjectStage);
router.put('/:id', protect, updateProject);
router.put('/stage/:id', protect, updateProjectStage);
router.delete('/:id', protect, deleteProject);

export default router;