import { CredentialsSource } from '../../easJson';
import { Keystore } from '../credentials';
import { CredentialsProvider } from './provider';
export interface AndroidCredentials {
    keystore: Keystore;
}
interface AppLookupParams {
    projectName: string;
    accountName: string;
}
interface Options {
    nonInteractive: boolean;
    skipCredentialsCheck: boolean;
}
export default class AndroidCredentialsProvider implements CredentialsProvider {
    private projectDir;
    private app;
    private options;
    readonly platform = "android";
    private readonly ctx;
    constructor(projectDir: string, app: AppLookupParams, options: Options);
    private get projectFullName();
    initAsync(): Promise<void>;
    hasRemoteAsync(): Promise<boolean>;
    hasLocalAsync(): Promise<boolean>;
    isLocalSyncedAsync(): Promise<boolean>;
    getCredentialsAsync(src: CredentialsSource.LOCAL | CredentialsSource.REMOTE): Promise<AndroidCredentials>;
    private getRemoteAsync;
    private getLocalAsync;
    private isKeystoreConfigurationValid;
}
export {};
