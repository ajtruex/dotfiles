import { CLI_CONFIG_TYPE } from './argparse';
import { BlockstackNetwork } from 'blockstack/lib/network';
export interface CLI_NETWORK_OPTS {
    consensusHash: string | null;
    feeRate: number | null;
    namespaceBurnAddress: string | null;
    priceToPay: string | null;
    priceUnits: string | null;
    receiveFeesPeriod: number | null;
    gracePeriod: number | null;
    altAPIUrl: string | null;
    altTransactionBroadcasterUrl: string | null;
    nodeAPIUrl: string | null;
}
export interface PriceType {
    units: 'BTC' | 'STACKS';
    amount: import('bn.js');
}
export declare type NameInfoType = {
    address: string;
    blockchain?: string;
    did?: string;
    expire_block?: number;
    grace_period?: number;
    last_txid?: string;
    renewal_deadline?: number;
    resolver?: string | null;
    status?: string;
    zonefile?: string | null;
    zonefile_hash?: string | null;
};
export declare class CLINetworkAdapter {
    consensusHash: string | null;
    feeRate: number | null;
    namespaceBurnAddress: string | null;
    priceToPay: string | null;
    priceUnits: string | null;
    gracePeriod: number | null;
    receiveFeesPeriod: number | null;
    nodeAPIUrl: string;
    optAlwaysCoerceAddress: boolean;
    legacyNetwork: BlockstackNetwork;
    constructor(network: BlockstackNetwork, opts: CLI_NETWORK_OPTS);
    isMainnet(): boolean;
    isTestnet(): boolean;
    setCoerceMainnetAddress(value: boolean): void;
    coerceMainnetAddress(address: string): string;
    getFeeRate(): Promise<number>;
    getConsensusHash(): Promise<string>;
    getGracePeriod(): Promise<number>;
    getNamePrice(name: string): Promise<PriceType>;
    getNamespacePrice(namespaceID: string): Promise<PriceType>;
    getNamespaceBurnAddress(namespace: string, useCLI?: boolean, receiveFeesPeriod?: number): Promise<string>;
    getNameInfo(name: string): Promise<NameInfoType>;
    getBlockchainNameRecord(name: string): Promise<any>;
    getNameHistory(name: string, page: number): Promise<Record<string, any[]>>;
    coerceAddress(address: string): string;
    getAccountHistoryPage(address: string, page: number): Promise<any[]>;
    broadcastTransaction(tx: string): Promise<any>;
    broadcastZoneFile(zonefile: string, txid: string): Promise<any>;
    getNamesOwned(address: string): Promise<string[]>;
}
export declare function getNetwork(configData: CLI_CONFIG_TYPE, regTest: boolean): BlockstackNetwork;
