export declare type Options = {
    appleIdPassword?: string;
    appleId?: string;
    teamId?: string;
};
declare type AppleCredentials = {
    appleIdPassword: string;
    appleId: string;
};
export declare type Team = {
    id: string;
    name?: string;
    inHouse?: boolean;
};
export declare type AppleCtx = {
    appleId: string;
    appleIdPassword: string;
    team: Team;
    fastlaneSession: string;
};
export declare function authenticate(options?: Options): Promise<AppleCtx>;
export declare function requestAppleIdCreds(options: Options): Promise<AppleCredentials>;
export {};
