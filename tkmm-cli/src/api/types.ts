import type { TKMM_CLI_API_VERSION } from './constants';

export interface TkmmProjectContext {
    projectRoot: string;
    tkprojPath: string;
}

export interface TkmmCliRunOptions {
    /** CLI arguments after the executable, e.g. `['mods', 'package', tkproj, output]`. */
    args: string[];
    cwd?: string;
    onOutput?: (chunk: string) => void;
}

export interface TkmmCliRunResult {
    exitCode: number;
}

export interface TkmmPackageOptions {
    /** Project root directory or path to a `.tkproj` file. */
    projectPath: string;
    /** Destination `.tkcl` path. Required unless `promptForOutput` is true. */
    outputPath?: string;
    /** Show a save dialog when `outputPath` is omitted. Default false. */
    promptForOutput?: boolean;
    /** Save the `.tkproj` editor document if it is dirty. Default true. */
    saveTkprojFirst?: boolean;
    /** Append CLI output to the TKMM CLI output channel. Default false for API calls. */
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

/**
 * Public API returned from `activate()` for companion extensions.
 *
 * Obtain via:
 * `await vscode.extensions.getExtension(TKMM_CLI_EXTENSION_ID)?.activate()`
 *
 * @see docs/api/v1.md
 */
export interface TkmmCliApi {
    readonly apiVersion: typeof TKMM_CLI_API_VERSION;
    readonly extensionId: string;

    /** Resolved path to Tkmm.CLI, or undefined if not available on this platform. */
    getCliPath(): string | undefined;
    isCliAvailable(): boolean;

    resolveProjectContext(item?: unknown): Promise<TkmmProjectContext | undefined>;
    resolveProjectFromPath(projectPath: string): TkmmProjectContext | undefined;
    defaultTkclFileName(projectRoot: string): string;

    runCli(options: TkmmCliRunOptions): Promise<TkmmCliRunResult>;
    packageMod(options: TkmmPackageOptions): Promise<TkmmPackageResult | undefined>;

    showOutputChannel(): void;
}

export interface CreateTkmmCliApiDeps {
    getCliPath: () => string | undefined;
    resolveProjectContext: (item?: unknown) => Promise<TkmmProjectContext | undefined>;
    resolveProjectFromPath: (projectPath: string) => TkmmProjectContext | undefined;
    defaultTkclFileName: (projectRoot: string) => string;
    runCli: (options: TkmmCliRunOptions) => Promise<TkmmCliRunResult>;
    packageMod: (options: TkmmPackageOptions) => Promise<TkmmPackageResult | undefined>;
    showOutputChannel: () => void;
}
