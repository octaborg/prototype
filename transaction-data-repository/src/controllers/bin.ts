import { Request, Response, NextFunction } from 'express';
import { Bool, Field, Poseidon, Group, Scalar, PrivateKey, PublicKey, Signature } from 'snarkyjs';
import { bytesToListBool, listFieldsToHex, hexToListFields, SignatureWrapper, GroupWrapper } from '../helpers/bin';

import crypto from "crypto";

interface ResponseSignature {
    s: String,
    r: String
}

interface ResponseObject {
    message: String;
    poseidon: String;
    signature: ResponseSignature;
}

const getRandomValue = async (req: Request, res: Response, next: NextFunction) => {
    const f1 = Field.random();
    const f2 = Field.random();
    const f3 = Field.random();
    const preimage = [f1, f2, f3];
    const ashex = listFieldsToHex(preimage);
    const hash = Poseidon.hash(preimage);
    const private_key = PrivateKey.random();
    const public_key = private_key.toPublicKey();
    const signature = Signature.create(private_key, [hash]);
    let response: ResponseObject = {
        "message": ashex,
        "poseidon": hash.toString(),
        "signature": {
            "s": String(signature.s.toJSON()),
            "r": String(signature.r.toJSON()),
        }
    };
    return res.status(200).json(response);
};

const signPayload = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    const hex_message: String = req.body.message;
    const message: Field[] = hexToListFields(hex_message);
    // random key
    const private_key = PrivateKey.random();
    const public_key = private_key.toPublicKey();
    const signature = Signature.create(private_key, message);
    // prepare the response
    return res.status(200).json({
        "message": hex_message.toString(),
        "public_key": public_key.toJSON(),
        "signature": {
            "s": String(signature.s.toJSON()),
            "r": String(signature.r.toJSON())
        }
    });
};

const verifyPayloadSignature = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    const hex_message: String = req.body.message;
    const hex_x: String = req.body.public_key.g.x;
    const hex_y: String = req.body.public_key.g.y;
    const hex_r: String = req.body.signature.r;
    const hex_s: String = req.body.signature.s;
    const message: Field[] = hexToListFields(hex_message);
    const x: Field | null = Field.fromJSON(hex_x.toString());
    const y: Field | null = Field.fromJSON(hex_y.toString());
    const g: GroupWrapper = new GroupWrapper(x, y)
    const public_key: PublicKey = new PublicKey(g);
    const r: Field | null = Field.fromJSON(hex_r.toString());
    const s: Scalar | null = Scalar.fromJSON(hex_s.toString());
    const signature: SignatureWrapper = new SignatureWrapper(r, s);
    const is_valid: Bool = signature.verify(public_key, message);
    return res.status(200).json({
        "result": is_valid.toBoolean()
    });
};

export default { getRandomValue, signPayload, verifyPayloadSignature };
