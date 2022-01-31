import { Request, Response, NextFunction } from 'express';

import { Account, Transaction } from '../models/transactions';
import TransactionsModel from '../models/transactions';

// getting all the transactions
const getTransactions = async (req: Request, res: Response, next: NextFunction) => {
    const transactions: [Transaction] = await TransactionsModel.getDataTransactions()
    return res.status(200).json(transactions);
};

// getting a single transaction
const getTransaction = async (req: Request, res: Response, next: NextFunction) => {
    let id: string = req.params.transaction;
    let transaction: Transaction = await TransactionsModel.getDataTransaction(0);
    return res.status(200).json(transaction);
};

// getting all the payments
const getAccount = async (req: Request, res: Response, next: NextFunction) => {
    let id: string = req.params.account;
    const account: Account = await TransactionsModel.getDataAccount(0);
    return res.status(200).json(account);
};

export default { getTransactions, getTransaction, getAccount };
