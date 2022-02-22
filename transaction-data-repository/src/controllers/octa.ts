import { Request, Response, NextFunction } from 'express';

import {
    PrivateKey,
    PublicKey,
    Signature
} from 'snarkyjs';

import { AccountStatement } from "octa-types";

import OCTAModel from '../models/octa';

const getOCTAAccountStatementSigned = async (req: Request, res: Response, next: NextFunction) => {
    // get request parameters
    let id: string = req.params.account;
    // make random authority
    const authorityPrivateKey = PrivateKey.random();
    const authorityPublicKey = authorityPrivateKey.toPublicKey();
    // fetch data
    const account: AccountStatement = await OCTAModel.getOCTAAccountStatement(0);
    // sign the data
    // uncomment the following line to see some magic
    // const signature: Signature = account.sign(authorityPrivateKey);
    /*
    // construct the signed statement
    const account_signed: AccountStatementSigned = new AccountStatementSigned(
        account,
        public_key,
        signature
    );
    return res.status(200).json(account_signed.serialize());
    */
    return res.status(200).json({});
};

const verifyOCTAAccountStatementSigned = async (req: Request, res: Response, next: NextFunction) => {
    // const account_signed: AccountStatementSigned = AccountStatementSigned.deserialize(req.body);
    return res.status(200).json({});
};

export default { getOCTAAccountStatementSigned, verifyOCTAAccountStatementSigned };
