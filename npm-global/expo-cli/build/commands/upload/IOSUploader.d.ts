import { ExpoConfig } from '@expo/config';
import BaseUploader, { PlatformOptions } from './BaseUploader';
export declare const LANGUAGES: string[];
export declare type IosPlatformOptions = PlatformOptions & {
    appleId?: string;
    appleIdPassword?: string;
    appName: string;
    language?: string;
    appleTeamId?: string;
    publicUrl?: string;
    companyName?: string;
};
interface AppleIdCredentials {
    appleId: string;
    appleIdPassword: string;
}
export default class IOSUploader extends BaseUploader {
    options: IosPlatformOptions;
    static validateOptions(options: IosPlatformOptions): void;
    constructor(projectDir: string, options: IosPlatformOptions);
    _ensureExperienceIsValid(exp: ExpoConfig): void;
    _getPlatformSpecificOptions(): Promise<{
        [key: string]: any;
    }>;
    _getAppleTeamId(appleIdCredentials: AppleIdCredentials): Promise<string | undefined>;
    _getAppleIdCredentials(): Promise<AppleIdCredentials>;
    _getAppName(): Promise<string>;
    _askForAppName(): Promise<string>;
    _uploadToTheStore(platformData: IosPlatformOptions, buildPath: string): Promise<void>;
}
export {};
