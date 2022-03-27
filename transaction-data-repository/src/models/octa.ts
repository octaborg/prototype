import {
    generateDummyAccount
} from "octa-types";

import { PCG } from 'random-seedable';


import {
    Field,
    Bool,
    Int64,
    UInt64
} from 'snarkyjs';

const getOCTAAccountStatement = async (id: number) => {
    console.log('xorshift');
    const random = new PCG(id);
    console.log('xorshift done');
    const income: number = random.randRange(990, 2800);
    console.log('hemmm');
    const daily_expense: number = random.randRange(60, 150);
    console.log('hummmm');
    const final_balance: number = random.randRange(7000, 25000);
    console.log(income, daily_expense, final_balance);
    return generateDummyAccount(id, income, daily_expense, final_balance);
};

export default { getOCTAAccountStatement };
