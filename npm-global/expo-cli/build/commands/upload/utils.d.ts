export declare function runFastlaneAsync(program: string, args: any, { appleId, appleIdPassword, appleTeamId, itcTeamId, companyName, }: {
    appleId?: string;
    appleIdPassword?: string;
    appleTeamId?: string;
    itcTeamId?: string;
    companyName?: string;
}, pipeToLogger?: boolean): Promise<{
    [key: string]: any;
}>;
