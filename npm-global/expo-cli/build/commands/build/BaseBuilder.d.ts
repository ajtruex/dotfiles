import { ExpoConfig, ProjectConfig } from '@expo/config';
import { User } from '@expo/xdl';
import { BuilderOptions } from './BaseBuilder.types';
import { Platform } from './constants';
export default class BaseBuilder {
    projectDir: string;
    options: BuilderOptions;
    protected projectConfig: ProjectConfig;
    manifest: ExpoConfig;
    getUserAsync(): Promise<User>;
    constructor(projectDir: string, options?: BuilderOptions);
    protected updateProjectConfig(): void;
    command(): Promise<void>;
    run(): Promise<void>;
    commandCheckStatus(): Promise<void>;
    prepareProjectInfo(): Promise<void>;
    checkProjectConfig(): Promise<void>;
    checkForBuildInProgress(): Promise<void>;
    checkStatus(platform?: 'all' | 'ios' | 'android'): Promise<void>;
    checkStatusBeforeBuild(): Promise<void>;
    logBuildStatuses(buildStatus: {
        jobs: Record<string, any>[];
        canPurchasePriorityBuilds: boolean;
        numberOfRemainingPriorityBuilds: number;
        hasUnlimitedPriorityBuilds?: boolean;
    }): Promise<void>;
    ensureReleaseExists(): Promise<string[]>;
    wait(buildId: string, { interval, publicUrl }?: {
        interval?: number;
        publicUrl?: string;
    }): Promise<any>;
    build(expIds?: string[]): Promise<void>;
    platform(): Platform;
}
