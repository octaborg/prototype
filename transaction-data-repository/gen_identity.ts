import {
    PrivateKey,
    JSONValue
} from 'snarkyjs';

import { castJSONValue } from "octa-types";

const authorityPrivateKey = PrivateKey.random();
const secret: JSONValue = castJSONValue(authorityPrivateKey.s.toJSON());

console.log()
console.log("Here's your new secret identity\n");
console.log(secret.toString());
console.log("\nYou may put it in your configs, use ./config/default.csj as template.")
