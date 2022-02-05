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
  AsFieldElements,
  isReady,
} from 'snarkyjs';

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

export class AccountStatement {
  id: Field;
  balance: UInt64;
  timestamp: Int64;
  fromTimestamp: Int64;
  toTimestamp: Int64;
  transactions: Transaction[];
  authorityPublicKey: PublicKey;
  signature: Signature;

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
      validated = validated.and(Circuit.if(
        this.requiredProofs.requiredProofs[i].requiredProofType.equals(RequiredProofType.avgMonthlyBalanceProof()),
        this.validateAvgMonthlyBalanceProof(this.requiredProofs.requiredProofs[i]),
        new Bool(true)));

      validated = validated.and(Circuit.if(
        this.requiredProofs.requiredProofs[i].requiredProofType.equals(RequiredProofType.avgMonthlyIncomeProof()),
        this.validateAvgMonthlyIncomeProof(this.requiredProofs.requiredProofs[i]),
        new Bool(true)));
    }
    validated.assertEquals(true);
  }

  validateAvgMonthlyBalanceProof(requiredProof: RequiredProof): Bool {
    let avgMonthlyBalance = new Int64(new Field(5000)); // TODO <- calculate this
    return requiredProof.lowerBound.value.lte(avgMonthlyBalance.value)
    .and(requiredProof.upperBound.value.gt(avgMonthlyBalance.value));
  }

  validateAvgMonthlyIncomeProof(requiredProof: RequiredProof): Bool {
    let avgMonthlyIncome = new Int64(new Field(5000)); // TODO <- calculate this
    return requiredProof.lowerBound.value.lte(avgMonthlyIncome.value)
    .and(requiredProof.upperBound.value.gt(avgMonthlyIncome.value));
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

await isReady;
const MAX_REQUIRED_PROOFS = 10;
export class RequiredProofs extends CircuitValue {
  @arrayProp(RequiredProof, MAX_REQUIRED_PROOFS) requiredProofs: Array<RequiredProof>;
  
  constructor(requiredProofs: Array<RequiredProof>) {
    super();
    this.requiredProofs = requiredProofs;
  }
  
}


