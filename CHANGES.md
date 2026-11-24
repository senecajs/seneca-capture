# Changes

## 0.7.0 2026-11-21

First entry of this change log. Earlier versions are on npm and in the git
history.

* Seneca 4: the peer dependency is `seneca` `^4.0.0` (was
  `>=3||>=4.0.0-rc2`). Seneca 3 users stay on `@seneca/capture@0.6`.
* The entity peer dependency is `@seneca/entity` `^29.0.0` (was
  `seneca-entity` `>=26`). The old peer made npm install `seneca-entity` 28,
  which stops a Seneca 4 process at startup with `plugin_gubu_shape`. Load the
  entity plugin by its full name: `seneca.use('@seneca/entity')`.
* The `seneca-promisify` peer dependency is removed. Seneca 4 has promises
  built in; do not call `use('promisify')` (D4).
* `@seneca/entity-util` is no longer a runtime dependency: only the tests use
  it, as a development dependency at `^4.0.0`.
* Failed actions are captured from the `act-err` event only; the Seneca 3
  `act-err-4` branch is removed (D3).
* Node.js 24 or later (`engines.node` `>=24`, was `>=14`).
* The package no longer ships stale build output from the template
  (`dist/error*`, `dist/refer*`, `dist/github-provider*`,
  `dist/GithubProvider-doc*`).
* Tests run on Seneca 4 with `@seneca/entity` 29 and `@seneca/entity-util` 4,
  load them by their full names (B14) and no longer use `promisify`.
  devDependencies: `seneca` `^4.0.0`, `@seneca/entity` `^29.0.0`,
  `@seneca/entity-util` `^4.0.0` and `@seneca/doc` `^9.0.0` (was
  `seneca-doc`); the unused `@seneca/maintain` is removed. The build workflow
  no longer installs an unversioned `seneca`.
* `repository.url` uses `git+https`, `publishConfig` sets public access, and
  the package includes `CHANGES.md`.
