import { AppleCtx } from './authenticate';
declare type Options = {
    enablePushNotifications?: boolean;
};
export declare function ensureAppExists(appleCtx: AppleCtx, { accountName, projectName, bundleIdentifier, }: {
    accountName: string;
    projectName: string;
    bundleIdentifier: string;
}, options?: Options): Promise<void>;
export {};
