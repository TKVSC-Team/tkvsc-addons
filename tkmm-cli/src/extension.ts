import * as vscode from 'vscode';
import { createTkmmCliApi, type TkmmCliApi } from './api';
import { getTkvscApi } from './getTkvscApi';
import { defaultTkclFileName, resolveCliPath } from './tkmmCli';
import {
    createRunCliHandler,
    packageMod,
    resolvePackageContext,
    resolveProjectFromPath,
} from './projectContext';

const OUTPUT_CHANNEL_NAME = 'TKMM CLI';

let output: vscode.OutputChannel | undefined;

function log(message: string): void {
    const line = message.endsWith('\n') ? message : `${message}\n`;
    output?.append(line);
}

export async function activate(context: vscode.ExtensionContext): Promise<TkmmCliApi> {
    output = vscode.window.createOutputChannel(OUTPUT_CHANNEL_NAME);
    context.subscriptions.push(output);

    const packageDeps = {
        context,
        log,
        showOutput: (show: boolean) => {
            if (show) {
                output?.show(true);
            }
        },
    };

    const api = createTkmmCliApi({
        getCliPath: () => resolveCliPath(context),
        resolveProjectContext: (item) => resolvePackageContext(item),
        resolveProjectFromPath,
        defaultTkclFileName,
        runCli: createRunCliHandler(context),
        packageMod: (options) => packageMod(packageDeps, options),
        showOutputChannel: () => output?.show(true),
    });

    const tkvsc = await getTkvscApi({ silent: true });
    if (tkvsc) {
        log(`Connected to ${tkvsc.extensionId} (API v${tkvsc.apiVersion}).`);
    }

    context.subscriptions.push(
        vscode.commands.registerCommand('tkvsc-tkmm-cli.packageAsTkcl', async (item) => {
            const project = await api.resolveProjectContext(item);
            if (!project) {
                void vscode.window.showWarningMessage(
                    'Package as TKCL requires a TKMM project with a .tkproj file. Open a project in TKVSC or the .tkproj editor.',
                );
                return;
            }

            try {
                const result = await api.packageMod({
                    projectPath: project.projectRoot,
                    promptForOutput: true,
                    showOutputChannel: true,
                });
                if (!result) {
                    return;
                }
                if (result.success) {
                    void vscode.window.showInformationMessage(`Packaged TKCL: ${result.outputPath}`);
                    log('Package completed successfully.');
                } else {
                    void vscode.window.showErrorMessage(
                        `TKMM CLI failed (exit ${result.exitCode}). See the ${OUTPUT_CHANNEL_NAME} output for details.`,
                    );
                    log(`Package failed with exit code ${result.exitCode}.`);
                }
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                void vscode.window.showErrorMessage(message);
                log(message);
            }
        }),
    );

    return api;
}

export function deactivate(): void {
    output = undefined;
}
