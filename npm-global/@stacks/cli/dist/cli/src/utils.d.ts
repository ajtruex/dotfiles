/// <reference types="node" />
import * as bitcoinjs from 'bitcoinjs-lib';
import { ClarityAbiType, ClarityValue } from '@stacks/transactions';
import { StacksNetwork } from '@stacks/network';
import { TransactionSigner } from 'blockstack';
import { NameInfoType, CLINetworkAdapter } from './network';
export interface UTXO {
    value?: number;
    confirmations?: number;
    tx_hash: string;
    tx_output_n: number;
}
declare class CLITransactionSigner implements TransactionSigner {
    address: string;
    isComplete: boolean;
    constructor(address?: string);
    getAddress(): Promise<string>;
    signTransaction(_txIn: bitcoinjs.TransactionBuilder, _signingIndex: number): Promise<void>;
    signerVersion(): number;
}
export declare class NullSigner extends CLITransactionSigner {
}
export declare class MultiSigKeySigner extends CLITransactionSigner {
    redeemScript: Buffer;
    privateKeys: string[];
    m: number;
    constructor(redeemScript: string, privateKeys: string[]);
    getAddress(): Promise<string>;
    signTransaction(txIn: bitcoinjs.TransactionBuilder, signingIndex: number): Promise<void>;
    signerVersion(): number;
}
export declare class SegwitP2SHKeySigner extends CLITransactionSigner {
    redeemScript: Buffer;
    witnessScript: Buffer;
    privateKeys: string[];
    m: number;
    constructor(redeemScript: string, witnessScript: string, m: number, privateKeys: string[]);
    getAddress(): Promise<string>;
    findUTXO(txIn: bitcoinjs.TransactionBuilder, signingIndex: number, utxos: UTXO[]): UTXO;
    signTransaction(txIn: bitcoinjs.TransactionBuilder, signingIndex: number): Promise<void>;
    signerVersion(): number;
}
export declare class SafetyError extends Error {
    safetyErrors: AnyJson;
    constructor(safetyErrors: AnyJson);
}
export declare function hasKeys(signer: string | CLITransactionSigner): boolean;
export declare function parseNullSigner(addrString: string): NullSigner;
export declare function parseMultiSigKeys(serializedPrivateKeys: string): MultiSigKeySigner;
export declare function parseSegwitP2SHKeys(serializedPrivateKeys: string): SegwitP2SHKeySigner;
export declare function decodePrivateKey(serializedPrivateKey: string): string | CLITransactionSigner;
declare type AnyJson = string | number | boolean | null | {
    [property: string]: AnyJson;
} | AnyJson[];
export declare function JSONStringify(obj: AnyJson, stderr?: boolean): string;
export declare function getPublicKeyFromPrivateKey(privateKey: string): string;
export declare function getPrivateKeyAddress(network: CLINetworkAdapter, privateKey: string | CLITransactionSigner): string;
export declare function isSubdomain(name: string): boolean;
export declare function canonicalPrivateKey(privkey: string): string;
export declare function sumUTXOs(utxos: UTXO[]): number;
export declare function hash160(buff: Buffer): Buffer;
export declare function checkUrl(url: string): string;
export declare function makeProfileJWT(profileData: Object, privateKey: string): string;
export declare function makeDIDConfiguration(network: CLINetworkAdapter, blockstackID: string, domain: string, privateKey: string): Promise<{
    entries: {
        did: string;
        jwt: string;
    }[];
}>;
export declare function broadcastTransactionAndZoneFile(network: CLINetworkAdapter, tx: string, zonefile?: string): Promise<{
    status: boolean;
    error: string;
    txid: string;
} | {
    status: boolean;
    txid: string;
    error?: undefined;
} | {
    status: boolean;
    error: string;
    message: any;
    stacktrace: any;
}>;
export declare function getNameInfoEasy(network: CLINetworkAdapter, name: string): Promise<NameInfoType | null>;
export declare function nameLookup(network: CLINetworkAdapter, name: string, includeProfile?: boolean): Promise<{
    profile: any;
    profileUrl?: string;
    zonefile?: string;
}>;
export declare function getpass(promptStr: string, cb: (passwd: string) => void): void;
export declare function getBackupPhrase(backupPhraseOrCiphertext: string, password?: string): Promise<string>;
export declare function mkdirs(path: string): void;
export declare function getIDAddress(network: CLINetworkAdapter, nameOrIDAddress: string): Promise<string>;
export declare function getOwnerKeyFromIDAddress(network: CLINetworkAdapter, mnemonic: string, idAddress: string): Promise<string>;
export interface IDAppKeys {
    ownerPrivateKey: string;
    appPrivateKey: string;
    mnemonic: string;
}
export declare function getIDAppKeys(network: CLINetworkAdapter, nameOrIDAddress: string, appOrigin: string, mnemonicOrCiphertext: string): Promise<IDAppKeys>;
interface InquirerPrompt {
    type: string;
    name: string;
    message: string;
    choices?: string[];
}
export declare function makePromptsFromArgList(expectedArgs: ClarityFunctionArg[]): InquirerPrompt[];
export interface ClarityFunctionArg {
    name: string;
    type: ClarityAbiType;
}
export declare function argToPrompt(arg: ClarityFunctionArg): InquirerPrompt;
export declare function parseClarityFunctionArgAnswers(answers: any, expectedArgs: ClarityFunctionArg[]): ClarityValue[];
export declare function answerToClarityValue(answer: any, arg: ClarityFunctionArg): ClarityValue;
export declare function generateExplorerTxPageUrl(txid: string, network: StacksNetwork): string;
export {};
