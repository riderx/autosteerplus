# AGENTS.md

This file is the repo-specific operating guide for AI agents working on `autosteerplus`.

Read this before changing code.

## Core Rules

- Always use `bun` or `bunx`, never `npm` or `npx`.
- Prefer the existing project structure and current UX direction over generic Capacitor boilerplate.
- If you open a browser for inspection, use headless mode unless the user explicitly needs to interact with it.
- If you create a PR, wait for CI to finish, fix failures, then resolve review comments only after they are actually posted.
- If PR comments are still in `Review in progress`, wait. Do not resolve or react early.
- If you deploy web changes, use the existing Cloudflare Workers static deploy flow.

## Product Identity

- The product name is `autosteerplus`.
- Do not reintroduce the old name `Tesla Android FSD Diagnostic Tool` in user-facing copy.
- The hosted portal is a fork/adaptation of `https://fsd.teslaandroid.com`.
- The native iOS/Android app is the preferred experience on mobile because it can bridge Bluetooth directly.

## Current Platform Shape

This repo has three delivery surfaces:

1. Web app
2. iOS Capacitor app
3. Android Capacitor app

Important paths:

- `#/home`
- `#/docs`
- `#/onboarding`
- `#/faq`

Do not move the main dashboard back to bare `#/`.

## UX Rules

### General

- Keep the UI as close to vanilla iOS / Cupertino as possible.
- Use `Konsta UI` patterns and the current light iOS styling direction.
- The app must work well on iPhone widths and on aspect ratios close to `4:3`.
- Avoid reintroducing heavy custom dark themes or generic dashboard styling.
- Do not duplicate the same CTA in multiple places if the user only needs one obvious action.
- Do not show actions for steps the user cannot perform yet.

### Logged-out state

- The login page should be centered properly on large screens.
- Avoid duplicate titles or repeated product naming.
- Keep login focused and minimal.
- Secondary links like onboarding/docs/FAQ should support the login flow, not overwhelm it.

### Logged-in `/home`

- While disconnected, keep the home page simple.
- Show a single clear connect-first state.
- Do not show runtime status, OTA, control panels, passkeys, admin, or logs before a device is connected.
- While disconnected, there should be one primary `Connect Device` CTA.
- Keep `Onboarding` and `Docs` reachable from `/home`.

### Docs / Onboarding / FAQ

- Docs, onboarding, and FAQ should feel like first-class product pages, not debug pages.
- Watch spacing carefully: inner cards must not visually crash into surrounding text or action rows.
- If cards are inside a larger panel, preserve real top margin before the inner grid starts.
- FAQ collapsibles must have a visible chevron in the closed state.
- Avoid useless top hero pills or duplicate section intros.

## Bluetooth / Web Fallback Rules

- If Capacitor native runtime is available, use the native BLE bridge.
- If Capacitor is not available, explain clearly that this is the web fork and Bluetooth depends on Web Bluetooth browser support.
- On iPhone/iPad web:
  - Safari does not support Web Bluetooth here
  - users should use the native app or Bluefy
- Always use the Bluefy App Store link already used in the project:
  - `https://apps.apple.com/app/id1492822055`
- When Bluetooth is unavailable, do not leave the user with a vague browser error.

## Documentation Content Rules

Docs and onboarding should explain the product, not just expose controls.

Must preserve/explain:

- this app is a fork of `fsd.teslaandroid.com`
- Bluefy fallback for iPhone/iPad web users
- Summon radius verification
- FSD visualization reference
- speed profile mapping using the car follow-distance setting
- the main benefits:
  - longer Summon range
  - real supervised FSD features
  - better roundabouts / lane changes / turn handling
  - less nagging when the interior camera can see the driver
  - device must stay connected for the behavior to remain active

## Onboarding Rules

The onboarding flow is intentional. Do not collapse it back into a generic form.

Keep this logic:

1. Do you have the device with you?
2. Is FSD already set on the car?
3. Which Tesla model do you have?
4. What is the build year?
5. What software version is on the car?
6. Show the correct install video if supported
7. Verification with Summon radius and FSD visualization
8. Explain what the user has now and what to watch out for

Important:

- Ask for model and year, not vague hardware jargon first.
- Do not expect users to know Ryzen/Intel/HW3/HW4 immediately.
- Use year/model to derive support and guidance whenever possible.
- Keep a path to FAQ and Slack from onboarding where relevant.

## Design Rules For Radius / Visual Checks

- The radius comparison is a core comprehension element.
- The images must be large and clearly visible.
- Do not squash them into narrow columns.
- Keep the explanation clear and above or around the comparison in a readable order.
- Avoid conflicting radius/diameter wording.
- Current guidance:
  - before install can vary by region
  - after install target is about `200 m diameter`

## Engineering Rules

- Preserve the Vue component structure under `src/features/portal/components/`.
- Keep shared state in `src/features/portal/view-model.ts`.
- Keep portal orchestration in `src/features/portal/controller.ts`.
- Keep the native/web bootstrap behavior in `src/main.ts` and `src/runtime/*`.
- When adding native functionality, keep Capacitor package versions aligned.

If you change native platforms:

- run `bun run cap:sync`
- for Android, validate with `./gradlew assembleDebug` from `android/`
- for iOS, keep the existing `fix:ios` flow intact

## Deploy / Infra Rules

- Web deploy uses `wrangler.jsonc`.
- The current target custom domain is `asp.tslap.store`.
- If deploy succeeds but the site returns `NXDOMAIN`, that is a DNS/custom-domain provisioning issue, not a Vite build issue.
- Do not assume Cloudflare custom domain provisioning is complete just because the Worker deploy succeeded.

## Scripts To Prefer

- `bun run dev`
- `bun run typecheck`
- `bun run build`
- `bun run cap:sync`
- `bun run ios:open`
- `bun run android:open`
- `bun run deploy:web`

## When In Doubt

- Prefer simplifying the experience rather than exposing more controls.
- Prefer one clear CTA per state.
- Prefer explicit explanations over hidden assumptions.
- Do not regress the current iOS-style visual direction.
