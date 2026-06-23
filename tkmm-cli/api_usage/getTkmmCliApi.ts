import * as vscode from 'vscode';
import {
    TKMM_CLI_API_VERSION,
    TKMM_CLI_EXTENSION_ID,
    type TkmmCliApi,
} from './tkmmCliTypes';

export async function getTkmmCliApi(
    options?: { silent?: boolean },
): Promise<TkmmCliApi | undefined> {
    const extension = vscode.extensions.getExtension(TKMM_CLI_EXTENSION_ID);
    if (!extension) {
        if (!options?.silent) {
            void vscode.window.showErrorMessage(
                'TKVSC TKMM CLI is not installed. Install TKVSC-Team.tkvsc-tkmm-cli.',
            );
        }
        return undefined;
    }

    const api = (await extension.activate()) as TkmmCliApi | undefined;
    if (!api) {
        if (!options?.silent) {
            void vscode.window.showErrorMessage('TKVSC TKMM CLI failed to activate.');
        }
        return undefined;
    }

    if (api.apiVersion !== TKMM_CLI_API_VERSION) {
        if (!options?.silent) {
            void vscode.window.showErrorMessage(
                `This extension requires TKMM CLI API v${TKMM_CLI_API_VERSION} (got v${api.apiVersion}).`,
            );
        }
        return undefined;
    }

    return api;
}
