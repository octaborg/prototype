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
      new Int64(new Field(5000)), // TODO adjust timestamp to pass tests
      new TransactionType(
        new Bool(true), 
        new Bool(false), 
        new Bool(false), 
        new Bool(false) 
      ), 
      new Int64(new Field(0)))
    ],
    pubkey, sign 
  ));
}
