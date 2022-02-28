import {
    TransactionType,
    Transaction,
    AccountStatement
} from "octa-types";


import {
    Field,
    Bool,
    Int64,
    UInt64
} from 'snarkyjs';

const getOCTAAccountStatement = async (id: Number) => {
    const transactions: Transaction[] = [];
    for (let j = 0; j < 100; ++j) {
        transactions.push(
            new Transaction(
                new Field(1),
                new Int64(new Field(5000)), // TODO adjust timestamp to pass tests
                new TransactionType(
                    new Bool(true),
                    new Bool(false),
                    new Bool(false),
                    new Bool(false)
                ),
                new Int64(new Field(1))
            )
        );
    }
    const account: AccountStatement = new AccountStatement(
        new Field(1),
        new UInt64(new Field(10000)),
        new Int64(new Field(100)), // timestamp
        new Int64(new Field(100)),
        new Int64(new Field(100)),
        transactions
    );
    return account;
};

export default { getOCTAAccountStatement };
