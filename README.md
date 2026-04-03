# autosteerplus

`autosteerplus` is a Capacitor + Vue application that turns the published `https://fsd.teslaandroid.com` portal into:

- a native iOS app with a Bluetooth bridge
- a hosted web fork with onboarding, docs, and FAQ pages
- a cleaner Vue/Konsta UI around the original portal behavior

The core goal is simple: keep the working portal flow, but make it usable inside the Capacitor ecosystem and easier to understand for real users.

## What This Project Does

This repository packages the original portal workflow into a maintained app shell.

It includes:

- a Vue 3 portal UI split into focused components
- a shared reactive state model for the portal
- a Capacitor-native Web Bluetooth compatibility shim backed by `@capacitor-community/bluetooth-le`
- a runtime fetch/session bridge so the app can keep talking to the live backend
- onboarding, docs, and FAQ flows on top of the original portal
- a Cloudflare Workers static deploy config for the web fork

The hosted web experience is a fork of `fsd.teslaandroid.com`. The native app is the preferred experience on iPhone because it can bridge Bluetooth directly through Capacitor.

## Stack

- `Vue 3`
- `TypeScript`
- `Vite`
- `Konsta UI` with iOS styling
- `Capacitor 8`
- `@capacitor-community/bluetooth-le`
- `Wrangler 4` for web deployment

Package management and scripts use `bun`.

## How It Works

There are two runtime modes:

1. Native app mode

- Runs inside Capacitor
- Installs a Web Bluetooth shim onto `navigator.bluetooth`
- Forwards the portal BLE calls to the native Bluetooth LE plugin
- Bootstraps backend session/cookie handling for the portal

2. Web mode

- Runs as a plain Vite site / Cloudflare static site
- Keeps the docs, onboarding, FAQ, and portal UI available
- Does **not** get the native Capacitor Bluetooth bridge
- Requires a Web Bluetooth compatible browser for Bluetooth features

On desktop Chrome and Android Chrome, Web Bluetooth can work directly.

On iPhone and iPad:

