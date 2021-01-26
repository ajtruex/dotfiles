import { Platform } from '@expo/eas-build-job';
import { EasConfig } from '../../../easJson';
import { BuilderContext, CommandContext } from '../types';
export default function createBuilderContext<T extends Platform>({ platform, easConfig, commandCtx, }: {
    platform: T;
    easConfig: EasConfig;
    commandCtx: CommandContext;
}): BuilderContext<T>;
