import { CLINetworkAdapter } from './network';
import { UserData } from '@stacks/auth';
import { GaiaHubConfig } from '@stacks/storage';
export declare function makeAssociationToken(appPrivateKey: string, identityKey: string): string;
export declare function gaiaAuth(network: CLINetworkAdapter, appPrivateKey: string | null, hubUrl: string | null, ownerPrivateKey?: string): Promise<UserData>;
export declare function gaiaConnect(network: CLINetworkAdapter, gaiaHubUrl: string, privateKey: string, ownerPrivateKey?: string): Promise<GaiaHubConfig>;
export declare function gaiaUploadProfile(network: CLINetworkAdapter, gaiaHubURL: string, gaiaData: string, privateKey: string, blockstackID?: string): Promise<string>;
export declare function gaiaUploadProfileAll(network: CLINetworkAdapter, gaiaUrls: string[], gaiaData: string, privateKey: string, blockstackID?: string): Promise<{
    dataUrls?: string[] | null;
    error?: string | null;
}>;
export declare function makeZoneFileFromGaiaUrl(network: CLINetworkAdapter, name: string, gaiaHubUrl: string, ownerKey: string): Promise<any>;
export declare function getGaiaAddressFromURL(appUrl: string): string;
export declare function getGaiaAddressFromProfile(network: CLINetworkAdapter, profile: any, appOrigin: string): string;
