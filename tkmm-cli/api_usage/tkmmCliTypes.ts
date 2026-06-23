/**
 * Minimal TKMM CLI API types for consumer extensions.
 *
 * Copy this file and `getTkmmCliApi.ts` into your addon until a shared npm package exists.
 * Keep in sync with tkmm-cli/docs/api/v1.md
 */

export const TKMM_CLI_EXTENSION_ID = 'TKVSC-Team.tkvsc-tkmm-cli';

export const TKMM_CLI_API_VERSION = 1 as const;

export interface TkmmProjectContext {
    projectRoot: string;
    tkprojPath: string;
}

export interface TkmmCliRunOptions {
    args: string[];
    cwd?: string;
    onOutput?: (chunk: string) => void;
}

export interface TkmmCliRunResult {
    exitCode: number;
}

export interface TkmmPackageOptions {
    projectPath: string;
    outputPath?: string;
    promptForOutput?: boolean;
    saveTkprojFirst?: boolean;
    showOutputChannel?: boolean;
    onOutput?: (chunk: string) => void;
}

export interface TkmmPackageResult {
    success: boolean;
    exitCode: number;
    projectRoot: string;
    tkprojPath: string;
    outputPath: string;
}

export interface TkmmCliApi {
    readonly apiVersion: typeof TKMM_CLI_API_VERSION;
    readonly extensionId: string;
    getCliPath(): string | undefined;
    isCliAvailable(): boolean;
    resolveProjectContext(item?: unknown): Promise<TkmmProjectContext | undefined>;
    resolveProjectFromPath(projectPath: string): TkmmProjectContext | undefined;
    defaultTkclFileName(projectRoot: string): string;
    runCli(options: TkmmCliRunOptions): Promise<TkmmCliRunResult>;
    packageMod(options: TkmmPackageOptions): Promise<TkmmPackageResult | undefined>;
    showOutputChannel(): void;
}
