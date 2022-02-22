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
  shutdown,
  Bool,
  Signature
} from 'snarkyjs';
import { AccountStatement, RequiredProof, RequiredProofs, RequiredProofType, Transaction, TransactionalProof, TransactionType } from './octa.js';
import {Loan} from './loan.contract.js';

// setup
async function deploy() {
  await isReady;
  const Local = Mina.LocalBlockchain();
  Mina.setActiveInstance(Local);
  const lender = Local.testAccounts[0].privateKey;
  const borrower = Local.testAccounts[1].privateKey;
  const findataRepo = Local.testAccounts[2].privateKey;

  const snappPrivkey = PrivateKey.random();
  let snappAddress = snappPrivkey.toPublicKey();
  let snappInstance : Loan;

  console.log('Deploying Snapp...');
  let tx = Mina.transaction(lender, async () => {
    const initialBalance = UInt64.fromNumber(1000000);
    const p = await Party.createSigned(borrower);
    p.balance.subInPlace(initialBalance);
    snappInstance = new Loan(snappAddress);
    snappInstance.deploy(initialBalance, new Field(1), new Field(365), 
    // new RequiredProofs([new RequiredProof(
    //   RequiredProofType.avgMonthlyIncomeProof(), 
    //   new Int64(new Field(100000)), 
    //   new Int64(new Field(3000)))])
      );
  });
  
  await tx.send().wait();
  let tx1 = Mina.transaction(borrower, async () => {
    let sign = Signature.create(findataRepo, [new Field(1)]);

    snappInstance.requestLoan(new UInt64(new Field(100)), new AccountStatement(
      new Field(0),
      new UInt64(new Field(10000)),
      new Int64(new Field(100)),
      new Int64(new Field(100)),
      new Int64(new Field(100)),
      [new Transaction(
        new Field(1), 
        new Int64(new Field(100)), 
        new TransactionType(
          new Bool(true), 
          new Bool(false), 
          new Bool(false), 
          new Bool(false) 
        ), 
        new Int64(new Field(0)))
      ],
      findataRepo.toPublicKey(), sign 
    )).catch((e) => console.log(e));
  });
  //await tx1.send().wait().catch((e) => console.log(e));
}

deploy();

shutdown();
