import { BuildCommandPlatform } from '../types';
interface BuildOptions {
    platform: BuildCommandPlatform;
    skipCredentialsCheck?: boolean;
    skipProjectConfiguration?: boolean;
    wait?: boolean;
    profile: string;
    parent?: {
        nonInteractive: boolean;
    };
}
declare function buildAction(projectDir: string, options: BuildOptions): Promise<void>;
export default buildAction;
