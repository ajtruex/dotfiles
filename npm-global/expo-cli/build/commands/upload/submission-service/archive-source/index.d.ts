import { ArchiveType } from '../android/AndroidSubmissionConfig';
import { SubmissionMode } from '../types';
import { ArchiveFileSource, ArchiveFileSourceType } from './ArchiveFileSource';
import { ArchiveTypeSource, ArchiveTypeSourceType } from './ArchiveTypeSource';
export interface ArchiveSource {
    archiveFile: ArchiveFileSource;
    archiveType: ArchiveTypeSource;
}
export interface Archive {
    location: string;
    type: ArchiveType;
}
declare function getArchiveAsync(mode: SubmissionMode, source: ArchiveSource): Promise<Archive>;
export { ArchiveFileSource, ArchiveTypeSourceType, ArchiveTypeSource, ArchiveFileSourceType, getArchiveAsync, };
