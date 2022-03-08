import axios from 'axios';

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

import { AccountStatement, castScalar, castJSONValue } from "octa-types";

function castStringList(s: string | string[]): string {
    if (typeof(s) === "string") {
        return s;
    }
    return s[0];
}

function getAccountStatementAndSignature(data: string[], dr: string, ds: string, dx: string, dy: string) {
    let payload: Field[] = [];
    for (let j = 0; j < data.length; j++) {
        const val: Field = new Field(data[j]);
        payload.push(val);
    }
    const x: Field = new Field(castStringList(dx));
    const y: Field = new Field(castStringList(dy));
    const g: Group = new Group(x, y);
    const r: Field = new Field(castStringList(dr));
    const s: Scalar = castScalar(Scalar.fromJSON(ds));
    const signature: Signature = new Signature(r, s);
    const authorityPublicKey: PublicKey = new PublicKey(g);
    const account: AccountStatement = AccountStatement.deserialize(payload);
    return { account, signature, authorityPublicKey };
}

const url: string = 'http://127.0.0.1:6060/api/statement/sign/';
try {
    const response = await axios.get(url);
    console.log("\n\nResponse payload and headers");
    console.log(response.data);
    console.log(response.headers);
    const data: string[] = response.data;
    const r: string = response.headers.r;
    const s: string = response.headers.s;
    const x: string = response.headers.x;
    const y: string = response.headers.y;
    // you may extract account statement, signature and public key as follows
    const  { account, signature, authorityPublicKey } = getAccountStatementAndSignature(data, r, s, x, y);
    // and verify
    const is_valid: Bool = account.verifySignature(authorityPublicKey, signature);
    console.log("\n\nis response signature valid?");
    console.log(is_valid.toBoolean());
} catch (exception) {
    process.stderr.write(`ERROR received from ${url}: ${exception}\n`);
}
