declare function ensureGitRepoExistsAsync(): Promise<void>;
declare function ensureGitStatusIsCleanAsync(): Promise<void>;
declare class DirtyGitTreeError extends Error {
}
declare function makeProjectTarballAsync(tarPath: string): Promise<number>;
declare function reviewAndCommitChangesAsync(commitMessage: string, { nonInteractive }: {
    nonInteractive: boolean;
}): Promise<void>;
declare function modifyAndCommitAsync(callback: () => Promise<void>, { startMessage, successMessage, commitMessage, commitSuccessMessage, nonInteractive, }: {
    startMessage: string;
    successMessage: string;
    commitMessage: string;
    commitSuccessMessage: string;
    nonInteractive: boolean;
}): Promise<void>;
export { DirtyGitTreeError, ensureGitRepoExistsAsync, ensureGitStatusIsCleanAsync, makeProjectTarballAsync, reviewAndCommitChangesAsync, modifyAndCommitAsync, };
