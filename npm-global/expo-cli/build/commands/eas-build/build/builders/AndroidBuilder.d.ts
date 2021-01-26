import { Job, Platform } from '@expo/eas-build-job';
import { CredentialsSource } from '../../../../easJson';
import { Builder, BuilderContext } from '../../types';
declare class AndroidBuilder implements Builder<Platform.Android> {
    readonly ctx: BuilderContext<Platform.Android>;
    private credentials?;
    private secretEnvs?;
    private credentialsPrepared;
    constructor(ctx: BuilderContext<Platform.Android>);
    setupAsync(): Promise<void>;
    ensureCredentialsAsync(): Promise<CredentialsSource.LOCAL | CredentialsSource.REMOTE | undefined>;
    private isProjectConfiguredAsync;
    ensureProjectConfiguredAsync(): Promise<void>;
    configureProjectAsync(): Promise<void>;
    prepareJobAsync(archiveUrl: string): Promise<Job>;
    private prepareJobCommonAsync;
    private prepareGenericJobAsync;
    private prepareManagedJobAsync;
    private shouldLoadCredentials;
}
export default AndroidBuilder;
