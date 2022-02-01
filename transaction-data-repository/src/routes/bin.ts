import express from 'express';
import controller from '../controllers/bin';
const router = express.Router();

router.get('/api/bin', controller.getRandomValue);

export = router;
