# OCTA Prototype Data Repository

## Usage

Simply run

```
npm run dev
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
