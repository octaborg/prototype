import { Request, Response, NextFunction } from 'express';

import {
    PrivateKey,
    PublicKey,
    Signature
} from 'snarkyjs';

import { AccountStatement, AccountStatementSigned } from "../entity/octa";

import OCTAModel from '../models/octa';

const getOCTAAccountStatementSigned = async (req: Request, res: Response, next: NextFunction) => {
    // get request parameters
    let id: string = req.params.account;
    // make random authority
    const private_key = PrivateKey.random();
    const public_key = private_key.toPublicKey();
    // fetch data
    const account: AccountStatement = await OCTAModel.getOCTAAccountStatement(0);
    // sign the data
    const signature: Signature = Signature.create(private_key, account.toFields());
    // construct the signed statement
    const account_signed: AccountStatementSigned = new AccountStatementSigned(
        account,
        public_key,
        signature
    );
    return res.status(200).json(account_signed.serialize());
};

const verifyOCTAAccountStatementSigned = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    const account_signed: AccountStatementSigned = AccountStatementSigned.deserialize(req.body);
    //BS.lol();
    return res.status(200).json({});
};

export default { getOCTAAccountStatementSigned, verifyOCTAAccountStatementSigned };
