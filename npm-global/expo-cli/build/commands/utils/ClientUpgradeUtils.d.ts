import * as ConfigUtils from '@expo/config';
import { Versions } from '@expo/xdl';
export declare function getExpoSdkConfig(path: string): Promise<ConfigUtils.ExpoConfig | undefined>;
declare type ClientPlatform = 'android' | 'ios';
export declare function getClient(platform: ClientPlatform, sdk?: Versions.SDKVersion | null): {
    url: string;
    version: string | undefined;
} | null;
interface AvailableClientOptions {
    sdkVersions: Versions.SDKVersions;
    platform: ClientPlatform;
    project?: ConfigUtils.ExpoConfig;
}
interface AvailableClient {
    sdkVersion: Versions.SDKVersion;
    sdkVersionString: string;
    clientUrl?: string;
    clientVersion?: string;
}
export declare function getAvailableClients(options: AvailableClientOptions): AvailableClient[];
interface InstallClientOptions {
    clients: AvailableClient[];
    latestSdkVersion?: string;
    currentSdkVersion?: string;
}
export declare function askClientToInstall(options: InstallClientOptions): Promise<AvailableClient>;
export {};
