import { Bool, Signature, UInt64, PrivateKey, Int64, Field, isReady, shutdown, Circuit } from "snarkyjs";
import { 
  AccountStatement, 
  RequiredProofs, 
  Transaction, 
  TransactionalProof, 
  TransactionType, 
  RequiredProof, 
  RequiredProofType 
} from "./octa";

describe('TransactionDataProof', () => {

  beforeAll(async () => {
    await isReady;
  });
  afterAll(async () => {
    await shutdown();
  });

  describe('validate()', () => {
    it('Should validate Validate average monthly income proof correctly', async () => {
      const tdp = new TransactionalProof(await testAccountStatement1(), testRequiredProofs1())
      await Circuit.runAndCheck(() => Promise.resolve(
        () => tdp.validate()));
    });
  });

  describe('updateIncome()', () => {
    it('Should update the income correctly', async () => {
      let account = await testAccountStatement1();
      const tdp = new TransactionalProof(account, testRequiredProofs1());
      let incomeMap = new Map();
      let totalIncome = await Circuit.runAndCheck(() => Promise.resolve(
        () => tdp.updateIncome(new Int64(new Field(0)), new Field(1), incomeMap, account.transactions[0])));
      expect(totalIncome).toEqual(account.transactions[0].amount);
    });
  });

  describe('arithmatic', () => {
    it.skip('Should calculate division correctly', async () => {
      expect(new Field(3000).div(3)).toEqual(new Field(1000)); // works
      expect(new Field(3).div(3)).toEqual(new Field(1)); // works
      expect(new Field(10).div(3)).toEqual(new Field(4)); // 9649340769776349618630915417390658987787685493980520238651558921449989211779
      expect(new Field(5000).div(3)).toEqual(new Field(0)); // 9649340769776349618630915417390658987787685493980520238651558921449989211779
    });
  });
});

function testRequiredProofs1() : RequiredProofs {
  return new RequiredProofs([
    new RequiredProof(RequiredProofType.avgMonthlyIncomeProof(), new Int64(new Field(2000)), new Int64(new Field(1000)))
  ]);
}

async function testAccountStatement1() : Promise<AccountStatement> {
  const snappPrivkey = PrivateKey.random();
  let pubkey = snappPrivkey.toPublicKey();
  let sign = Signature.create(snappPrivkey, [new Field(1)]);
  return Promise.resolve(new AccountStatement(
    new Field(0),
    new UInt64(new Field(10000)),
    new Int64(new Field(100)), // timestamp
    new Int64(new Field(100)),
    new Int64(new Field(100)),
    [new Transaction(
      new Field(1), 
      new Int64(new Field(5000)), 
      new TransactionType(
        new Bool(false), 
        new Bool(true), 
        new Bool(false), 
        new Bool(false) 
      ), 
      new Int64(new Field(new Date().getTime() - 2592000000)))
    ],
    pubkey, sign 
  ));
}
