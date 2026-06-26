import * as vscode from 'vscode';
import {
    TKVSC_API_VERSION,
    TKVSC_EXTENSION_ID,
    type TkvscApi,
} from './tkvscTypes';

export async function getTkvscApi(
    options?: { silent?: boolean },
): Promise<TkvscApi | undefined> {
    const extension = vscode.extensions.getExtension(TKVSC_EXTENSION_ID);
    if (!extension) {
        if (!options?.silent) {
            void vscode.window.showErrorMessage(
                'TKVSC is not installed. Install TKVSC-Team.totk-vscode before using this addon.',
            );
        }
        return undefined;
    }

    const api = (await extension.activate()) as TkvscApi | undefined;
    if (!api) {
        if (!options?.silent) {
            void vscode.window.showErrorMessage('TKVSC failed to activate.');
        }
        return undefined;
    }

    if (api.apiVersion !== TKVSC_API_VERSION) {
        if (!options?.silent) {
            void vscode.window.showErrorMessage(
                `This addon requires TKVSC API v${TKVSC_API_VERSION} (got v${api.apiVersion}).`,
            );
        }
        return undefined;
    }

    return api;
}
