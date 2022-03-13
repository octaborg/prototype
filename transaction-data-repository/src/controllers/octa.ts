import { Request, Response, NextFunction } from 'express';

import {
    Field,
    Bool,
    Scalar,
    Group,
    PrivateKey,
    PublicKey,
    Signature,
    JSONValue
} from 'snarkyjs';

import config from '../config';

const { authorityPrivateKeyString } = config;

import { AccountStatement, castScalar, castJSONValue } from "octa-types";

import OCTAModel from '../models/octa';

function castStringList(s: string | string[]): string {
    if (typeof(s) === "string") {
        return s;
    }
    return s[0];
}

const getOCTAAccountStatementSigned = async (req: Request, res: Response, next: NextFunction) => {
    // get request parameters
    let id: string = req.params.account;
    // make random authority
    const secret: Scalar = castScalar(Scalar.fromJSON(authorityPrivateKeyString));
    const authorityPrivateKey = new PrivateKey(secret);
    const authorityPublicKey = authorityPrivateKey.toPublicKey();
    // fetch data
    const account: AccountStatement = await OCTAModel.getOCTAAccountStatement(0);
    // sign the data
    const signature: Signature = account.sign(authorityPrivateKey);
    // prepare the response and headers
    const x: Field = authorityPublicKey.g.x;
    const y: Field = authorityPublicKey.g.y;
    const r: Field = signature.r;
    const s: JSONValue = castJSONValue(signature.s.toJSON());
    res.setHeader('r', r.toString());
    res.setHeader('s', s.toString());
    res.setHeader('x', x.toString());
    res.setHeader('y', y.toString());
    console.log(res.getHeaders());
    return res.status(200).json(account.serialize());
};

const verifyOCTAAccountStatementSigned = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let payload: Field[] = [];
        for (let j = 0; j < req.body.length; j++) {
            const val: Field = new Field(req.body[j]);
            payload.push(val);
        }
        const x: Field = new Field(castStringList(req.headers.x));
        const y: Field = new Field(castStringList(req.headers.y));
        const g: Group = new Group(x, y);
        const r: Field = new Field(castStringList(req.headers.r));
        const s: Scalar = castScalar(Scalar.fromJSON(req.headers.s));
        const signature: Signature = new Signature(r, s);
        const authorityPublicKey: PublicKey = new PublicKey(g);
        const account: AccountStatement = AccountStatement.deserialize(payload);
        const is_valid: Bool = account.verifySignature(authorityPublicKey, signature);
        return res.status(200).json(is_valid.toBoolean());
    } catch (ex) {
        // 422 - unprocessable entity - https://www.bennadel.com/blog/2434-http-status-codes-for-invalid-data-400-vs-422.htm
        return res.status(422).json({})
    }
};

export default { getOCTAAccountStatementSigned, verifyOCTAAccountStatementSigned };
