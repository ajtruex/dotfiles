import { CLINetworkAdapter } from './network';
export declare const STRENGTH = 128;
export declare const STX_WALLET_COMPATIBLE_SEED_STRENGTH = 256;
export declare const DERIVATION_PATH = "m/44'/5757'/0'/0/0";
export declare type OwnerKeyInfoType = {
    privateKey: string;
    version: string;
    index: number;
    idAddress: string;
};
export declare type PaymentKeyInfoType = {
    privateKey: string;
    address: {
        BTC: string;
        STACKS: string;
    };
    index: number;
};
export declare type StacksKeyInfoType = {
    privateKey: string;
    address: string;
    btcAddress: string;
    index: number;
};
export declare type AppKeyInfoType = {
    keyInfo: {
        privateKey: string;
        address: string;
    };
    legacyKeyInfo: {
        privateKey: string;
        address: string;
    };
    ownerKeyIndex: number;
};
export declare function getOwnerKeyInfo(network: CLINetworkAdapter, mnemonic: string, index: number, version?: string): Promise<OwnerKeyInfoType>;
export declare function getPaymentKeyInfo(network: CLINetworkAdapter, mnemonic: string): Promise<PaymentKeyInfoType>;
export declare function getStacksWalletKeyInfo(network: CLINetworkAdapter, mnemonic: string): Promise<StacksKeyInfoType>;
export declare function findIdentityIndex(network: CLINetworkAdapter, mnemonic: string, idAddress: string, maxIndex?: number): Promise<number>;
export declare function getApplicationKeyInfo(network: CLINetworkAdapter, mnemonic: string, idAddress: string, appDomain: string, idIndex?: number): Promise<AppKeyInfoType>;
export declare function extractAppKey(network: CLINetworkAdapter, appKeyInfo: {
    keyInfo: {
        privateKey: string;
        address: string;
    };
    legacyKeyInfo: {
        privateKey: string;
        address: string;
    };
}, appAddress?: string): string;
