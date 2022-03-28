import React, {useState} from 'react';
import ReactDOM from 'react-dom';

import {
    isReady, Int64, UInt64, Field, CircuitValue, prop
} from 'snarkyjs';

import {
    AccountStatement,
    castScalar,
    RequiredProofs,
    RequiredProof,
    RequiredProofType,
    generateDummyAccount
} from "./octa.js";

await isReady;

class ExampleCircuit extends CircuitValue {
    @prop alpha: Field;
    @prop omega: UInt64;

    constructor(
        alpha: Field,
        omega: UInt64
    ) {
        super();
        this.alpha = alpha;
        this.omega = omega;
    }

    serialize(): Field[] {
        return this.toFields();
    }

    static deserialize(serialized: Field[]): ExampleCircuit {
        const deserialized = ExampleCircuit.ofFields(serialized);
        if (deserialized === null) {
            throw Error();
        }
        return deserialized;
    }
}
const example_instance: ExampleCircuit = new ExampleCircuit(new Field(0), new UInt64(new Field(1242)));

console.log(example_instance.alpha.toString());
console.log(example_instance.omega.toString());

const example_instance_serialized: Field[] = example_instance.serialize();
const example_instance_serialized_strings: string[] = [];

for (let j = 0; j < example_instance_serialized.length; ++j) {
    example_instance_serialized_strings.push(example_instance_serialized[j].toString());
}

console.log(example_instance_serialized_strings);

const example_instance_serialized_hardcoded: string[] = [ '0', '1242' ];
const example_instance_serialized_hardcoded_fields: Field[] = [];

for (let j = 0; j < example_instance_serialized_hardcoded.length; ++j) {
    example_instance_serialized_hardcoded_fields.push(new Field(example_instance_serialized_hardcoded[j]));
}

const example_instance_deserialized: ExampleCircuit = ExampleCircuit.deserialize(example_instance_serialized_hardcoded_fields);

if (example_instance_deserialized.alpha && example_instance_deserialized.omega) {
    console.log('deserialization of ExampleCircuit succeeded');
    console.log(example_instance_deserialized.alpha.toString());
    console.log(example_instance_deserialized.omega.toString());
} else {
    console.log('deserialization of ExampleCircuit failed');
}

class AnotherCircuit extends CircuitValue {
    @prop alpha: Field;
    @prop omega: Int64;

    constructor(
        alpha: Field,
        omega: Int64
    ) {
        super();
        this.alpha = alpha;
        this.omega = omega;
    }

    serialize(): Field[] {
        return this.toFields();
    }

    static deserialize(serialized: Field[]): AnotherCircuit {
        const deserialized = AnotherCircuit.ofFields(serialized);
        if (deserialized === null) {
            throw Error();
        }
        return deserialized;
    }
}

const another_instance: AnotherCircuit = new AnotherCircuit(new Field(0), new Int64(new Field(1242)));

console.log(another_instance.alpha.toString());
console.log(another_instance.omega.toString());

const another_instance_serialized: Field[] = example_instance.serialize();
const another_instance_serialized_strings: string[] = [];

for (let j = 0; j < another_instance_serialized.length; ++j) {
    another_instance_serialized_strings.push(another_instance_serialized[j].toString());
}

console.log(another_instance_serialized_strings);

const another_instance_serialized_hardcoded: string[] = [ '0', '1242' ];
const another_instance_serialized_hardcoded_fields: Field[] = [];

for (let j = 0; j < another_instance_serialized_hardcoded.length; ++j) {
    another_instance_serialized_hardcoded_fields.push(new Field(another_instance_serialized_hardcoded[j]));
}

const another_instance_deserialized: AnotherCircuit = AnotherCircuit.deserialize(another_instance_serialized_hardcoded_fields);

if (example_instance_deserialized.alpha && example_instance_deserialized.omega) {
    console.log('deserialization of AnotherCircuit succeeded');
    console.log(another_instance_deserialized.alpha.toString());
    console.log(another_instance_deserialized.omega.toString());
} else {
    console.log('deserialization of AnotherCircuit failed');
}

function App() {
    const [tab, setTab] = React.useState(0);

    return (
        <p>Check the console log to see if it worked!</p>
    );
}

ReactDOM.render(<App/>, document.querySelector('#root'));
