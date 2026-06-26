import * as fs from 'fs';
import * as path from 'path';
import type { GameProfileRegistration } from './tkvscTypes';

export const SPLATOON3_GAME_ID = 'splatoon3';

export const SPLATOON3_ROMFS_SENTINEL = path.join('Pack', 'Bootup.Nin_NX_NVN.pack.zs');

export const SPLATOON3_ROMFS_SENTINEL_POSIX = 'Pack/Bootup.Nin_NX_NVN.pack.zs';

export const SPLATOON3_GAME_PROFILE: GameProfileRegistration = {
    id: SPLATOON3_GAME_ID,
    displayName: 'Splatoon 3',
    romfsSentinel: SPLATOON3_ROMFS_SENTINEL_POSIX,
    compressionBackend: 'plain-zstd-yaz0',
    romfsSettingsKey: 'splatoon3.romfsPath',
    indexing: {
        enableRomfsSearch: true,
        enableCanonicalPaths: false,
        archiveExtensions: [
            '.pack',
            '.sarc',
            '.genvb',
            '.blarc',
            '.bfarc',
            '.bntx',
            '.pack.zs',
            '.sarc.zs',
            '.genvb.zs',
            '.blarc.zs',
            '.bfarc.zs',
            '.bntx.zs',
        ],
    },
    archivePatterns: [
        '\\.(pack|sarc|genvb|blarc|bfarc|bntx)(\\.zs)?$',
    ],
};

export function splatoon3SentinelPath(romfsRoot: string): string {
    return path.join(romfsRoot, SPLATOON3_ROMFS_SENTINEL);
}

export function isSplatoon3RomfsPath(romfsRoot: string): boolean {
    if (!romfsRoot) {
        return false;
    }
    return fs.existsSync(splatoon3SentinelPath(romfsRoot));
}

/**
 * Accept a selected folder or a parent that contains one RomFS child directory.
 */
export function resolveSplatoon3RomfsRoot(selectedPath: string): string | undefined {
    const normalized = path.normalize(selectedPath);
    if (isSplatoon3RomfsPath(normalized)) {
        return normalized;
    }

    try {
        for (const entry of fs.readdirSync(normalized, { withFileTypes: true })) {
            if (!entry.isDirectory()) {
                continue;
            }
            const nested = path.join(normalized, entry.name);
            if (isSplatoon3RomfsPath(nested)) {
                return nested;
            }
        }
    } catch {
        return undefined;
    }

    return undefined;
}
