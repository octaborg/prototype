import { Account, Transaction } from '../entity/payloads';

const getDataTransactions = async () => {
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
    return transactions;
};

const getDataTransaction = async (id: Number) => {
    const transaction: Transaction = {
        "id": 0,
        "amount": 12,
        "sendingAccount": 1,
        "receivingAccount": 0,
        "kind": "credit",
        "description": "salary",
        "timestamp": 0
    };
    return transaction;
};

const getDataAccount = async (id: Number) => {
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
    return account;
};

export default { getDataTransactions, getDataTransaction, getDataAccount };