const esbuild = require('esbuild');

const watch = process.argv.includes('--watch');

async function main() {
    const ctx = await esbuild.context({
        entryPoints: ['src/extension.ts'],
        bundle: true,
        format: 'cjs',
        platform: 'node',
        outfile: 'dist/extension.js',
        external: ['vscode'],
        sourcemap: true,
        logLevel: 'info',
    });

    if (watch) {
        await ctx.watch();
        console.log('[watch] tkmm-cli');
    } else {
        await ctx.rebuild();
        await ctx.dispose();
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
