# Changelog

## API v1 (initial)

- `activate()` returns `TkmmCliApi`
- `getCliPath()` / `isCliAvailable()`
- `runCli()` — arbitrary CLI invocation
- `packageMod()` — `mods package` wrapper
- `resolveProjectContext()` — TKVSC tree item or active `.tkproj` editor
- `resolveProjectFromPath()` — project root or `.tkproj` path
- `defaultTkclFileName()`
- `showOutputChannel()`
- Bundled `bin/Tkmm.CLI.exe` (Windows); macOS/Linux via override or future bundles
- Setting `tkvscTkmmCli.cliPath`
