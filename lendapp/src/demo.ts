import {
    Field,
    UInt64,
    Int64,
    isReady,
    shutdown,
    Bool,
    Signature, Mina
} from 'snarkyjs';
import {
    AccountStatement, generateDummyAccount,
    RequiredProof,
    RequiredProofs,
    RequiredProofType,
    Transaction,
    TransactionType
} from './octa.js';
import {Loan, deploy, requestLoan, getTestAccounts} from './loan.contract.js';

await isReady;

// setup
async function deployT() {
    console.log('Deploying Snapp...');
    const initialBalance = UInt64.fromNumber(10_000_000_000);
    let snapp = await deploy(initialBalance, new Field(1), new Field(365),
        new RequiredProofs([new RequiredProof(
            RequiredProofType.avgMonthlyIncomeProof(),
            new Int64(new Field(1000)),
            new Int64(new Field(500)))]));

    let state = await snapp.getSnappState();
    console.log('=============== Start Borrow ================');
    console.log('Contract Balance = ', state.availableToLend.value.toString());
    let borrower = getTestAccounts()[1].privateKey;
    let borrowerAcc = await Mina.getAccount(borrower.toPublicKey());
    console.log('Borrower Balance = ', borrowerAcc.balance.value.toString());
    // console.log(state);

    const findataRepo = getTestAccounts()[2].privateKey;
    const acc = generateDummyAccount(1, 1000, 10, 10000);
    let sign = acc.sign(findataRepo);
    await requestLoan(state.address, new UInt64(new Field(100000)),
        findataRepo.toPublicKey(),
        sign,
        acc,
        state.requiredProofs)
        .catch((e) => console.log(e));

    state = await snapp.getSnappState();
    console.log('=============== End ================');
    console.log('Contract Balance = ', state.availableToLend.value.toString());
    borrowerAcc = await Mina.getAccount(borrower.toPublicKey());
    console.log('Borrower Balance = ', borrowerAcc.balance.value.toString());
}

deployT();

shutdown();
