import * as vscode from 'vscode';
import {
    resolveSplatoon3RomfsRoot,
    SPLATOON3_GAME_ID,
    SPLATOON3_GAME_PROFILE,
    SPLATOON3_ROMFS_SENTINEL,
} from './gameProfile';
import { getTkvscApi } from './getTkvscApi';

const ROMFS_SETTINGS_KEY = 'splatoon3.romfsPath';
const SENTINEL_DISPLAY = SPLATOON3_ROMFS_SENTINEL.replace(/\\/g, '/');

export async function activate(context: vscode.ExtensionContext): Promise<void> {
    const api = await getTkvscApi();
    if (!api) {
        return;
    }

    // Register via API so the profile exists even when core's initial manifest
    // scan ran before this extension was visible (common in dev / VSIX load order).
    context.subscriptions.push(api.registerGameProfile(SPLATOON3_GAME_PROFILE));

    if (!api.getGameProfile(SPLATOON3_GAME_ID)) {
        void vscode.window.showErrorMessage(
            'TKVSC Splatoon 3: failed to register the splatoon3 game profile.',
        );
        return;
    }

    context.subscriptions.push(
        vscode.commands.registerCommand('tkvsc-splatoon3.setGameDump', async () => {
            await setSplatoon3GameDump();
        }),
    );
}

async function setSplatoon3GameDump(): Promise<void> {
    const folderUri = await vscode.window.showOpenDialog({
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: false,
        openLabel: 'Select Splatoon 3 RomFS Folder',
        title: 'Select Splatoon 3 game dump',
    });
    if (!folderUri?.[0]) {
        return;
    }

    const resolved = resolveSplatoon3RomfsRoot(folderUri[0].fsPath);
    if (!resolved) {
        void vscode.window.showWarningMessage(
            `The selected folder must contain "${SENTINEL_DISPLAY}".`,
            { modal: true },
        );
        return;
    }

    const config = vscode.workspace.getConfiguration('TKVSC');
    await config.update(ROMFS_SETTINGS_KEY, resolved, vscode.ConfigurationTarget.Global);
    await config.update('activeGameId', SPLATOON3_GAME_ID, vscode.ConfigurationTarget.Global);

    void vscode.window.showInformationMessage(
        `Splatoon 3 game dump set to ${resolved}`,
    );
}

export function deactivate(): void {
    // no-op
}
