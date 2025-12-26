export const domainErrorKindList = [
    "DOMAIN_ERROR_KIND",
    "VALUE_OBJECT_ERROR_KIND"
] as const;

export type DomainErrorKind = typeof domainErrorKindList[number];

export const VALUE_OBJECT_ERROR_MSG = {
    invalidValue: "Invalid value for this ValueObject."
}
