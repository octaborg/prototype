import { Bool, Int64, UInt64, Field, Group, PrivateKey, PublicKey, Signature, Poseidon, JSONValue } from 'snarkyjs';

import { listFieldsToHex, hexToListFields } from '../helpers/bin';

/* OCTA data types encoded */

export interface SignatureEncoded {
    s: String,
    r: String
}

export interface AccountEncoded {
    payload: String[];
    hash: String;
    authorityPublicKey: JSONValue;
    signature: SignatureEncoded | null;
}

/* OCTA data types decoded */

export interface TransactionTypeDecoded {
    purchase: Bool;
    deposit: Bool;
    transferIn: Bool;
    transferOut: Bool;
}

export class TransactionDecoded {
    id: Field;
    amount: Int64;
    transactionType: TransactionTypeDecoded;
    timestamp: Int64;

    constructor (
        id: Field,
        amount: Int64,
        transactionType: TransactionTypeDecoded,
        timestamp: Int64,
    ) {
        this.id = id;
        this.amount = amount;
        this.transactionType = transactionType;
        this.timestamp = timestamp;
    }

    toFields(): Field[] {
        return [
            this.id,
            this.amount.value,
            this.transactionType.purchase.toField(),
            this.transactionType.deposit.toField(),
            this.transactionType.transferIn.toField(),
            this.transactionType.transferOut.toField(),
            this.timestamp.value];
    }

    static fromFields(arr: Field[]): TransactionDecoded {
        const id: Field = arr[0];
        const amount: Int64 = new Int64(arr[1]);
        const transactionType: TransactionTypeDecoded = {
            purchase: Bool.Unsafe.ofField(arr[2]),
            deposit: Bool.Unsafe.ofField(arr[3]),
            transferIn: Bool.Unsafe.ofField(arr[4]),
            transferOut: Bool.Unsafe.ofField(arr[5])
        };
        const timestamp: Int64 = new Int64(arr[6]);
        return new TransactionDecoded(id, amount, transactionType, timestamp);
    }
}

export class AccountDecoded {
    id: Field;
    balance: UInt64;
    timestamp: Int64;
    fromTimestamp: Int64;
    toTimestamp: Int64;
    transactions: TransactionDecoded[];

    constructor (
        id: Field,
        balance: UInt64,
        timestamp: Int64,
        fromTimestamp: Int64,
        toTimestamp: Int64,
        transactions: TransactionDecoded[],
    ) {
        this.id = id;
        this.balance = balance;
        this.timestamp = timestamp;
        this.fromTimestamp = fromTimestamp;
        this.toTimestamp = toTimestamp;
        this.transactions = transactions;
    }

    toFields(): Field[] {
        let data: Field[] = [
            this.id,
            this.balance.value,
            this.timestamp.value,
            this.fromTimestamp.value,
            this.toTimestamp.value
        ]
        for (let i = 0; i < this.transactions.length; ++i) {
            const transaction: Field[] = this.transactions[i].toFields();
            data = data.concat(transaction);
        }
        return data;
    }

    static fromFields(arr: Field[]): AccountDecoded {
        const id: Field = arr[0];
        const balance: UInt64 = new UInt64(arr[1]);
        const timestamp: Int64 = new Int64(arr[2]);
        const fromTimestamp: Int64 = new Int64(arr[3]);
        const toTimestamp: Int64 = new Int64(arr[4]);
        const transactions: TransactionDecoded[] = [];
        for (let j = 5; j < arr.length; j = j+7) {
            const sub_arr: Field[] = arr.slice(j, j+7);
            const transaction: TransactionDecoded = TransactionDecoded.fromFields(sub_arr);
            transactions.push(transaction);
        }
        return new AccountDecoded(id, balance, timestamp, fromTimestamp, toTimestamp, transactions);
    }
}

export class AccountDecodedFlattened {
    payload: Field[];
    hash: Field;
    authorityPublicKey?: PublicKey;
    signature?: Signature;

    constructor (
        payload: Field[],
        hash: Field,
        authorityPublicKey?: PublicKey,
        signature?: Signature
    ) {
        this.payload = payload;
        this.hash = hash;
        if (typeof authorityPublicKey !== 'undefined' && typeof signature !== 'undefined') {
            this.authorityPublicKey = authorityPublicKey;
            this.signature = signature;
        }
    }

    sign(private_key: PrivateKey) {
        this.authorityPublicKey = private_key.toPublicKey();
        this.signature = Signature.create(private_key, [this.hash]);
    }

