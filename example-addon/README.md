# TKVSC Example Addon

Starter template for companion extensions that extend [TKVSC](https://github.com/TKVSC-Team/totk-vscode).

**Copy this entire folder** when creating a new addon (e.g. `my-cool-addon/`), then rename the package, commands, and settings prefix.

## What this demonstrates

| Pattern | Where |
|---------|--------|
| `extensionDependencies` on core | `package.json` |
| Safe API acquisition + version guard | `src/getTkvscApi.ts` |
| `onDidReady` subscription | `src/extension.ts` |
| Context menu on project root | `package.json` menus + `resolveProjectRoot()` |
| Addon-specific settings | `tkvscExample.*` in `package.json` |
| Local API types (until `@tkvsc/api` npm) | `src/tkvscTypes.ts` |

## Prerequisites

1. [TKVSC](https://github.com/TKVSC-Team/totk-vscode) built or installed (`TKVSC-Team.totk-vscode`)
2. Node.js 18+

## Development (monorepo layout)

This repo expects core TKVSC as a sibling folder:

```
totk-vscode/           ← parent checkout folder
  totk-vscode/         ← TKVSC core extension
  tkvsc-addons/
    example-addon/     ← this extension
```

1. Build core TKVSC once: `cd ../totk-vscode && npm install && npm run compile`
2. Install addon deps: `npm install` (from `example-addon/` or the `tkvsc-addons` root)
3. Open **`example-addon`** as the VS Code workspace folder
4. Press **F5** — launches Extension Host with **both** TKVSC and this addon loaded

The launch config passes two `--extensionDevelopmentPath` entries (this addon + core).

## Try it

1. Add a TKMM project in TKVSC **Projects** sidebar
2. Right-click the project root → **TKVSC Example: Show Project Info**
3. Command Palette → **TKVSC Example: Log API Status**

Enable `tkvscExample.enableVerboseLogging` for extra output on startup.

## Creating a new addon from this template

1. Copy `example-addon/` to `your-addon-name/`
2. Update in `package.json`:
   - `name`, `displayName`, `description`
   - All `tkvsc-example.*` command IDs → `your-addon.*`
   - Settings prefix `tkvscExample` → `yourAddon`
3. Add the folder to the root `tkvsc-addons/package.json` `workspaces` array
4. Keep `extensionDependencies: ["TKVSC-Team.totk-vscode"]`
5. Sync `src/tkvscTypes.ts` with [docs/api/v1.md](https://github.com/TKVSC-Team/totk-vscode/blob/main/docs/api/v1.md) when the API changes

## Optional: declarative manifest

Add a `contributes.tkvsc` block to register formats without calling the API at runtime:

```json
"contributes": {
  "tkvsc": {
    "formats": [
      {
        "extensions": ["myext"],
        "handler": "myext",
        "language": "yaml",
        "editable": false
      }
    ],
    "bridgeHandlers": [
      {
        "kind": "myext",
        "modulePath": "./python/myext_io.py"
      }
    ]
  }
}
```

See the [TKVSC addon development guide](https://github.com/TKVSC-Team/totk-vscode/blob/main/docs/addon-development.md) and [API reference](https://github.com/TKVSC-Team/totk-vscode/blob/main/docs/api/v1.md).

## Next steps

| Goal | Start from |
|------|------------|
| TKMM CLI command on project root | This template + spawn bundled CLI in command handler |
| Custom binary editor (AINB, etc.) | Add `contributes.customEditors` + `readRawBytes` / `writeRawBytes` |
| Another game (Splatoon 3, BOTW) | Add `contributes.tkvsc` `gameProfile` + Python handlers |
| Different project layout | Implement `ProjectAdapter` and `registerProjectAdapter()` |