- Safari does not expose Web Bluetooth
- users should use the native `autosteerplus` app
- or use [Bluefy](https://apps.apple.com/app/id1492822055) for the hosted web fork

## Main App Flows

The app currently exposes these main views:

- `#/home`
  Dashboard / portal home
- `#/docs`
  Product guidance, benefits, install verification, speed profile mapping
- `#/onboarding`
  Guided install flow with model/year/version checks and install videos
- `#/faq`
  Community-sourced operational FAQ

The dashboard is intentionally simplified when the device is not connected:

- disconnected users see a connect-first state
- runtime status / OTA / control panels stay hidden until a device is connected
- advanced tools only show when they are actually relevant

## Repository Layout

High-value files and directories:

- [package.json](/Users/martindonadieu/Projects/autosteerplus/package.json)
  Scripts and dependency definitions
- [capacitor.config.ts](/Users/martindonadieu/Projects/autosteerplus/capacitor.config.ts)
  Capacitor configuration and Bluetooth display strings
- [wrangler.jsonc](/Users/martindonadieu/Projects/autosteerplus/wrangler.jsonc)
  Cloudflare Workers static deployment config for `asp.tslap.store`
- [src/main.ts](/Users/martindonadieu/Projects/autosteerplus/src/main.ts)
  App bootstrap and native/web environment setup
- [src/runtime/portal-session.ts](/Users/martindonadieu/Projects/autosteerplus/src/runtime/portal-session.ts)
  Session/bootstrap/fetch bridge logic
- [src/runtime/web-bluetooth-shim.ts](/Users/martindonadieu/Projects/autosteerplus/src/runtime/web-bluetooth-shim.ts)
  Native Web Bluetooth compatibility layer
- [src/features/portal/controller.ts](/Users/martindonadieu/Projects/autosteerplus/src/features/portal/controller.ts)
  Preserved portal behavior and orchestration logic
- [src/features/portal/view-model.ts](/Users/martindonadieu/Projects/autosteerplus/src/features/portal/view-model.ts)
  Shared reactive UI state and actions
- [src/features/portal/components](/Users/martindonadieu/Projects/autosteerplus/src/features/portal/components)
  Componentized portal pages and panels
- [src/features/portal/styles.css](/Users/martindonadieu/Projects/autosteerplus/src/features/portal/styles.css)
  Shared portal styling
- [src/features/portal/theme.css](/Users/martindonadieu/Projects/autosteerplus/src/features/portal/theme.css)
  Konsta/Tailwind theme entrypoint

## Local Development

Install dependencies:

```bash
bun install
```

Start the web dev server:

```bash
bun run dev
```

Type-check:

```bash
bun run typecheck
```

Build the app:

```bash
bun run build
```

Preview the built web bundle:

```bash
bun run preview
```

## iOS Development

Sync web assets into Capacitor and apply the iOS fixes:

```bash
bun run cap:sync
```

Open the iOS project:

```bash
bun run ios:open
```

Important notes:

- the iOS simulator can render the UI, but it cannot validate real CoreBluetooth behavior
- BLE testing must be done on a physical iPhone
- the app relies on the live backend, so session/auth/API behavior still depends on the published service

## Web Deployment

The repo includes a Cloudflare Workers static-assets deploy config for:

- `asp.tslap.store`

Deploy the web fork:

```bash
bun run deploy:web
```

That command:

1. builds the Vite app
2. deploys `dist/` with Wrangler
3. publishes the worker route configured in `wrangler.jsonc`

Current config uses:

- account id `9ee3d7479a3c359681e3fab2c8cb22c0`
- custom domain route `asp.tslap.store`
- SPA-style asset fallback

If the deploy succeeds but the domain returns `NXDOMAIN`, the worker is published but the hostname is still missing in DNS/custom-domain provisioning for the `tslap.store` zone. That is a Cloudflare zone-side issue, not a Vite build issue.

## Bluetooth Behavior

The portal BLE flow depends on `navigator.bluetooth.requestDevice(...)`.

This project supports that in two different ways:

- native Capacitor app:
  bridged to `@capacitor-community/bluetooth-le`
- compatible web browser:
  real browser Web Bluetooth

If Bluetooth is not available:

- the app explains that the browser is unsupported
- on iPhone/iPad, users should switch to the native app or Bluefy

## Portal Features Added In This Fork

Compared to the original portal hosting, this repo adds a lot of user-facing structure:

- onboarding flow
- FAQ page
- docs page
- speed profile explanation using follow-distance mapping
- install verification with radius comparison
- FSD visualization reference image
- simplified basic mode for users who only need the essentials
- advanced mode for logs, passkeys, admin, and deeper tooling

## Key Commands

```bash
# install deps
bun install

# local web dev
bun run dev

# typecheck
bun run typecheck

# production build
bun run build

# sync iOS app
bun run cap:sync

# open Xcode project
bun run ios:open

# deploy web fork to Cloudflare
bun run deploy:web
```

## Known Constraints

- The app still uses the live `fsd.teslaandroid.com` backend.
- iOS simulator is UI-only for this project; it is not a BLE test target.
- The hosted web fork cannot magically provide Bluetooth on unsupported browsers.
- On iPhone/iPad web, use the native app or [Bluefy](https://apps.apple.com/app/id1492822055).

## Practical Editing Notes

If you change:

- UI only:
  run `bun run build`
- portal state or controller logic:
  run `bun run typecheck` and `bun run build`
- Capacitor/iOS setup:
  run `bun run cap:sync`
- Cloudflare config:
  run `bunx wrangler deploy --dry-run` before live deploy

## Credits

This project is based on the published portal workflow from `fsd.teslaandroid.com`, then adapted into the `autosteerplus` app and web fork with a native Bluetooth bridge and expanded guidance UX.
