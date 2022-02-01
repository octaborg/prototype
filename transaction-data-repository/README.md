# OCTA Prototype Data Repository

## Usage

Simply run

```
npm run dev
```

I made the protobuf message definitions using [types-as-schema](https://www.npmjs.com/package/types-as-schema)

## Random endpoint

### /api/bin

Provides random 256 bytes long hex-encoded value, along with Poseidon hash and signature.

```
http://127.0.0.1:6060/api/bin
```

responds with

```
{
    "message": "54cc77bd7314ad96ab6617782142ba82d11fa5d6932e6322362eca5714b2eb948b4160cc012628c516ab28659e52466db78cefa72aca4dc617f238fc00efaa8689755a34965b325248769f6708981739d9cf91d75aa28a692a1b80fcab1ad2ab5abc9bf4184aa85a314f1342e39156f7ab3a23cb643c3db845a441cb9e5ad8cf419eac8db574e7abe6980f58809a9b0849b632dc30e8c2269847c802ca2499e5af7b3b5715c7052d3664bc5c691caaaaab7798dd4a6ecf868e47c338a03b3ffbe60a064ef753305d8f8a53aa1474a1f0993100ff8efe3e04b4b84431a2150fee9fe2762d5f1bc07fe978ad453397375f1471975e116815d67665178d1dfda4a7",
    "poseidon": "18011909633405525238417128864866884447609945617636009721181153675656794998375",
    "signature_r": "24143027072209427246288173414089293292431194018823630685745824933625286128972",
    "signature_s": "808464688"
}
```

## Open endpoint

This endpoint reveals the confidential data. It follows specification from [4.4.1 Component: HTTPS API](https://github.com/octaborg/proposals/blob/main/OCTA-0.md#441-component-https-api)

### /api/transactions

Gives all the transactions.

```
http://127.0.0.1:6060/api/transactions
```

```
[
    {
        "id": 0,
        "amount": 12,
        "sendingAccount": 1,
        "receivingAccount": 0,
        "kind": "credit",
        "description": "salary",
        "timestamp": 0
    }
]
```

### /api/transactions/:id

Gives particular transaction.

```
http://127.0.0.1:6060/api/transactions/0
```

```
{
    "id": 0,
    "amount": 12,
    "sendingAccount": 1,
    "receivingAccount": 0,
    "kind": "credit",
    "description": "salary",
    "timestamp": 0
}
```

### /api/transactions/account/:account

Gives a statement of a particular account.

```
http://127.0.0.1:6060/api/transactions/account/0
```

```
{
    "id": 0,
    "balance": 3242,
    "timestamp": 0,
    "transactions": [
        {
            "id": 0,
            "amount": 12,
            "sendingAccount": 1,
            "receivingAccount": 0,
            "kind": "credit",
            "description": "salary",
            "timestamp": 0
        }
    ]
}
```

## Some links

1. https://protobufjs.github.io/protobuf.js/
2. https://www.section.io/engineering-education/how-to-create-a-simple-rest-api-using-typescript-and-nodejs/
