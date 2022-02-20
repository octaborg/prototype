import express from 'express';
import controller from '../controllers/bin';
const router = express.Router();

router.get('/api/bin', controller.getRandomValue);
router.post('/api/bin/sign', controller.signPayload);
router.post('/api/bin/verify', controller.verifyPayloadSignature);

export default router;
