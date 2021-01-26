import { BuildCommandPlatform } from '../types';
interface BuildOptions {
    platform?: BuildCommandPlatform;
    skipCredentialsCheck?: boolean;
    parent?: {
        nonInteractive: boolean;
    };
}
declare function initAction(projectDir: string, options: BuildOptions): Promise<void>;
export default initAction;
