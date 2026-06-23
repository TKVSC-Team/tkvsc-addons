/**
 * Minimal TKVSC API types for addon development.
 *
 * Until `@tkvsc/api` is published, keep this file in sync with:
 * https://github.com/TKVSC-Team/totk-vscode/blob/main/docs/api/v1.md
 *
 * Monorepo tip: you can replace this with path imports to totk-vscode/src/api
 * while developing locally.
 */
import type * as vscode from 'vscode';

export const TKVSC_EXTENSION_ID = 'TKVSC-Team.totk-vscode';

export const TKVSC_API_VERSION = 1 as const;

export const TKVSC_VIEWS = {
    archives: 'totk-editor.archives',
    gameDump: 'totk-editor.gameDump',
    gameDumpSearch: 'totk-editor.gameDumpSearch',
} as const;

export const TKVSC_ARCHIVE_CONTEXT = {
    archiveRoot: 'archiveRoot',
    archiveProjectDir: 'archiveProjectDir',
    archiveProjectDirActive: 'archiveProjectDirActive',
    archiveDir: 'archiveDir',
    archiveVirtualDir: 'archiveVirtualDir',
    archiveFile: 'archiveFile',
    archiveVirtualFile: 'archiveVirtualFile',
    archivePackage: 'archivePackage',
    tkmmOptionsRoot: 'tkmmOptionsRoot',
    tkmmOptionGroup: 'tkmmOptionGroup',
    tkmmOption: 'tkmmOption',
    tkmmOptionActive: 'tkmmOptionActive',
} as const;

export interface TkvscBridgeAccess {
    bridgePath: string;
    getPython(): string;
    getBridgeEnv(): NodeJS.ProcessEnv;
    runBridgeJsonAsync<T>(
        pythonExecutable: string,
        bridgePath: string,
        args: string[],
        stdin?: string,
        env?: NodeJS.ProcessEnv,
    ): Promise<T>;
}

export interface TkvscApi {
    readonly apiVersion: typeof TKVSC_API_VERSION;
    readonly extensionId: string;
    readonly views: typeof TKVSC_VIEWS;
    readonly contextValues: typeof TKVSC_ARCHIVE_CONTEXT;
    readonly onDidReady: vscode.Event<void>;
    resolveProjectRoot(item: unknown): string | undefined;
    readRawBytes(uri: vscode.Uri): Promise<Uint8Array>;
    writeRawBytes(uri: vscode.Uri, data: Uint8Array): Promise<void>;
    getBridge(): TkvscBridgeAccess;
    getProjectRoots(): string[];
    registerFormatHandler(registration: {
        extensions: string[];
        handler: string;
        language?: string;
        editable?: boolean;
    }): vscode.Disposable;
    registerBridgeHandler(registration: {
        kind: string;
        modulePath: string;
        readFunction?: string;
        writeFunction?: string;
    }): vscode.Disposable;
    registerGameProfile(registration: {
        id: string;
        displayName: string;
        romfsSentinel: string;
        compressionBackend: string;
        romfsSettingsKey?: string;
    }): vscode.Disposable;
    getActiveGameProfile(): {
        id: string;
        displayName: string;
        compressionBackend: string;
    };
    getGameProfile(gameId: string): { id: string } | undefined;
    registerProjectAdapter(adapter: unknown): vscode.Disposable;
    detectProjectAdapter(projectRootPath: string): { id: string; displayName: string };
    getProjectAdapters(): Array<{ id: string; displayName: string }>;
}
