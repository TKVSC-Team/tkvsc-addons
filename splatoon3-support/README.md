# TKVSC Splatoon 3 Support

Registers **Splatoon 3** as a TKVSC game profile so RomFS dumps can be validated and browsed through core TKVSC.

## What this addon does (v0)

- Declares the `splatoon3` game profile via `contributes.tkvsc`
- Validates dumps using the ModuleSystem sentinel: `Pack/Bootup.Nin_NX_NVN.pack.zs`
- Sets `TKVSC.splatoon3.romfsPath` and switches `TKVSC.activeGameId` to `splatoon3`

## Setup

1. Install [TKVSC](https://github.com/TKVSC-Team/totk-vscode) and this extension
2. Command Palette → **Splatoon 3: Set Game Dump Path**
3. Select your extracted RomFS folder (or a parent folder containing it)
4. You can freely switch between games at any time in settings

TKVSC checks for `Pack/Bootup.Nin_NX_NVN.pack.zs` under the chosen path. This file is present on ModuleSystem titles (including Splatoon 3).

## Settings

| Setting | Description |
|---------|-------------|
| `TKVSC.splatoon3.romfsPath` | Path to the Splatoon 3 RomFS dump |
| `TKVSC.activeGameId` | Set to `splatoon3` automatically by the setup command |

## Game profile

| Field | Value |
|-------|--------|
| `id` | `splatoon3` |
| `romfsSentinel` | `Pack/Bootup.Nin_NX_NVN.pack.zs` |
| `compressionBackend` | `plain-zstd-yaz0` |
| `indexing.enableCanonicalPaths` | `false` |

## Development

```bash
npm install
npm run compile
```

Open this folder in VS Code and press **F5** (loads this addon + sibling `../../totk-vscode`).

## Future work

- Splatoon-specific file formats and bridge handlers
- Custom editors / grammars
- Per-project game selection (when core supports it)
