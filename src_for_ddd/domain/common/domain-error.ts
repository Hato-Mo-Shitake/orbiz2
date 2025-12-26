import { DomainErrorKind } from "./domain-error.rules";

export class DomainError extends Error {
    constructor(
        msg: string,
        public readonly errorKind: DomainErrorKind = "DOMAIN_ERROR_KIND",
    ) {
        super(msg);
        this.name = errorKind;
    }
}

export class ValueObjectError extends DomainError {
    constructor(
        msg: string,
        public readonly voName: string,
        public readonly value: any,
    ) {
        super(msg, "VALUE_OBJECT_ERROR_KIND");
    }
}