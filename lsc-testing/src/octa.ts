import {
  Field,
  PublicKey,
  UInt64,
  CircuitValue,
  prop,
  Bool,
  Int64,
  Signature,
  Circuit,
  arrayProp,
  isReady,
} from 'snarkyjs';

import {endOfMonth, startOfMonth, subMonths} from 'date-fns';

await isReady;

// This is an enum written as a class, is there a way to just define an enum in a
// Snarky compatible way?
export class TransactionType extends CircuitValue {
  @prop purchase: Bool;
  @prop deposit: Bool;
  @prop transferIn: Bool;
  @prop transaferOut: Bool;

  constructor(
    purchase: Bool,
    deposit: Bool,
    transferIn: Bool,
    transaferOut: Bool
  ) {
    super();
    this.purchase = purchase;
    this.deposit = deposit;
    this.transferIn = transferIn;
    this.transaferOut = transaferOut;
  }

  isIncome() : Bool {
    return this.deposit.or(this.transferIn);
  }

}

export class Transaction extends CircuitValue {
  @prop id: Field;
  @prop amount: Int64;
  @prop transactionType: TransactionType;
  @prop timestamp: Int64;


  constructor(
    id: Field,
    amount: Int64,
    transactionType: TransactionType,
    timestamp: Int64
  ) {
    super();
    this.id = id
    this.amount = amount
    this.transactionType = transactionType
    this.timestamp = timestamp
  }

}

export class AccountStatement extends CircuitValue {
  @prop id: Field;
  @prop balance: UInt64;
  @prop timestamp: Int64;
  @prop fromTimestamp: Int64;
  @prop toTimestamp: Int64;
  @arrayProp(Transaction, 100) transactions: Transaction[];
  @prop authorityPublicKey: PublicKey;
  @prop signature: Signature;

  constructor(
    id: Field,
    balance: UInt64,
    timestamp: Int64,
    from: Int64,
    to: Int64,
    transactions: Array<Transaction>,
    authorityPublicKey: PublicKey,
    signature: Signature
  ) {
    super();
    this.id = id;
    this.balance = balance;
    this.timestamp = timestamp;
    this.fromTimestamp = from;
    this.toTimestamp = to;
    this.transactions = transactions;
    this.authorityPublicKey = authorityPublicKey;
    this.signature = signature;
  }

  verifySignature() {
    // TODO
  }

}

export class TransactionalProof {
  account: AccountStatement;
  requiredProofs: RequiredProofs;

  constructor(account: AccountStatement, requiredProofs: RequiredProofs) {
    this.account = account;
    this.requiredProofs = requiredProofs;
  }

  validate() {
    this.account.verifySignature();
    // TODO prevent same proof from being calculated multiple times
    let validated = new Bool(true);
    for (let i = 0; i < this.requiredProofs.requiredProofs.length; i++) {
      validated = 
      validated.and(Circuit.if(
        this.requiredProofs.requiredProofs[i].requiredProofType.equals(RequiredProofType.avgMonthlyBalanceProof()),
        this.validateAvgMonthlyBalanceProof(this.requiredProofs.requiredProofs[i]),
        new Bool(true))) 
        && 
      validated.and(Circuit.if(
        this.requiredProofs.requiredProofs[i].requiredProofType.equals(RequiredProofType.avgMonthlyIncomeProof()),
        this.validateAvgMonthlyIncomeProof(this.requiredProofs.requiredProofs[i]),
        new Bool(true)));
        // && // other proof validations ....
    }
    validated.assertEquals(true);
  }

  validateAvgMonthlyBalanceProof(requiredProof: RequiredProof): Bool {
    let avgMonthlyBalance = new Int64(new Field(5000)); // TODO <- calculate this
    return requiredProof.lowerBound.value.lte(avgMonthlyBalance.value)
    .and(requiredProof.upperBound.value.gt(avgMonthlyBalance.value));
  }

