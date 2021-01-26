import { ExpoConfig } from '@expo/config';
export default function getConfigurationOptionsAsync(projectDir: string): Promise<{
    exp: ExpoConfig;
    username: string | null;
}>;
