import { Request, Response, NextFunction } from 'express';
import { Bool, Field, Poseidon, Group, Scalar, PrivateKey, Signature } from 'snarkyjs';

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

const listFieldsToHex = (input: Field[]) => {
    let finalhex: string = "";
    for (let j = 0; j < input.length; j++) {
        const asfield = input[j];
        const asbits = asfield.toBits();
        let as_string = "";
        for (let i = 0; i < asbits.length; i++) {
            if (!asbits[i].toBoolean()) {
                as_string += "0";
            } else {
                as_string += "1";
            }
        }
        const asint = parseInt(as_string, 2);
        const ashex = asint.toString(16);
        finalhex = finalhex + ashex;
    }
    return String(finalhex);
}

const hexToListFields = (input: String) => {
    const length = input.length;
    const end = length/32;
    const fields: Field[] = []
    for (let j = 0; j < end; j++) {
        const val = input.substring(32*j, 32*(j+1));
        const asint = parseInt(val, 16);
        const asbitstring = asint.toString(2);
        const bits: boolean[] = [];
        for (let i = 0; i < asbitstring.length; i++) {
            const character = asbitstring.charAt(i);
            if (character === "0") {
                bits.push(false);
            } else {
                bits.push(true);
            }
        }
        const asfield = Field.ofBits(bits);
        fields.push(asfield);
    }
    return fields;
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

export default { getRandomValue };
