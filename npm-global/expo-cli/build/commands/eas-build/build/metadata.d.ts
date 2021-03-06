import { CredentialsSource, Workflow } from '../../../easJson';
import { BuilderContext, Platform, TrackingContext } from '../types';
export declare type BuildMetadata = {
    /**
     * Application version (the expo.version key in app.json/app.config.js)
     */
    appVersion: string;
    /**
     * Expo CLI version
     */
    cliVersion: string;
    /**
     * Build workflow
     * It's either 'generic' or 'managed'
     */
    workflow: Workflow;
    /**
     * Credentials source
     * Credentials could be obtained either from credential.json or Expo servers.
     */
    credentialsSource?: CredentialsSource.LOCAL | CredentialsSource.REMOTE;
    /**
     * Expo SDK version
     * It's determined by the expo package version in package.json.
     * It's undefined if the expo package is not installed for the project.
     */
    sdkVersion?: string;
    /**
     * Release channel (for expo-updates)
     * It's undefined if the expo-updates package is not installed for the project.
     */
    releaseChannel?: string;
    /**
     * Tracking context
     * It's used to track build process across different Expo services and tools.
     */
    trackingContext: TrackingContext;
};
declare function collectMetadata<T extends Platform>(ctx: BuilderContext<T>, { credentialsSource, }: {
    credentialsSource?: CredentialsSource.LOCAL | CredentialsSource.REMOTE;
}): Promise<BuildMetadata>;
export { collectMetadata };
