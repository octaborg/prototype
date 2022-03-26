import {
    generateDummyAccount
} from "octa-types";

import { XORShift } from 'random-seedable';


import {
    Field,
    Bool,
    Int64,
    UInt64
} from 'snarkyjs';

const getOCTAAccountStatement = async (id: number) => {
    const random = new XORShift(id);
    const income: number = random.randRange(990, 2800);
    const daily_expense: number = random.randRange(60, 150);
    const final_balance: number = random.randRange(7000, 25000);
    return generateDummyAccount(id, income, daily_expense, final_balance);
};

export default { getOCTAAccountStatement };
