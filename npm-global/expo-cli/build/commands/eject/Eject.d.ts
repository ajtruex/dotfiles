import { PackageJSONConfig } from '@expo/config';
declare type DependenciesMap = {
    [key: string]: string | number;
};
declare type PlatformsArray = ('ios' | 'android')[];
export declare type EjectAsyncOptions = {
    verbose?: boolean;
    force?: boolean;
    install?: boolean;
    packageManager?: 'npm' | 'yarn';
};
/**
 * Entry point into the eject process, delegates to other helpers to perform various steps.
 *
 * 1. Verify git is clean
 * 2. Create native projects (ios, android)
 * 3. Install node modules
 * 4. Apply config to native projects
 * 5. Install CocoaPods
 * 6. Log project info
 */
export declare function ejectAsync(projectRoot: string, options?: EjectAsyncOptions): Promise<void>;
export declare function shouldDeleteMainField(main?: any): boolean;
export declare function hashForDependencyMap(deps: DependenciesMap): string;
export declare function getTargetPaths(pkg: PackageJSONConfig, platforms: PlatformsArray): string[];
export declare function stripDashes(s: string): string;
/**
 * Returns true if the input string matches the default expo main field.
 *
 * - ./node_modules/expo/AppEntry
 * - ./node_modules/expo/AppEntry.js
 * - node_modules/expo/AppEntry.js
 * - expo/AppEntry.js
 * - expo/AppEntry
 *
 * @param input package.json main field
 */
export declare function isPkgMainExpoAppEntry(input?: string): boolean;
export {};
