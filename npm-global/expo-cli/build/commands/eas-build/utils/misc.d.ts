import { Build } from '../types';
export interface DeprecationInfo {
    type: 'user-facing' | 'internal';
    message: string;
}
declare function printLogsUrls(accountName: string, builds: {
    platform: 'android' | 'ios';
    buildId: string;
}[]): Promise<void>;
declare function printBuildResults(builds: (Build | null)[]): Promise<void>;
declare function printDeprecationWarnings(deprecationInfo?: DeprecationInfo): void;
export { printLogsUrls, printBuildResults, printDeprecationWarnings };
