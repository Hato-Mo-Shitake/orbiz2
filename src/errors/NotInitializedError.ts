import { ErrorAttrs } from "src/orbits/contracts/error";

export class NotInitializedError extends Error {
    constructor(attr?: ErrorAttrs) {
        super(`${attr?.name} is not initialized yet.`);
        this.name = "NotInitializedError";
    }
}