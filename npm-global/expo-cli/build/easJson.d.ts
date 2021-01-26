export declare enum Workflow {
    Generic = "generic",
    Managed = "managed"
}
export declare enum CredentialsSource {
    LOCAL = "local",
    REMOTE = "remote",
    AUTO = "auto"
}
export interface AndroidManagedBuildProfile {
    workflow: Workflow.Managed;
    credentialsSource: CredentialsSource;
    buildType?: 'apk' | 'app-bundle';
    releaseChannel?: undefined;
}
export interface AndroidGenericBuildProfile {
    workflow: Workflow.Generic;
    credentialsSource: CredentialsSource;
    gradleCommand?: string;
    artifactPath?: string;
    withoutCredentials?: boolean;
    releaseChannel?: string;
}
export interface iOSManagedBuildProfile {
    workflow: Workflow.Managed;
    credentialsSource: CredentialsSource;
    buildType?: 'archive' | 'simulator';
    releaseChannel?: undefined;
}
export interface iOSGenericBuildProfile {
    workflow: Workflow.Generic;
    credentialsSource: CredentialsSource;
    scheme?: string;
    artifactPath?: string;
    releaseChannel?: string;
}
export declare type AndroidBuildProfile = AndroidManagedBuildProfile | AndroidGenericBuildProfile;
export declare type iOSBuildProfile = iOSManagedBuildProfile | iOSGenericBuildProfile;
export declare type BuildProfile = AndroidBuildProfile | iOSBuildProfile;
export interface EasConfig {
    builds: {
        android?: AndroidManagedBuildProfile | AndroidGenericBuildProfile;
        ios?: iOSManagedBuildProfile | iOSGenericBuildProfile;
    };
}
export declare class EasJsonReader {
    private projectDir;
    private platform;
    constructor(projectDir: string, platform: 'android' | 'ios' | 'all');
    readAsync(buildProfileName: string): Promise<EasConfig>;
    private validateBuildProfile;
    private readFile;
}
