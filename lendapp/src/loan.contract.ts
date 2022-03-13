import {
    Field,
    PublicKey,
    SmartContract,
    state,
    State,
    method,
    UInt64,
    Mina,
    isReady,
    PrivateKey,
    Party,
    shutdown,
    Bool,
    Signature
} from 'snarkyjs';

import {AccountStatement, RequiredProofs, TransactionalProof} from 'octa-types';

export {Loan, LoanData, deploy, requestLoan, getSnappState, getTestAccounts};

await isReady;

class LoanData {
    address: PublicKey;
    availableToLend: UInt64;
    interestRate: Field;
    termInDays: Field;

    constructor(
        address: PublicKey,
        availableToLend: UInt64,
        interestRate: Field,
        termInDays: Field,) {
        this.address = address;
        this.availableToLend = availableToLend;
        this.interestRate = interestRate;
        this.termInDays = termInDays;
    }

}

/**
 * Loan smart contract interface
 */
class Loan extends SmartContract {
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
        console.log(" =================", loanAmount.toString());
        this.balance.addInPlace(loanAmount);
        this.interestRate.set(interestRate);
        this.termInDays.set(termInDays);
        this.requiredProofs.set(requiredProofs);
    }

    // Request a loan with required proofs. Called by the borrower
    @method
    async requestLoan(amount: UInt64, authorityPublicKey: PublicKey, signature: Signature, accountStatement: AccountStatement) {
        new TransactionalProof(accountStatement, await this.requiredProofs.get()).validate(authorityPublicKey, signature);

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
const Local = Mina.LocalBlockchain();
Mina.setActiveInstance(Local);
const lender = Local.testAccounts[0].privateKey;
const borrower = Local.testAccounts[1].privateKey;

let isDeploying = null as null | {
    requestLoan(amount: UInt64, authorityPublicKey: PublicKey, signature: Signature, accountStatement: AccountStatement): Promise<void>;
    getSnappState(): Promise<LoanData>;
};

async function deploy(
    loanAmount: UInt64, // Min 1000000
    interestRate: Field,
    termInDays: Field,
    requiredProofs: RequiredProofs) {
    if (isDeploying) return isDeploying;
    const snappPrivkey = PrivateKey.random();
    let snappAddress = snappPrivkey.toPublicKey();
    let snappInterface = {
        requestLoan(amount: UInt64, authorityPublicKey: PublicKey, signature: Signature, accountStatement: AccountStatement) {
            return requestLoan(snappAddress, amount, authorityPublicKey, signature, accountStatement);
        },
        getSnappState() {
            return getSnappState(snappAddress);
        },
    };
    isDeploying = snappInterface;

    let snapp = new Loan(
        snappAddress,
    );
    let tx = Mina.transaction(lender, async () => {
        console.log('Deploying Loan Contract...');
        // const p = await Party.createSigned(lender); // TODO ask why this fails?
        const p = await Party.createSigned(borrower);
        const actualAmountWithFee = loanAmount.add(1000000); // TODO Adding the missing 1,000,0000, ask?
        p.balance.subInPlace(actualAmountWithFee);
        snapp.deploy(actualAmountWithFee, interestRate, termInDays, requiredProofs);
    });

    try {
        await tx.send().wait();
    } catch (err) {
        console.log('Deployment rejected!', err);
    }
    isDeploying = null;
    return snappInterface;
}

async function requestLoan(snappAddress: PublicKey,
                           amount: UInt64,
                           authorityPublicKey: PublicKey,
                           signature: Signature,
                           accountStatement: AccountStatement) {
    let snapp = new Loan(snappAddress);
    let tx = Mina.transaction(borrower, async () => {
        await snapp.requestLoan(amount, authorityPublicKey, signature, accountStatement);
    });
    try {
        await tx.send().wait();
    } catch (err) {
        console.log('rejected!', err);
    }
}

async function getSnappState(snappAddress: PublicKey) {
    let account = await Mina.getAccount(snappAddress);
    let snappState = account.snapp.appState;

    return new LoanData(
        snappAddress,
        account.balance,
        snappState[0],
        snappState[1]
    );
}

function getTestAccounts() {
    return Local.testAccounts;
}

