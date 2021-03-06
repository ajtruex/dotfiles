import { PackageJSONConfig, ProjectTarget } from '@expo/config';
import { Project } from '@expo/xdl';
import { Command } from 'commander';
declare type Options = {
    clear?: boolean;
    sendTo?: string | boolean;
    quiet?: boolean;
    target?: ProjectTarget;
    releaseChannel?: string;
    duringBuild?: boolean;
    maxWorkers?: number;
    parent?: {
        nonInteractive: boolean;
    };
};
export declare function action(projectDir: string, options?: Options): Promise<Project.PublishedProjectResult>;
export declare function isInvalidReleaseChannel(releaseChannel?: string): boolean;
export declare function logExpoUpdatesWarnings(pkg: PackageJSONConfig): void;
export declare function logOptimizeWarnings({ projectRoot }: {
    projectRoot: string;
}): void;
/**
 * Warn users if they attempt to publish in a bare project that may also be
 * using Expo client and does not If the developer does not have the Expo
 * package installed then we do not need to warn them as there is no way that
 * it will run in Expo client in development even. We should revisit this with
 * dev client, and possibly also by excluding SDK version for bare
 * expo-updates usage in the future (and then surfacing this as an error in
 * the Expo client app instead)
 *
 * Related: https://github.com/expo/expo/issues/9517
 *
 * @param pkg package.json
 */
export declare function logBareWorkflowWarnings(pkg: PackageJSONConfig): void;
export default function (program: Command): void;
export {};
