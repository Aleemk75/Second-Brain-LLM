import express from 'express';
import { queryPublicBrain } from '../controllers/publicController.js';

const router = express.Router();

router.get('/brain/query', queryPublicBrain);

export default router;
