import express from 'express';
import controller from '../controllers/transactions';
const router = express.Router();

router.get('/api/transactions', controller.getTransactions);
router.get('/api/transactions/:transaction', controller.getTransaction);
router.get('/api/transactions/account/:account', controller.getAccount);
router.get('/api/transactions/account/signed/:account', controller.getAccountSigned);

export = router;
