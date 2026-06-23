# TKVSC TKMM CLI

Companion extension that bundles **Tkmm.CLI** and exposes a **consumer API** for other TKVSC addons.

## Usage
Configure your game paths within the TKMM Desktop App before using the plugin!

## Documentation

| Document | Description |
|----------|-------------|
| **[docs/api/README.md](docs/api/README.md)** | API index and quick start |
| **[docs/api/v1.md](docs/api/v1.md)** | Complete API reference |
| [docs/api/CHANGELOG.md](docs/api/CHANGELOG.md) | API version history |

## Features

- **Package as TKCL** - title bar button in the `.tkproj` editor + Projects sidebar context menu
- **API** - other extensions use `getTkmmCliApi()` instead of bundling `bin/Tkmm.CLI`

## API quick start

1. Add to `package.json`:

```json
"extensionDependencies": [
  "TKVSC-Team.totk-vscode",
  "TKVSC-Team.tkvsc-tkmm-cli"
]
```

2. Copy [`api_usage/tkmmCliTypes.ts`](api_usage/tkmmCliTypes.ts) and [`api_usage/getTkmmCliApi.ts`](api_usage/getTkmmCliApi.ts) into your addon.

3. Call the API:

```typescript
const tkmm = await getTkmmCliApi();
await tkmm?.packageMod({ projectPath: root, outputPath: outTkcl });
```

See **[docs/api/v1.md](docs/api/v1.md)** for `runCli()`, project resolution, error handling, and TKVSC integration.

## Bundled CLI

| Platform | Binary |
|----------|--------|
| Windows | `bin/Tkmm.CLI.exe` |
| macOS / Linux | `bin/Tkmm.CLI` (add when available) |

Override with `tkvscTkmmCli.cliPath`.

## Development

1. Build core TKVSC: `cd ../../totk-vscode && npm run compile`
2. `npm install && npm run compile` in this folder
3. Open this folder in VS Code and press **F5**

## Built-in command

`tkvsc-tkmm-cli.packageAsTkcl` runs:

```text
Tkmm.CLI mods package <projectRoot> <output.tkcl>
```
