import { CredentialsSource } from '../../easJson';
import { AppLookupParams } from '../api/IosApi';
import { CredentialsProvider } from './provider';
export interface iOSCredentials {
    provisioningProfile: string;
    distributionCertificate: {
        certP12: string;
        certPassword: string;
    };
}
interface Options {
    nonInteractive: boolean;
    skipCredentialsCheck: boolean;
}
export default class iOSCredentialsProvider implements CredentialsProvider {
    private projectDir;
    private app;
    private options;
    readonly platform = "ios";
    private readonly ctx;
    private credentials?;
    constructor(projectDir: string, app: AppLookupParams, options: Options);
    initAsync(): Promise<void>;
    hasRemoteAsync(): Promise<boolean>;
    hasLocalAsync(): Promise<boolean>;
    isLocalSyncedAsync(): Promise<boolean>;
    getCredentialsAsync(src: CredentialsSource.LOCAL | CredentialsSource.REMOTE): Promise<iOSCredentials>;
    private getLocalAsync;
    private getRemoteAsync;
    private fetchRemoteAsync;
}
export {};
