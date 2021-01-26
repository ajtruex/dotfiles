import { Job, Platform } from '@expo/eas-build-job';
import { CredentialsSource } from '../../../../easJson';
import { Builder, BuilderContext } from '../../types';
declare class iOSBuilder implements Builder<Platform.iOS> {
    readonly ctx: BuilderContext<Platform.iOS>;
    private credentials?;
    private secretEnvs?;
    private scheme?;
    constructor(ctx: BuilderContext<Platform.iOS>);
    prepareJobAsync(archiveUrl: string): Promise<Job>;
    ensureCredentialsAsync(): Promise<CredentialsSource.LOCAL | CredentialsSource.REMOTE | undefined>;
    setupAsync(): Promise<void>;
    ensureProjectConfiguredAsync(): Promise<void>;
    configureProjectAsync(): Promise<void>;
    private configureEasBuildAsync;
    private prepareJobCommonAsync;
    private prepareGenericJobAsync;
    private prepareManagedJobAsync;
    private shouldLoadCredentials;
    private resolveScheme;
}
export default iOSBuilder;
