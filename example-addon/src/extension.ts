import * as vscode from 'vscode';
import { getTkvscApi } from './getTkvscApi';
import { TKVSC_ARCHIVE_CONTEXT, TKVSC_VIEWS, type TkvscApi } from './tkvscTypes';

const OUTPUT_CHANNEL_NAME = 'TKVSC Example';

let api: TkvscApi | undefined;
let output: vscode.OutputChannel | undefined;

function log(message: string): void {
    output?.appendLine(message);
}

function isVerbose(): boolean {
    return vscode.workspace
        .getConfiguration('tkvscExample')
        .get<boolean>('enableVerboseLogging', false);
}

export async function activate(context: vscode.ExtensionContext): Promise<void> {
    output = vscode.window.createOutputChannel(OUTPUT_CHANNEL_NAME);
    context.subscriptions.push(output);

    api = await getTkvscApi();
    if (!api) {
        return;
    }

    log(`Connected to ${api.extensionId} (API v${api.apiVersion}).`);

    // Wait until TKVSC has registered the Projects tree (optional but recommended).
    api.onDidReady(() => {
        log('TKVSC onDidReady fired.');
        if (isVerbose()) {
            log(`  Project roots: ${api?.getProjectRoots().join(', ') || '(none)'}`);
            log(`  Active game: ${api?.getActiveGameProfile().displayName}`);
            log(`  Project adapters: ${api?.getProjectAdapters().map((a) => a.id).join(', ')}`);
        }
    });

    context.subscriptions.push(
        vscode.commands.registerCommand('tkvsc-example.showProjectInfo', async (treeItem) => {
            const tkvsc = await getTkvscApi();
            if (!tkvsc) {
                return;
            }

            const projectRoot = tkvsc.resolveProjectRoot(treeItem);
            if (!projectRoot) {
                void vscode.window.showWarningMessage(
                    'Run this command from a project root in the TKVSC Projects sidebar.',
                );
                return;
            }

            const adapter = tkvsc.detectProjectAdapter(projectRoot);
            const game = tkvsc.getActiveGameProfile();

            const message = [
                `Project: ${projectRoot}`,
                `Adapter: ${adapter.displayName} (${adapter.id})`,
                `Active game: ${game.displayName} (${game.id})`,
                `Compression: ${game.compressionBackend}`,
            ].join('\n');

            void vscode.window.showInformationMessage(
                `Project: ${projectRoot}`,
                { modal: true, detail: message },
            );
            log(`showProjectInfo:\n${message}`);
        }),
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('tkvsc-example.logApiStatus', async () => {
            const tkvsc = await getTkvscApi();
            if (!tkvsc) {
                return;
            }

            log('--- API status ---');
            log(`extensionId: ${tkvsc.extensionId}`);
            log(`views.archives: ${tkvsc.views.archives}`);
            log(`contextValues.archiveRoot: ${tkvsc.contextValues.archiveRoot}`);
            log(`project roots (${tkvsc.getProjectRoots().length}):`);
            for (const root of tkvsc.getProjectRoots()) {
                log(`  - ${root}`);
            }
            log(`active game: ${tkvsc.getActiveGameProfile().id}`);
            log(`python: ${tkvsc.getBridge().getPython() || '(not configured)'}`);
            output?.show(true);
        }),
    );

    // Example: use api.views / api.contextValues when building menu when-clauses in code.
    if (isVerbose()) {
        log(
            `Menu when example: view == ${TKVSC_VIEWS.archives} && viewItem == ${TKVSC_ARCHIVE_CONTEXT.archiveRoot}`,
        );
    }
}

export function deactivate(): void {
    api = undefined;
}
