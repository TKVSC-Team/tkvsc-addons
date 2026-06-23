import * as fs from 'fs';
import {
    TKMM_CLI_API_VERSION,
    TKMM_CLI_EXTENSION_ID,
} from './constants';
import type { CreateTkmmCliApiDeps, TkmmCliApi } from './types';

export { TKMM_CLI_API_VERSION, TKMM_CLI_EXTENSION_ID } from './constants';
export type {
    TkmmCliApi,
    TkmmCliRunOptions,
    TkmmCliRunResult,
    TkmmPackageOptions,
    TkmmPackageResult,
    TkmmProjectContext,
} from './types';

export function createTkmmCliApi(deps: CreateTkmmCliApiDeps): TkmmCliApi {
    return {
        apiVersion: TKMM_CLI_API_VERSION,
        extensionId: TKMM_CLI_EXTENSION_ID,
        getCliPath: deps.getCliPath,
        isCliAvailable: () => {
            const cliPath = deps.getCliPath();
            return Boolean(cliPath && fs.existsSync(cliPath));
        },
        resolveProjectContext: deps.resolveProjectContext,
        resolveProjectFromPath: deps.resolveProjectFromPath,
        defaultTkclFileName: deps.defaultTkclFileName,
        runCli: deps.runCli,
        packageMod: deps.packageMod,
        showOutputChannel: deps.showOutputChannel,
    };
}
