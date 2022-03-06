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

export { Loan, deploy, requestLoan, getSnappState, getTestAccounts };

await isReady;

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
const Local = Mina.LocalBlockchain();
Mina.setActiveInstance(Local);
const lender = Local.testAccounts[0].privateKey;
const borrower = Local.testAccounts[1].privateKey;

let isDeploying = null as null | {
    requestLoan(amount: UInt64, accountStatement: AccountStatement): Promise<void>;
    getSnappState(): Promise<{
        interestRate: Field,
        termInDays: Field 
    }>;
};

async function deploy(
    loanAmount: UInt64,
    interestRate: Field,
    termInDays: Field,
    requiredProofs: RequiredProofs) {
    if (isDeploying) return isDeploying;
    const snappPrivkey = PrivateKey.random();
    let snappAddress = snappPrivkey.toPublicKey();
    let snappInterface = {
        requestLoan(amount: UInt64, accountStatement: AccountStatement) {
            return requestLoan(snappAddress, amount, accountStatement);
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
        p.balance.subInPlace(loanAmount);
        snapp.deploy(loanAmount, interestRate, termInDays, requiredProofs);
    });

    try {
        await tx.send().wait();
    } catch (err) {
        console.log('Deployment rejected!', err);
    }
    isDeploying = null;
    return snappInterface;
}

async function requestLoan(snappAddress: PublicKey, amount: UInt64, accountStatement: AccountStatement) {
    let snapp = new Loan(snappAddress);
    let tx = Mina.transaction(lender, async () => {
        await snapp.requestLoan(amount, accountStatement);
    });
    try {
        await tx.send().wait();
    } catch (err) {
        console.log('rejected!', err);
    }
}

async function getSnappState(snappAddress: PublicKey) {
    let snappState = (await Mina.getAccount(snappAddress)).snapp.appState;
    return {
        interestRate: snappState[0],
        termInDays: snappState[1] 
    };
}

function getTestAccounts() {
    return Local.testAccounts;
}

