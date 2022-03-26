import {
    Field,
    UInt64,
    Int64,
    isReady,
    shutdown,
    Bool,
    Signature
} from 'snarkyjs';
import {
    AccountStatement,
    RequiredProof,
    RequiredProofs,
    RequiredProofType,
    Transaction,
    TransactionType
} from 'octa-types';
import {Loan, deploy, requestLoan, getTestAccounts} from './loan.contract.js';

await isReady;

// setup
async function deployT() {
    console.log('Deploying Snapp...');
    const initialBalance = UInt64.fromNumber(1000000);
    let snapp = await deploy(initialBalance, new Field(1), new Field(365),
        new RequiredProofs([new RequiredProof(
            RequiredProofType.avgMonthlyIncomeProof(),
            new Int64(new Field(100000)),
            new Int64(new Field(3000)))]));

    let state = await snapp.getSnappState();
    // console.log(state);

    const findataRepo = getTestAccounts()[2].privateKey;
    let sign = Signature.create(findataRepo, [new Field(1)]);
    requestLoan(state.address, new UInt64(new Field(100)), findataRepo.toPublicKey(), sign, new AccountStatement(
        new Field(0),
        new UInt64(new Field(10000)),
        new UInt64(new Field(100)),
        new UInt64(new Field(100)),
        new UInt64(new Field(100)),
        [new Transaction(
            new Field(1),
            new Int64(new Field(100)),
            new TransactionType(
                new Bool(true),
                new Bool(false),
                new Bool(false),
                new Bool(false)
            ),
            new UInt64(new Field(0)))
        ]
    ), state.requiredProofs).catch((e) => console.log(e));

    state = await snapp.getSnappState();
    console.log(state);
}

deployT();

shutdown();
