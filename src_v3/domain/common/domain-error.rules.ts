export const domainErrorKindList = [
    "DOMAIN_KIND",
    "VALUE_OBJECT_KIND"
] as const;

export type DomainErrorKind = typeof domainErrorKindList[number];

export const VALUE_OBJECT_ERROR_MSG = {
    invalidValue: "Invalid value for this ValueObject."
}
