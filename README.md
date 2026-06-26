# tkvsc-addons

Official companion extensions for [TKVSC](https://github.com/TKVSC-Team/totk-vscode).

## Packages

| Folder                                  | Status       | Description                         |
| --------------------------------------- | ------------ | ----------------------------------- |
| [**example-addon**](example-addon/)     | **Template** | Copy this when starting a new addon |
| [tkmm-cli](tkmm-cli/)                   | Released     | TKMM CLI integration                |
| [splatoon3-support](splatoon3-support/) | Planned      | Splatoon 3 support                  |
| [botw-support](botw-support/)           | Planned      | Breath of the Wild support          |

Press **F5** inside `example-addon/` (see its README) to run against a sibling `totk-vscode` checkout.

## Documentation

- [TKVSC addon development guide](https://github.com/TKVSC-Team/totk-vscode/blob/main/docs/addon-development.md)
- [TKVSC API v1 reference](https://github.com/TKVSC-Team/totk-vscode/blob/main/docs/api/v1.md)

## Creating a new addon

1. Copy `example-addon/` to a new folder name
2. Add the folder to `workspaces` in this `package.json`
3. Implement your feature; keep `extensionDependencies` on `TKVSC-Team.totk-vscode`
