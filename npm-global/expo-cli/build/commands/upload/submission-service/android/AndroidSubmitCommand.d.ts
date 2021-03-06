import { SubmissionMode } from '../types';
import { AndroidSubmissionContext, AndroidSubmitCommandOptions } from './types';
declare class AndroidSubmitCommand {
    private ctx;
    static createContext(mode: SubmissionMode, projectDir: string, commandOptions: AndroidSubmitCommandOptions): AndroidSubmissionContext;
    constructor(ctx: AndroidSubmissionContext);
    runAsync(): Promise<void>;
    private getAndroidSubmissionOptions;
    private resolveAndroidPackageSource;
    private resolveTrack;
    private resolveReleaseStatus;
    private resolveArchiveSource;
    private resolveArchiveFileSource;
    private resolveArchiveTypeSource;
    private resolveServiceAccountSource;
}
export default AndroidSubmitCommand;
