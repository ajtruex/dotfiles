import { BuildCommandPlatform, CommandContext, TrackingContext } from '../types';
export default function createCommandContextAsync({ requestedPlatform, profile, projectDir, trackingCtx, nonInteractive, skipCredentialsCheck, skipProjectConfiguration, }: {
    requestedPlatform: BuildCommandPlatform;
    profile: string;
    projectDir: string;
    trackingCtx: TrackingContext;
    nonInteractive?: boolean;
    skipCredentialsCheck?: boolean;
    skipProjectConfiguration?: boolean;
}): Promise<CommandContext>;
