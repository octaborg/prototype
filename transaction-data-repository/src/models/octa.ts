import { Bool, Signature, UInt64, PrivateKey, Int64, Field, isReady, shutdown, Circuit, JSONValue } from "snarkyjs";

import {
    AccountStatement,
    AccountStatementSigned,
    RequiredProofs,
    Transaction,
    TransactionalProof,
    TransactionType,
    RequiredProof,
    RequiredProofType
} from "../entity/octa";

const getOCTATransactions = async () => {
    const transactions: [Transaction] = [
        new Transaction(
            new Field(1),
            new Int64(new Field(5000)), // TODO adjust timestamp to pass tests
            new TransactionType(
                new Bool(true),
                new Bool(false),
                new Bool(false),
                new Bool(false)
            ),
            new Int64(new Field(0)))
    ];
    return transactions;
};

const getOCTATransaction = async (id: Number) => {
    const transaction: Transaction = new Transaction(
        new Field(1),
        new Int64(new Field(5000)), // TODO adjust timestamp to pass tests
        new TransactionType(
            new Bool(true),
            new Bool(false),
            new Bool(false),
            new Bool(false)
        ),
        new Int64(new Field(0)))
    return transaction;
};

function castString(f: JSONValue | null): JSONValue {
    if (f === null) {
        console.log("throwing error");
        throw Error();
    }
    return f;
}

const getOCTAAccountStatement = async (id: Number) => {
    const inp: JSONValue = (new Field(0)).toJSON();
    console.log(typeof(inp));
    try {
        const v: Field | null = Field.fromJSON((new Field(0)).toJSON());
    } catch (err) {
        console.log(err);
    }
    console.log("lol");
    /*
    if (v === null) {
        console.log('is null');
    } else {
        console.log('is not null');
    }*/
    const account: AccountStatement = new AccountStatement(
        new Field(0),
        new UInt64(new Field(10000)),
        new Int64(new Field(100)), // timestamp
        new Int64(new Field(100)),
        new Int64(new Field(100)),
        [new Transaction(
            new Field(1),
            new Int64(new Field(5000)), // TODO adjust timestamp to pass tests
            new TransactionType(
                new Bool(true),
                new Bool(false),
                new Bool(false),
                new Bool(false)
            ),
            new Int64(new Field(0)))
        ]);
    return account;
};

export default { getOCTATransactions, getOCTATransaction, getOCTAAccountStatement };
