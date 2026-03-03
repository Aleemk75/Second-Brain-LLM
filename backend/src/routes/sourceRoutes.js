import express from 'express';
import {
    getSources,
    createSource,
    getSource,
    updateSource,
    deleteSource,
    understandSource,
} from '../controllers/sourceController.js';

const router = express.Router();

router.route('/').get(getSources).post(createSource);
router.route('/:id').get(getSource).put(updateSource).delete(deleteSource);
router.route('/:id/understand').post(understandSource);

export default router;
