import { BuildCommandPlatform, BuildStatus } from '../types';
interface BuildStatusOptions {
    platform: BuildCommandPlatform;
    buildId?: string;
    status?: BuildStatus;
}
declare function statusAction(projectDir: string, { platform, status, buildId }: BuildStatusOptions): Promise<void>;
export default statusAction;