  validateAvgMonthlyIncomeProof(requiredProof: RequiredProof): Bool {
    // calculate the average monthly income for the past 3 months
    const numMonthsToTakeIntoAccount = 3;
    let startOfMonths : Field[] = []; // starts of months to take into account in reverse chronological order.
    const today = new Date();
    for (let i = 0; i <= numMonthsToTakeIntoAccount; i++) {
      startOfMonths.push(new Field(startOfMonth(subMonths(today, i)).getTime()));
    }
    // calculate the avg income (Monthly incomes are calculated for later use)
    let monthlyIncomes = new Map<Field, Field>();
    let totalIncome = new Int64(Field.zero);
    for (let i = 0; i < this.account.transactions.length; i++) {
      let tx = this.account.transactions[i];
      for (let j = startOfMonths.length - 1; j > 0; j--) {
        totalIncome = Circuit.if(startOfMonths[j]
          .gte(tx.timestamp.value)
          .and(startOfMonths[j - 1].lt(tx.timestamp.value)).and(tx.transactionType.isIncome()), 
          this.updateIncome(totalIncome, startOfMonths[j - 1], monthlyIncomes, tx), totalIncome);
      }
    }

    let avgMonthlyIncome = new Int64(totalIncome.value.div(numMonthsToTakeIntoAccount)); 
    // Compare the aggregate amount instead of the divided value.
    // TODO does not work
    //let avgMonthlyIncome = new Int64(new Field(1500)); // Dummy value to make the tests past

    console.log(totalIncome, avgMonthlyIncome);
    return requiredProof.lowerBound.value.lte(avgMonthlyIncome.value)
    .and(requiredProof.upperBound.value.gt(avgMonthlyIncome.value));
  }


  updateIncome(totalIncome: Int64, month: Field, monthlyIncomes: Map<Field, Field>, tx: Transaction): Int64 {
    let previous = monthlyIncomes.get(month);
    if (previous == null) {
      monthlyIncomes.set(month, tx.amount.value);
    } else {
      monthlyIncomes.set(month, previous.add(tx.amount.value));
    }
    return totalIncome.add(tx.amount);
  }

}

// This is an enum written as a class, is there a way to just define an enum in a
// Snarky compatible way?
export class RequiredProofType extends CircuitValue {
  // Calculated based on the amount of incoming 
  // transactions over the past 3 months
  @prop avgMonthlyIncomeProof: Bool;

  // Calculated based on the end of month balance 
  // for the past 3 months
  @prop avgMonthlyBalanceProof: Bool;

  private constructor(
    avgMonthlyIncomeProof: Bool,
    avgMonthlyBalanceProof: Bool
  ) {
    super();
    this.avgMonthlyBalanceProof = avgMonthlyBalanceProof;
    this.avgMonthlyIncomeProof = avgMonthlyIncomeProof;
  }

  static avgMonthlyIncomeProof(): RequiredProofType {
    return new RequiredProofType(new Bool(true), new Bool(false));
  }

  static avgMonthlyBalanceProof(): RequiredProofType {
    return new RequiredProofType(new Bool(false), new Bool(true));
  }
}

export class RequiredProof extends CircuitValue  {
  // TODO can be encoded in a better way with a binary encoding
  @prop requiredProofType: RequiredProofType;
  @prop upperBound: Int64;
  @prop lowerBound: Int64;

  constructor(
    requiredProofType: RequiredProofType,
    upperBound: Int64,
    lowerBound: Int64) {
    super();
    this.requiredProofType = requiredProofType;
    this.upperBound = upperBound;
    this.lowerBound = lowerBound;
  }

}

const MAX_REQUIRED_PROOFS = 10;
export class RequiredProofs extends CircuitValue {
  @arrayProp(RequiredProof, MAX_REQUIRED_PROOFS) requiredProofs: Array<RequiredProof>;
  
  constructor(requiredProofs: Array<RequiredProof>) {
    super();
    this.requiredProofs = requiredProofs;
  }
  
}