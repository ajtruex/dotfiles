import { ExpoConfig } from '@expo/config';
import { ApiV2, User } from '@expo/xdl';
import { AppleCtx } from '../appleApi';
import AndroidApi from './api/AndroidApi';
import IosApi from './api/IosApi';
export interface IView {
    open(ctx: Context): Promise<IView | null>;
}
interface AppleCtxOptions {
    appleId?: string;
    appleIdPassword?: string;
    teamId?: string;
}
interface CtxOptions extends AppleCtxOptions {
    allowAnonymous?: boolean;
    nonInteractive?: boolean;
}
export declare class Context {
    _hasProjectContext: boolean;
    _projectDir?: string;
    _user?: User;
    _manifest?: ExpoConfig;
    _apiClient?: ApiV2;
    _iosApiClient?: IosApi;
    _androidApiClient?: AndroidApi;
    _appleCtxOptions?: AppleCtxOptions;
    _appleCtx?: AppleCtx;
    _nonInteractive?: boolean;
    get nonInteractive(): boolean;
    get user(): User;
    get hasProjectContext(): boolean;
    get projectDir(): string;
    get manifest(): ExpoConfig;
    get api(): ApiV2;
    get android(): AndroidApi;
    get ios(): IosApi;
    get appleCtx(): AppleCtx;
    set manifest(value: ExpoConfig);
    hasAppleCtx(): boolean;
    ensureAppleCtx(): Promise<void>;
    logOwnerAndProject(): void;
    init(projectDir: string, options?: CtxOptions): Promise<void>;
}
export {};
