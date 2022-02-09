import { Field, Group, Scalar, Signature, PublicKey, Bool } from 'snarkyjs';

export const bytesToListBool = (input: Buffer) => {
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

export const listFieldsToHex = (input: Field[]) => {
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

export const hexToListFields = (input: String) => {
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

export class SignatureWrapper extends Signature {
    constructor(r: Field | null, s: Scalar | null) {
        if (r !== null && s !== null) {
            super(r, s);
        }
    }
}

export class GroupWrapper extends Group {
    constructor(x: Field | null, y: Field | null) {
        if (x !== null && y !== null) {
            super(x, y);
        }
    }
}
