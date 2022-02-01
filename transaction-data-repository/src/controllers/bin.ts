import { Request, Response, NextFunction } from 'express';

import crypto from "crypto";

interface ResponseObject {
    value: String;
    hash: String;
    signature: String;
}

const getRandomValue = async (req: Request, res: Response, next: NextFunction) => {
    const randomPayload = crypto.randomBytes(256).toString("hex");
    let response: ResponseObject = {
        "value": randomPayload,
        "hash": "22f8a1",
        "signature": "f322"
    };
    return res.status(200).json(response);
};

export default { getRandomValue };
