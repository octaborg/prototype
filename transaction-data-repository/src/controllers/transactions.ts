import { Request, Response, NextFunction } from 'express';
import { PrivateKey } from 'snarkyjs';

import { Account, Transaction, AccountDecoded, AccountDecodedFlattened, AccountEncoded } from '../entity/payloads';
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

const getAccountSigned = async (req: Request, res: Response, next: NextFunction) => {
    let id: string = req.params.account;
    const account: Account = await TransactionsModel.getDataAccount(0);
    const account_decoded: AccountDecoded = account.toDecoded();
    const account_decoded_flattened: AccountDecodedFlattened = AccountDecodedFlattened.fromAccountDecoded(account_decoded);
    const private_key = PrivateKey.random();
    account_decoded_flattened.sign(private_key);
    const account_encoded_signed: AccountEncoded = account_decoded_flattened.toAccountEncoded();
    return res.status(200).json(account_encoded_signed);
};

export default { getTransactions, getTransaction, getAccount, getAccountSigned };
