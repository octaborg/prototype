import { Request, Response, NextFunction } from 'express';


interface Transaction {
    id: Number;
    amount: Number;
    sendingAccount: Number;
    receivingAccount: Number;
    kind: String;
    description: String;
    timestamp: Number;
}

interface Account {
    id: Number;
    balance: Number;
    timestamp: Number;
    transactions: [Transaction];
}

// getting all the transactions
const getTransactions = async (req: Request, res: Response, next: NextFunction) => {
    const transactions: [Transaction] = [
        {
            "id": 0,
            "amount": 12,
            "sendingAccount": 1,
            "receivingAccount": 0,
            "kind": "credit",
            "description": "salary",
            "timestamp": 0
        }
    ];
    return res.status(200).json({
        message: transactions
    });
};

// getting a single transaction
const getTransaction = async (req: Request, res: Response, next: NextFunction) => {
    let id: string = req.params.transaction;
    let transaction: Transaction = {
        "id": 0,
        "amount": 12,
        "sendingAccount": 1,
        "receivingAccount": 0,
        "kind": "credit",
        "description": "salary",
        "timestamp": 0
    };
    return res.status(200).json({
        message: transaction
    });
};

// getting all the payments
const getAccount = async (req: Request, res: Response, next: NextFunction) => {
    let id: string = req.params.account;
    const account: Account = {
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
    return res.status(200).json({
        message: account
    });
};

export default { getTransactions, getTransaction, getAccount };
