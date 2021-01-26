import { BuildCommandPlatform, TrackingContext } from '../types';
interface Options {
    parent: {
        nonInteractive?: boolean;
    };
}
export default function credentialsSyncAction(projectDir: string, options: Options): Promise<void>;
export declare function updateLocalCredentialsAsync(projectDir: string, platform: BuildCommandPlatform, trackingCtx: TrackingContext): Promise<void>;
export {};
