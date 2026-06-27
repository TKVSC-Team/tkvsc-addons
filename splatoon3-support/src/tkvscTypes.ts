/**
 * Minimal TKVSC API types for addon development.
 * Keep in sync with totk-vscode/docs/api/v1.md
 */
import type * as vscode from 'vscode';

export const TKVSC_EXTENSION_ID = 'TKVSC-Team.totk-vscode';
export const TKVSC_API_VERSION = 1 as const;

export interface GameIndexingConfig {
    enableRomfsSearch?: boolean;
    enableCanonicalPaths?: boolean;
    archiveExtensions?: string[];
}

export interface GameProfileRegistration {
    id: string;
    displayName: string;
    romfsSentinel: string;
    compressionBackend: string;
    romfsSettingsKey?: string;
    legacyRomfsSettingsKeys?: string[];
    indexing?: GameIndexingConfig;
    archivePatterns?: string[];
    /** MSBT tag definitions (.gcf), relative to the registering addon root. */
    msbtConfigPath?: string;
}

export interface GameProfile extends GameProfileRegistration {
    source: 'builtin' | 'manifest' | 'api';
    msbtConfigResolvedPath?: string;
}

export interface TkvscApi {
    readonly apiVersion: typeof TKVSC_API_VERSION;
    readonly extensionId: string;
    readonly onDidReady: vscode.Event<void>;
    registerGameProfile(
        registration: GameProfileRegistration,
        options?: { extensionRoot?: string },
    ): vscode.Disposable;
    getActiveGameProfile(): GameProfile;
    getGameProfile(gameId: string): GameProfile | undefined;
}
