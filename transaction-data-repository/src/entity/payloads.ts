export interface Transaction {
    id: Number;
    amount: Number;
    sendingAccount: Number;
    receivingAccount: Number;
    kind: String;
    description: String;
    timestamp: Number;
}

export interface Account {
    id: Number;
    balance: Number;
    timestamp: Number;
    transactions: [Transaction];
}
