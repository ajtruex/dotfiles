/// <reference types="node" />
export declare function encryptBackupPhrase(plaintextBuffer: string, password: string): Promise<Buffer>;
export declare function decryptBackupPhrase(dataBuffer: string | Buffer, password: string): Promise<string>;
