import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

const WINDOWS_CLI = 'Tkmm.CLI.exe';
const UNIX_CLI = 'Tkmm.CLI';

export function resolveCliPath(context: vscode.ExtensionContext): string | undefined {
    const override = vscode.workspace
        .getConfiguration('tkvscTkmmCli')
        .get<string>('cliPath', '')
        .trim();
    if (override) {
        return path.normalize(override);
    }

    const binDir = context.asAbsolutePath('bin');
    if (process.platform === 'win32') {
        return path.join(binDir, WINDOWS_CLI);
    }
    return path.join(binDir, UNIX_CLI);
}

export function describeMissingCli(platform: NodeJS.Platform): string {
    if (platform === 'win32') {
        return `Bundled TKMM CLI not found. Expected bin/${WINDOWS_CLI} or set tkvscTkmmCli.cliPath.`;
    }
    return `TKMM CLI for ${platform} is not bundled yet. Set tkvscTkmmCli.cliPath to your Tkmm.CLI binary.`;
}

export function runCli(
    cliPath: string,
    args: string[],
    options?: { cwd?: string; onOutput?: (chunk: string) => void },
): Promise<number> {
    return new Promise((resolve, reject) => {
        const child = spawn(cliPath, args, {
            cwd: options?.cwd,
            windowsHide: true,
        });

        child.stdout?.on('data', (data: Buffer) => {
            options?.onOutput?.(data.toString());
        });
        child.stderr?.on('data', (data: Buffer) => {
            options?.onOutput?.(data.toString());
        });
        child.on('error', reject);
        child.on('close', (code) => resolve(code ?? 1));
    });
}

export function runModsPackage(
    cliPath: string,
    projectRoot: string,
    outputPath: string,
    onOutput?: (chunk: string) => void,
): Promise<number> {
    return runCli(cliPath, ['mods', 'package', projectRoot, outputPath], {
        cwd: projectRoot,
        onOutput,
    });
}

export function defaultTkclFileName(projectRoot: string): string {
    const tkprojPath = path.join(projectRoot, '.tkproj');
    try {
        const raw = JSON.parse(fs.readFileSync(tkprojPath, 'utf8')) as {
            Mod?: { Name?: string };
        };
        const name = raw.Mod?.Name?.trim();
        if (name) {
            const safe = name.replace(/[<>:"/\\|?*\x00-\x1f]/g, '_').trim();
            if (safe) {
                return `${safe}.tkcl`;
            }
        }
    } catch {
        // fall through
    }
    return 'mod.tkcl';
}
