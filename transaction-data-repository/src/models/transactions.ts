import { Account, Transaction } from '../entity/payloads';

const getDataTransactions = async () => {
    const transactions: [Transaction] = [
        Transaction.fromObject({
            "id": 0,
            "amount": 12,
            "transactionType": "deposit",
            "timestamp": 0
        })
    ];
    return transactions;
};

const getDataTransaction = async (id: Number) => {
    const transaction: Transaction = Transaction.fromObject({
        "id": 0,
        "amount": 12,
        "transactionType": "deposit",
        "timestamp": 0
    });
    return transaction;
};

const getDataAccount = async (id: Number) => {
    const account: Account = Account.fromObject({
        "id": 0,
        "balance": 3242,
        "timestamp": 0,
        "fromTimestamp": 0,
        "toTimestamp": 0,
        "transactions": [
            Transaction.fromObject({
                "id": 0,
                "amount": 12,
                "transactionType": "deposit",
                "timestamp": 0
            })
        ]
    });
    return account;
};

export default { getDataTransactions, getDataTransaction, getDataAccount };
