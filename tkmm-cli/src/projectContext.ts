import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import type { TkmmPackageOptions, TkmmPackageResult, TkmmProjectContext } from './api/types';
import { getTkvscApi } from './getTkvscApi';
import { defaultTkclFileName, describeMissingCli, resolveCliPath, runCli, runModsPackage } from './tkmmCli';

export type { TkmmProjectContext };

function fromTkprojPath(tkprojPath: string): TkmmProjectContext | undefined {
    const normalized = path.normalize(tkprojPath);
    if (!normalized.toLowerCase().endsWith('.tkproj') || !fs.existsSync(normalized)) {
        return undefined;
    }
    return {
        projectRoot: path.dirname(normalized),
        tkprojPath: normalized,
    };
}

function fromProjectRoot(projectRoot: string): TkmmProjectContext | undefined {
    const tkprojPath = path.join(projectRoot, '.tkproj');
    if (!fs.existsSync(tkprojPath)) {
        return undefined;
    }
    return { projectRoot, tkprojPath };
}

function resolveItemUri(item: unknown): vscode.Uri | undefined {
    if (item instanceof vscode.Uri) {
        return item;
    }
    if (!item || typeof item !== 'object') {
        return undefined;
    }
    const candidate = item as { resourceUri?: vscode.Uri };
    return candidate.resourceUri?.fsPath ? candidate.resourceUri : undefined;
}

export async function resolvePackageContext(item?: unknown): Promise<TkmmProjectContext | undefined> {
    const resourceUri = resolveItemUri(item);
    if (resourceUri) {
        const fromFile = fromTkprojPath(resourceUri.fsPath);
        if (fromFile) {
            return fromFile;
        }

        const tkvsc = await getTkvscApi({ silent: true });
        const projectRoot = tkvsc?.resolveProjectRoot(item);
        if (projectRoot) {
            return fromProjectRoot(projectRoot);
        }
    }

    const activeDoc = vscode.window.activeTextEditor?.document;
    if (activeDoc?.uri.fsPath.toLowerCase().endsWith('.tkproj')) {
        return fromTkprojPath(activeDoc.uri.fsPath);
    }

    return undefined;
}

export function resolveProjectFromPath(projectPath: string): TkmmProjectContext | undefined {
    const normalized = path.normalize(projectPath);
    if (normalized.toLowerCase().endsWith('.tkproj')) {
        return fromTkprojPath(normalized);
    }
    return fromProjectRoot(normalized);
}

export async function saveTkprojIfDirty(tkprojPath: string): Promise<void> {
    const active = vscode.window.activeTextEditor?.document;
    if (active?.uri.fsPath === tkprojPath && active.isDirty) {
        await active.save();
    }
}

export interface PackageServiceDeps {
    context: vscode.ExtensionContext;
    log: (message: string) => void;
    showOutput: (show: boolean) => void;
}

export async function packageMod(
    deps: PackageServiceDeps,
    options: TkmmPackageOptions,
): Promise<TkmmPackageResult | undefined> {
    const project = resolveProjectFromPath(options.projectPath);
    if (!project) {
        throw new Error(`No .tkproj found at or under: ${options.projectPath}`);
    }

    const cliPath = resolveCliPath(deps.context);
    if (!cliPath || !fs.existsSync(cliPath)) {
        throw new Error(describeMissingCli(process.platform));
    }

    let outputPath = options.outputPath;
    if (!outputPath && options.promptForOutput) {
        const defaultName = defaultTkclFileName(project.projectRoot);
        const saveUri = await vscode.window.showSaveDialog({
            defaultUri: vscode.Uri.file(path.join(project.projectRoot, defaultName)),
            filters: { 'TKMM Package': ['tkcl'] },
            saveLabel: 'Package',
            title: 'Package mod as TKCL',
        });
        if (!saveUri) {
            return undefined;
        }
        outputPath = saveUri.fsPath;
    }

    if (!outputPath) {
        throw new Error('outputPath is required unless promptForOutput is true.');
    }

    if (options.saveTkprojFirst !== false) {
        await saveTkprojIfDirty(project.tkprojPath);
    }

    if (options.showOutputChannel) {
        deps.showOutput(true);
    }

    deps.log(`--- Package ${path.basename(project.projectRoot)} ---`);
    deps.log(`CLI: ${cliPath}`);
    deps.log(`Project root: ${project.projectRoot}`);
    deps.log(`Output: ${outputPath}`);

    const onOutput = (chunk: string) => {
        options.onOutput?.(chunk);
        if (options.showOutputChannel) {
            deps.log(chunk);
        }
    };

    const exitCode = await runModsPackage(cliPath, project.projectRoot, outputPath, onOutput);

    return {
        success: exitCode === 0,
        exitCode,
        projectRoot: project.projectRoot,
        tkprojPath: project.tkprojPath,
        outputPath,
    };
}

export function createRunCliHandler(context: vscode.ExtensionContext) {
    return async (options: { args: string[]; cwd?: string; onOutput?: (chunk: string) => void }) => {
        const cliPath = resolveCliPath(context);
        if (!cliPath || !fs.existsSync(cliPath)) {
            throw new Error(describeMissingCli(process.platform));
        }
        const exitCode = await runCli(cliPath, options.args, {
            cwd: options.cwd,
            onOutput: options.onOutput,
        });
        return { exitCode };
    };
}
