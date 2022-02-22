import {
    AccountStatement
} from "octa-types";

const getOCTAAccountStatement = async (id: Number) => {
    return AccountStatement.dummy();
};

export default { getOCTAAccountStatement };
