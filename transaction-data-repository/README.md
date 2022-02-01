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
    "value": "18671a9bef9066a09539dd9e230c831d32c2b00dbb9a65d13918e416b697dfdc9d7322b70802168c19b407905461ca554e5893f7cd24320c2f5272fe6470240414aa980ca19e3628e7ee1d5783558e7a3b74dc74f0d858115f1fd534a4073ee7c24bb50162eef736e8712060bbd749ed8ea6b03a668e411e2e52bc87793d28569e596c8f42b7730b012eca56a359cc813b7ea85a046577a91ff3b192cd71c00958e97b6aa404a56f31ed93cead6655db3d8eb7d4e7ab7015a30ce83b9ff20af39946a1b8a146d02b94341615dd2580c1f0bacaf8086e06741c46271a3724aceee8593d4e84b46b6869592d10f84789f692b8a3720f585118d49c5f2744da3be3",
    "poseidon": "23426240289815032728324104874953352594918438062248164939641460544405593591029",
    "signature": "todo"
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
