import express from 'express';
import controller from '../controllers/octa';
const router = express.Router();

router.get('/api/statement/sign/:account', controller.getOCTAAccountStatementSigned);
router.post('/api/statement/verify', controller.verifyOCTAAccountStatementSigned);

export default router;
