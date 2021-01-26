import ExtendableError from 'es6-error';
export declare const ErrorCodes: {
    INVALID_PROJECT_DIR: string;
    INVALID_PROJECT_NAME: string;
    INVALID_PUBLIC_URL: string;
    NOT_LOGGED_IN: string;
    NON_INTERACTIVE: string;
    BAD_CHOICE: string;
    MISSING_PUBLIC_URL: string;
    APPLE_DIST_CERTS_TOO_MANY_GENERATED_ERROR: string;
    APPLE_PUSH_KEYS_TOO_MANY_GENERATED_ERROR: string;
    MISSING_SLUG: string;
    PROJECT_NOT_FOUND: string;
};
export declare type ErrorCode = keyof typeof ErrorCodes;
export default class CommandError extends ExtendableError {
    code: string;
    isCommandError: true;
    constructor(code: string, message?: string);
}
export declare class AbortCommandError extends CommandError {
    constructor();
}
