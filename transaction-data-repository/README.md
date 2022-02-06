# OCTA Prototype Data Repository

## Usage

Simply run

```
npm run dev
```

I made the protobuf message definitions using [types-as-schema](https://www.npmjs.com/package/types-as-schema)

## Binary endpoint

### Producing a signature

Say we want to sign a message `22F64844A5A8703B1FCDC3794A3C46FB5DAC8DC3953D56EC0E1E582C3A421E02` which corresponds to single Field as it is 32 bytes long.

```
curl -X POST \
  http://127.0.0.1:6060/api/bin/sign \
  -H 'Content-Type: application/json' \
  -d '{
	"message": "22F64844A5A8703B1FCDC3794A3C46FB5DAC8DC3953D56EC0E1E582C3A421E02"
}'
```

responds with

```
{
    "message": "22F64844A5A8703B1FCDC3794A3C46FB5DAC8DC3953D56EC0E1E582C3A421E02",
    "public_key": {
        "g": {
            "x": "13970885179067814607154447503640693252502336289886406913311117794136382926396",
            "y": "936739053817989325499878633856848644584314074363365320244824700802831723737"
        }
    },
    "signature": {
        "s": "28152743220804432302389329541171083660313036683022934833366094078752235636711",
        "r": "23645393687493419657103339579028058596345736387992278401025980420953712797308"
    }
}
```

Messages need to be a multiple of 32 bytes in their lengths. Private key is random for each call.

### Verifying a signature

```
curl -X POST \
  http://127.0.0.1:6060/api/bin/verify \
  -H 'Content-Type: application/json' \
  -d '{
    "message": "22F64844A5A8703B1FCDC3794A3C46FB5DAC8DC3953D56EC0E1E582C3A421E02",
    "public_key": {
        "g": {
            "x": "13970885179067814607154447503640693252502336289886406913311117794136382926396",
            "y": "936739053817989325499878633856848644584314074363365320244824700802831723737"
        }
    },
    "signature": {
        "s": "28152743220804432302389329541171083660313036683022934833366094078752235636711",
        "r": "23645393687493419657103339579028058596345736387992278401025980420953712797308"
    }
}'
```

responds with

```
{
    "result": true
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
