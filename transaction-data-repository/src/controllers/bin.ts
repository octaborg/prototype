import { Request, Response, NextFunction } from 'express';
import { Field, Poseidon, Group, Scalar, PrivateKey, Signature } from 'snarkyjs';

import crypto from "crypto";

interface ResponseObject {
    message: String;
    poseidon: String;
    signature_r: String;
    signature_s: String;
}

const sign = (hash: Field, private_key: PrivateKey, G: Group) => {
    console.log("signing");
}

const verify = (hash: Field, signature: Field) => {
    console.log("verifying");
}


const bytesToListBool = (input: Buffer) => {
    const result: boolean[] = [];
    for (let num of input) {
        const base2: String = num.toString(2).padStart(8, '0');
        for (let i = 0; i < base2.length; i++) {
            const character = base2.charAt(i);
            if (character === "0") {
                result.push(true);
            } else {
                result.push(false);
            }
        }
    }
    return result;
}


const scalarToString = (input: Scalar) => {
    let result: String = "";
    const fields: Field[] = input.toFields();
    for (let f of fields) {
        result = result.concat(f.toString());
    }
    console.log(result)
    const buf = Buffer.from(result, "binary");
    return buf.readUInt32BE()
}


const stringToScalar = (input: String) => {
    const num: number = Number(input);
    const base2: String = num.toString(2);
    console.log(base2);
    return 0;
}


const getRandomValue = async (req: Request, res: Response, next: NextFunction) => {
    const preimage_bytes = crypto.randomBytes(256);
    const preimage_field = Field.ofBits(bytesToListBool(preimage_bytes));
    const hash = Poseidon.hash([preimage_field]);

    const private_key = PrivateKey.random();
    const public_key = private_key.toPublicKey();
    const signature = Signature.create(private_key, [hash]);
    const sss = signature.s.toFields();
    const s = scalarToString(signature.s)
    console.log(s, typeof s);
    console.log(stringToScalar(s.toString()));
    let response: ResponseObject = {
        "message": preimage_bytes.toString("hex"),
        "poseidon": hash.toString(),
        "signature_r": signature.r.toString(),
        "signature_s": s.toString()
    };
    return res.status(200).json(response);
};

export default { getRandomValue };
