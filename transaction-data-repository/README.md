# OCTA Prototype Data Repository

## Usage

Simply run

```
npm run dev
```

I made the protobuf message definitions using [types-as-schema](https://www.npmjs.com/package/types-as-schema)

generate a secret identity

```
npm run identity
```

### Producing a signature

```
curl -X GET \
  http://127.0.0.1:6060/api/statement/sign/
```

Check headers for `s`, `r`, `x` and `y`.

### Verifying signature

```
curl -X POST \
  http://127.0.0.1:6060/api/statement/verify/ \
  -H 'r: 23382549827258807343441558431627357150506254847627513526700232018278276868392' \
  -H 's: 3731716699735328896172642992264607850758985845616052018809193997510176013263' \
  -H 'x: 6593512490016519641306090621328677970727886495409708517080412864571159483879' \
  -H 'y: 18389716606550903690263888571357944305390865801207581155180775587471033510853' \
  -d '<payload here>'
```

### Example OCTA application reaching the repository

```typescript
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

const url: string = 'http://127.0.0.1:6060/api/statement/sign/0';
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
```

you may run it as follows

```sh
node --loader ts-node/esm ./try_request.ts 
```

from the root of this repo!

## Some links

1. https://protobufjs.github.io/protobuf.js/
2. https://www.section.io/engineering-education/how-to-create-a-simple-rest-api-using-typescript-and-nodejs/