    toAccountEncoded(): AccountEncoded {
        const payload: String[] = [];
        for (let i = 0; i < this.payload.length; i++) {
            payload.push(listFieldsToHex([this.payload[i]]));
        }
        const hash: String = listFieldsToHex([this.hash]);

        if (typeof this.authorityPublicKey === 'undefined' || typeof this.signature === 'undefined') {
            return {
                payload: payload,
                hash: hash,
                authorityPublicKey: null,
                signature: null
            }
        }
        const authorityPublicKey: JSONValue = this.authorityPublicKey.toJSON();
        const r: String = String(this.signature.r.toJSON())
        const s: String = String(this.signature.s.toJSON())
        const signature: SignatureEncoded = {
            s: s,
            r: r
        };
        return {
            payload: payload,
            hash: hash,
            authorityPublicKey: authorityPublicKey,
            signature: signature
        }
    }

    static fromAccountDecoded(account: AccountDecoded): AccountDecodedFlattened {
        const payload: Field[] = account.toFields();
        const hash: Field = Poseidon.hash(payload);
        return new AccountDecodedFlattened(payload, hash);
    }
}

/* human-readable payloads */

export interface TransactionInterface {
    id: Number;
    amount: Number;
    transactionType: String;
    timestamp: Number;
}

export class Transaction {
    id: Number;
    amount: Number;
    transactionType: String;
    timestamp: Number;

    constructor (
        id: Number,
        amount: Number,
        transactionType: String,
        timestamp: Number,
    ) {
        this.id = id;
        this.amount = amount;
        this.transactionType = transactionType;
        this.timestamp = timestamp;
    }

    static fromObject(obj: TransactionInterface) {
        return new Transaction(
            obj.id, obj.amount, obj.transactionType, obj.timestamp);
    }

    toDecoded(): TransactionDecoded {
        const id: Field = new Field(this.id.valueOf());
        const amount: Int64 = new Int64(new Field(this.amount.valueOf()))
        const transactionType: TransactionTypeDecoded = {
            purchase: Bool(false),
            deposit: Bool(false),
            transferIn: Bool(false),
            transferOut: Bool(false),
        }
        switch (this.transactionType) {
            case "purchase":
                transactionType.purchase = Bool(true); break;
            case "deposit":
                transactionType.deposit = Bool(true); break;
            case "transferIn":
                transactionType.transferIn = Bool(true); break;
            case "transferOut":
                transactionType.transferOut = Bool(true); break;
        }
        const timestamp: Int64 = new Int64(new Field(this.timestamp.valueOf()));
        return new TransactionDecoded(id, amount, transactionType, timestamp);
    }
}

export interface AccountInterface {
    id: Number;
    balance: Number;
    timestamp: Number;
    fromTimestamp: Number;
    toTimestamp: Number;
    transactions: Transaction[];
}

export class Account {
    id: Number;
    balance: Number;
    timestamp: Number;
    fromTimestamp: Number;
    toTimestamp: Number;
    transactions: Transaction[];

    constructor (
        id: Number,
        balance: Number,
        timestamp: Number,
        fromTimestamp: Number,
        toTimestamp: Number,
        transactions: Transaction[]
    ) {
        this.id = id;
        this.balance = balance;
        this.timestamp = timestamp;
        this.fromTimestamp = fromTimestamp;
        this.toTimestamp = toTimestamp;
        this.transactions = transactions;
    }

    static fromObject(obj: AccountInterface) {
        return new Account(
            obj.id, obj.balance, obj.timestamp, obj.fromTimestamp, obj.toTimestamp, obj.transactions);
    }

    toDecoded(): AccountDecoded {
        const id: Field = new Field(this.id.valueOf());
        const balance: UInt64 = new UInt64(Field(this.balance.valueOf()));
        const timestamp: Int64 = new Int64(Field(this.timestamp.valueOf()));
        const fromTimestamp: Int64 = new Int64(Field(this.fromTimestamp.valueOf()));
        const toTimestamp: Int64 = new Int64(Field(this.toTimestamp.valueOf()));
        const transactions: TransactionDecoded[] = [];
        for (let i=0; i<this.transactions.length; i++) {
            transactions.push(this.transactions[i].toDecoded());
        }
        return new AccountDecoded(id, balance, timestamp, fromTimestamp, toTimestamp, transactions);
    }
}
