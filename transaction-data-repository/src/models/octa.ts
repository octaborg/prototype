import {
    generateDummyAccount
} from "octa-types";


import {
    Field,
    Bool,
    Int64,
    UInt64
} from 'snarkyjs';

const getOCTAAccountStatement = async (id: number) => {
    switch(id) {
        case 0: return generateDummyAccount(id, 1000, 88, 100);
        case 1: return generateDummyAccount(id, 1200, 125, 3000);
        case 2: return generateDummyAccount(id, 900, 99, 50000);
        case 3: return generateDummyAccount(id, 800, 25, 8500);
        case 4: return generateDummyAccount(id, 5000, 300, 1200);
        case 5: return generateDummyAccount(id, 6000, 320, 3400);
        case 6: return generateDummyAccount(id, 4500, 400, 43200);
        case 7: return generateDummyAccount(id, 3200, 350, 1000000);
        case 8: return generateDummyAccount(id, 1800, 220, 8400);
        case 9: return generateDummyAccount(id, 1800, 210, 20200);
        default: return generateDummyAccount(id, 1000, 88, 100);
    }
};

export default { getOCTAAccountStatement };
