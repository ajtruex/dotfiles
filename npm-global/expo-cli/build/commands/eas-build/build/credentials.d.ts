import { CredentialsProvider } from '../../../credentials/provider';
import { CredentialsSource, Workflow } from '../../../easJson';
export declare function ensureCredentialsAsync(provider: CredentialsProvider, workflow: Workflow, src: CredentialsSource, nonInteractive: boolean): Promise<CredentialsSource.LOCAL | CredentialsSource.REMOTE>;
