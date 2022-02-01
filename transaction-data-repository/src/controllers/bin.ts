import { Request, Response, NextFunction } from 'express';
import { Field, Poseidon } from 'snarkyjs';

import crypto from "crypto";

interface ResponseObject {
    value: String;
    poseidon: String;
    signature: String;
}

const bytesToListBool = (input: Buffer) => {
    let result: boolean[] = [];
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

const getRandomValue = async (req: Request, res: Response, next: NextFunction) => {
    const preimage_bytes = crypto.randomBytes(256);
    const preimage_field = Field.ofBits(bytesToListBool(preimage_bytes));
    const hash = Poseidon.hash([preimage_field]);
    let response: ResponseObject = {
        "value": preimage_bytes.toString("hex"),
        "poseidon": hash.toString(),
        "signature": "todo"
    };
    return res.status(200).json(response);
};

export default { getRandomValue };
