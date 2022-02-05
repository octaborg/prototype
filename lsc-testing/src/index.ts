import {
  Field,
  PublicKey,
  SmartContract,
  state,
  State,
  method,
  UInt64,
  Int64,
  Mina,
  isReady,
  PrivateKey,
  Party,
  shutdown
} from 'snarkyjs';
import { AccountStatement, RequiredProof, RequiredProofs, RequiredProofType, TransactionalProof } from './octa.js';

/**
 * Loan smart contract interface
 */
export default class LSC extends SmartContract {
  @state(Field) interestRate = State<Field>();
  @state(Field) termInDays = State<Field>();
  @state(RequiredProofs) requiredProofs = State<RequiredProofs>();

  // Terms of the loan are injected at deployment. Called by the lender.
  deploy(
    loanAmount: UInt64,
    interestRate: Field,
    termInDays: Field,
    requiredProofs: RequiredProofs
  ) {
    super.deploy();
    this.balance.addInPlace(loanAmount);
    this.interestRate.set(interestRate);
    this.termInDays.set(termInDays);
    this.requiredProofs.set(requiredProofs);
  }

  // Request a loan with required proofs. Called by the borrower
  @method 
  async requestLoan(amount: UInt64, accountStatement: AccountStatement) {
    new TransactionalProof(accountStatement, await this.requiredProofs.get()).validate();

  }

  // Approve the loan for the given address. Called by the lender.
  // This would be useful when lenders optimize on the type of borrowers
  // based on the demand and other factors.
  @method 
  async approve(address: PublicKey) {
  }

  // Accept the loan for the calling address. Called by the borrower.
  @method 
  async accept() {
  }

}

// setup
async function deploy() {
  await isReady;
  const Local = Mina.LocalBlockchain();
  Mina.setActiveInstance(Local);
  const lender = Local.testAccounts[0].privateKey;
  const account2 = Local.testAccounts[1].privateKey;

  const snappPrivkey = PrivateKey.random();
  let snappAddress = snappPrivkey.toPublicKey();

  console.log('Deploying Snapp...');
  let tx = Mina.transaction(lender, async () => {
    const initialBalance = UInt64.fromNumber(1000000);
    const p = await Party.createSigned(account2);
    p.balance.subInPlace(initialBalance);
    let snapp = new LSC(snappAddress);
    snapp.deploy(initialBalance, new Field(1), new Field(365), 
    new RequiredProofs([new RequiredProof(
      RequiredProofType.avgMonthlyIncomeProof(), 
      new Int64(new Field(100000)), 
      new Int64(new Field(3000)))]));
  });
  await tx.send().wait();
}

deploy();

shutdown();
