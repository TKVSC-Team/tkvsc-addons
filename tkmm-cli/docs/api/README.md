# TKMM CLI Addon API Documentation

Programmatic API for companion VS Code extensions that use the bundled **Tkmm.CLI** without shipping their own copy.

## DISCLAIMER
Documentation for this plugin was written using AI, based on the codebase. Docs will be updated upon the release of TKVSC 1.0.0.

| Document | Description |
|----------|-------------|
| **[v1.md](v1.md)** | **Complete API reference** (current) |
| [CHANGELOG.md](CHANGELOG.md) | API version history |

**Extension ID:** `TKVSC-Team.tkvsc-tkmm-cli`  
**Current API version:** `1` (`api.apiVersion`)

## Quick links

- Consumer helper files to copy: [`consumer/tkmmCliTypes.ts`](../../consumer/tkmmCliTypes.ts), [`consumer/getTkmmCliApi.ts`](../../consumer/getTkmmCliApi.ts)
- Source of truth for types: [`src/api/types.ts`](../../src/api/types.ts), [`src/api/constants.ts`](../../src/api/constants.ts)
- Requires TKVSC for project-tree resolution: [TKVSC API v1](https://github.com/TKVSC-Team/totk-vscode/blob/main/docs/api/v1.md)

## Minimal example

```json
"extensionDependencies": [
  "TKVSC-Team.totk-vscode",
  "TKVSC-Team.tkvsc-tkmm-cli"
]
```

```typescript
import { getTkmmCliApi } from './getTkmmCliApi';

const tkmm = await getTkmmCliApi();
if (!tkmm?.isCliAvailable()) return;

await tkmm.packageMod({
  projectPath: projectRoot,
  outputPath: `${projectRoot}/MyMod.tkcl`,
});
```

See **[v1.md](v1.md)** for the full reference.
