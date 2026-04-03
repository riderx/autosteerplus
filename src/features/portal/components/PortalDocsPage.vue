<template>
  <k-page class="docs-page portal-page" :hidden="portalView.currentPage !== 'docs'">
    <div class="portal-content-shell">
      <header class="px-1 pb-2 pt-1">
        <h1 class="m-0 text-[clamp(2.1rem,5vw,3.25rem)] leading-[0.96] tracking-[-0.03em] text-[#111111]">Autosteerplus docs</h1>
      </header>

      <main class="docs-layout">
      <section class="panel docs-summary-panel">
        <div class="panel-heading">
          <div>
            <p class="panel-label">Overview</p>
            <h2>What this page is for</h2>
          </div>
        </div>
        <p class="muted-copy panel-note">
          Use this page for the two non-obvious parts of the process: getting FSD set on a car that does not already
          have it, and verifying the install without guessing.
        </p>
        <div class="mt-5 flex flex-wrap items-start gap-3">
          <span class="inline-flex rounded-full border border-[rgba(60,60,67,0.14)] bg-[rgba(255,255,255,0.92)] px-4 py-2 text-[0.88rem] leading-[1.35] text-[#1f2937]">
            Skip the subscription route if the car already owns FSD outright
          </span>
          <span class="inline-flex rounded-full border border-[rgba(255,149,0,0.18)] bg-[rgba(255,149,0,0.12)] px-4 py-2 text-[0.88rem] leading-[1.35] text-[#9a3412]">
            Avoid 2026.8.6 on AMD. Intel results are mixed too.
          </span>
        </div>
        <div class="hero-actions docs-top-actions">
          <PortalActionButton @click="portalActions.openOnboarding()">
            Start Onboarding
          </PortalActionButton>
          <PortalActionButton
            variant="ghost"
            href="https://teslaandroid.slack.com"
            target="_blank"
            rel="noreferrer"
          >
            Slack Community
          </PortalActionButton>
          <PortalActionButton variant="ghost" @click="portalActions.openFaq()">
            FAQ
          </PortalActionButton>
          <PortalActionButton variant="secondary" @click="portalActions.openDashboard()">
            {{ portalView.authenticated ? 'Back to Dashboard' : 'Back to Sign In' }}
          </PortalActionButton>
        </div>
        <div class="docs-step-grid docs-origin-grid">
          <article class="docs-step-card">
            <span class="metric-label">Portal origin</span>
            <strong>This site is a fork of `fsd.teslaandroid.com`</strong>
            <p class="muted-copy">
              autosteerplus keeps the same portal workflow, then packages it as a dedicated app and hosted web fork so
              you can manage the device from either environment.
            </p>
            <div class="hero-actions">
              <PortalActionButton variant="ghost" href="https://fsd.teslaandroid.com" target="_blank" rel="noreferrer">
                Original portal
              </PortalActionButton>
              <PortalActionButton
                variant="ghost"
                href="https://github.com/riderx/autosteerplus/tree/main"
                target="_blank"
                rel="noreferrer"
              >
                GitHub repo
              </PortalActionButton>
            </div>
          </article>
          <article class="docs-step-card">
            <span class="metric-label">Browser support</span>
            <strong>Use the app, or Bluefy on iPhone and iPad</strong>
            <p class="muted-copy">
              {{ isNativeApp
                ? 'You are in the app, so the native Bluetooth bridge is available here.'
                : 'You are in the web version. Bluetooth only works in Web Bluetooth compatible browsers.' }}
            </p>
            <ul class="docs-inline-list">
              <li>Desktop Chrome and Android Chrome can use Web Bluetooth directly.</li>
              <li>Safari does not expose Web Bluetooth on iPhone or iPad.</li>
              <li>On iPhone or iPad, use the autosteerplus app or Bluefy.</li>
            </ul>
            <div class="hero-actions">
              <PortalActionButton variant="ghost" :href="bluefyUrl" target="_blank" rel="noreferrer">
                Bluefy for iPhone and iPad
              </PortalActionButton>
            </div>
          </article>
        </div>
        <div class="docs-summary-grid">
          <article v-for="card in summaryCards" :key="card.title" class="docs-summary-card">
            <span class="metric-label">{{ card.kicker }}</span>
            <strong>{{ card.title }}</strong>
            <p class="muted-copy">{{ card.body }}</p>
          </article>
        </div>
      </section>

      <section class="panel docs-flow-panel">
        <div class="panel-heading">
          <div>
            <p class="panel-label">Flow</p>
            <h2>Process schema</h2>
          </div>
        </div>
        <p class="muted-copy">
          Follow the path left to right. The subscription part is only needed when the vehicle does not already have
          permanent FSD.
        </p>
        <div class="docs-flow-grid" role="list" aria-label="Subscription and verification flow">
          <article v-for="stage in flowStages" :key="stage.step" class="docs-flow-card" role="listitem">
            <span class="docs-flow-step">Step {{ stage.step }}</span>
            <h3>{{ stage.title }}</h3>
            <p class="muted-copy">{{ stage.body }}</p>
            <ul class="docs-inline-list">
              <li v-for="item in stage.items" :key="item">{{ item }}</li>
            </ul>
          </article>
        </div>
      </section>

      <div class="docs-section-grid">
        <section class="panel docs-detail-panel">
          <div class="panel-heading">
            <div>
              <p class="panel-label">Subscription Route</p>
              <h2>Canadian account setup</h2>
            </div>
          </div>
          <p class="muted-copy">
            This route is only for vehicles that still need a monthly FSD subscription.
          </p>
          <div class="docs-step-grid">
            <article v-for="item in subscriptionSteps" :key="item.title" class="docs-step-card">
              <span class="metric-label">{{ item.step }}</span>
              <strong>{{ item.title }}</strong>
              <p class="muted-copy">{{ item.body }}</p>
              <ul class="docs-inline-list">
                <li v-for="detail in item.details" :key="detail">{{ detail }}</li>
              </ul>
            </article>
          </div>
        </section>
      </div>

      <section class="panel docs-detail-panel docs-detail-panel-wide">
        <div class="panel-heading">
          <div>
            <p class="panel-label">Benefits</p>
            <h2>What Autosteerplus gives you</h2>
          </div>
        </div>
        <p class="muted-copy panel-note">
          Once the device is installed correctly and stays connected, these are the main gains people look for.
        </p>
        <div class="docs-summary-grid">
          <article v-for="benefit in benefitCards" :key="benefit.title" class="docs-summary-card">
            <span class="metric-label">{{ benefit.kicker }}</span>
            <strong>{{ benefit.title }}</strong>
            <p class="muted-copy">{{ benefit.body }}</p>
          </article>
        </div>
      </section>

      <section class="panel docs-detail-panel docs-detail-panel-wide">
        <div class="panel-heading">
          <div>
            <p class="panel-label">Visual check</p>
            <h2>How the FSD view should look when it is working</h2>
          </div>
        </div>
        <p class="muted-copy panel-note">
          Once the device is active and the car is in the correct FSD state, the on-road visualization should look
          like the full stack instead of the restricted regional fallback. Use this as a sanity check together with
          the Summon radius change.
        </p>
        <div class="docs-step-grid">
          <article class="docs-step-card">
            <span class="metric-label">What to check</span>
            <strong>Use the picture as a visual reference</strong>
            <ul class="docs-inline-list">
              <li>Confirm the driving visualization looks like the expected FSD stack when the device is connected.</li>
              <li>Do not rely on a single signal alone. Pair this with the larger Summon circle check below.</li>
              <li>If the road visualization still looks like the locked fallback, stop and check version compatibility first.</li>
            </ul>
          </article>
          <article class="docs-step-card">
            <span class="metric-label">Reference</span>
            <strong>Expected FSD visualization</strong>
            <div class="docs-visual-media">
              <img class="docs-visual-image" :src="fsdVisualisationImage" alt="Expected Full Self-Driving visualization when Autosteerplus is working" />
            </div>
          </article>
        </div>
      </section>

      <section class="panel docs-detail-panel docs-detail-panel-wide">
        <div class="panel-heading">
          <div>
            <p class="panel-label">Speed Profiles</p>
            <h2>Set the driving profile with the car distance setting</h2>
          </div>
        </div>
        <p class="muted-copy panel-note">
          Autosteerplus uses the car follow-distance value as the profile selector. Change the distance setting in the
          Tesla UI, then the matching speed profile is applied automatically.
        </p>
        <div class="docs-step-grid">
          <article class="docs-step-card">
            <span class="metric-label">How to set it</span>
            <strong>Use the follow-distance control in the car</strong>
            <ul class="docs-inline-list">
              <li>Open Autosteer or FSD settings in the car as you normally would.</li>
              <li>Change the follow-distance value to the number you want.</li>
              <li>The selected distance number becomes the active Autosteerplus speed profile.</li>
              <li>On HW3, only distances 2 to 4 are used for profiles.</li>
              <li>On HW4, distances 2 to 6 map to profiles.</li>
            </ul>
          </article>
          <article class="docs-step-card">
            <span class="metric-label">What to expect</span>
            <strong>Lower distance means a more aggressive profile</strong>
            <ul class="docs-inline-list">
              <li>Use lower values if you want a faster, more assertive profile.</li>
              <li>Use higher values if you want a calmer profile.</li>
              <li>If the profile feels wrong, change the distance again and re-check the profile shown in the portal.</li>
            </ul>
          </article>
        </div>
        <div class="docs-profile-table-shell">
          <table class="docs-profile-table">
            <thead>
              <tr>
                <th scope="col">Distance</th>
                <th scope="col">Profile (HW3)</th>
                <th scope="col">Profile (HW4)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in speedProfileRows" :key="row.distance">
                <th scope="row">{{ row.distance }}</th>
                <td>
                  <span class="docs-profile-value" :class="row.hw3.tone">
                    {{ row.hw3.label }}
                  </span>
                </td>
                <td>
                  <span class="docs-profile-value" :class="row.hw4.tone">
                    {{ row.hw4.label }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="panel docs-detail-panel docs-detail-panel-wide">
        <div class="panel-heading">
          <div>
            <p class="panel-label">Verification Route</p>
            <h2>Fast install check</h2>
          </div>
        </div>
        <p class="muted-copy">
          Do this after the device install. It is the fastest signal that the change actually took effect.
        </p>
        <PortalRadiusCheck />
      </section>

      <section class="panel docs-detail-panel docs-detail-panel-wide">
        <div class="panel-heading">
          <div>
            <p class="panel-label">Next Step</p>
            <h2>Ready to go through it?</h2>
          </div>
        </div>
        <p class="muted-copy">
          Use the guided onboarding flow if you want the app to walk you through device readiness, FSD setup, the
          correct install video, and the final verification step in order.
        </p>
        <div class="hero-actions">
          <PortalActionButton @click="portalActions.openOnboarding()">
            Start Onboarding
          </PortalActionButton>
          <PortalActionButton variant="ghost" @click="portalActions.openFaq()">
            FAQ
          </PortalActionButton>
        </div>
      </section>
      </main>
    </div>
  </k-page>
</template>

<script setup lang="ts">
import { Capacitor } from '@capacitor/core';
import { kPage } from 'konsta/vue';

import fsdVisualisationImage from '../../../../fsd_visualisation.png';
import PortalActionButton from './PortalActionButton.vue';
import PortalRadiusCheck from './PortalRadiusCheck.vue';
import { portalActions, portalView } from '../view-model';

const isNativeApp = Capacitor.isNativePlatform();
const bluefyUrl = 'https://apps.apple.com/app/id1492822055';

const summaryCards = [
  {
    kicker: 'Decision',
    title: 'Do you even need the subscription route?',
    body: 'Only follow the Canadian-account setup if the vehicle does not already own permanent FSD.',
  },
  {
    kicker: 'Warning',
    title: 'Be careful with 2026.8.6',
    body: 'Do not update AMD cars to 2026.8.6. HW3 Intel results are mixed too, so the safe path is still to wait.',
  },
  {
    kicker: 'Success signal',
    title: 'Summon range is the fast check',
    body: 'Before install the blue circle can be around 5 m to 40 m diameter depending on region. After a successful install it should expand to about 200 m diameter.',
  },
];

const flowStages = [
  {
    step: '1',
    title: 'Prepare the Canadian account',
    body: 'Create the account in the Canadian Tesla region and attach a payment method that can process international charges.',
    items: ['Use tesla.com/en_ca', 'If prompted, postal code T4A 2G4'],
  },
  {
    step: '2',
    title: 'Move the vehicle and start FSD',
    body: 'Transfer the car into that account, then activate the monthly subscription from inside the Canadian account.',
    items: ['Manage Drivers', 'Remove or Transfer Ownership', '$99 CAD/month'],
  },
  {
    step: '3',
    title: 'Verify the hardware install',
    body: 'Open Summon in the Tesla app and compare the blue-circle size. That tells you quickly whether the install took effect.',
    items: ['Before ~5 m to 40 m diameter depending on region', 'After ~200 m diameter'],
  },
];

const subscriptionSteps = [
  {
    step: 'Step 1',
    title: 'Create the account in the correct region',
    body: 'Start fresh on the Canadian Tesla site so the account region is aligned with the subscription flow.',
    details: ['Open tesla.com/en_ca', 'Complete signup with the region set to Canada'],
  },
  {
    step: 'Step 2',
    title: 'Add a working payment method',
    body: 'Use a card that allows international transactions. If Tesla insists on a Canadian postal code, use the fallback below.',
    details: ['International card recommended', 'Fallback postal code: T4A 2G4'],
  },
  {
    step: 'Step 3',
    title: 'Transfer the vehicle',
    body: 'Use the original Tesla account to move the vehicle into the Canadian account before attempting the subscription.',
    details: ['Tesla app → Manage Drivers', 'Choose Remove or Transfer Ownership'],
  },
  {
    step: 'Step 4',
    title: 'Start the subscription',
    body: 'Once the car is visible in the Canadian account, activate the monthly FSD subscription from there.',
    details: ['Log in with the Canadian account', 'Start FSD at $99 CAD/month'],
  },
];

const benefitCards = [
  {
    kicker: 'Summon',
    title: 'Much longer Actually Smart Summon range',
    body: 'The quick visual proof is the larger blue circle, going from the restricted regional range to about 200 m diameter when the install took effect.',
  },
  {
    kicker: 'FSD',
    title: 'Real supervised FSD behavior',
    body: 'The goal is not just to unlock the menu. It is to get the actual supervised FSD feature set that handles more of the real driving stack.',
  },
  {
    kicker: 'Driving',
    title: 'Better roundabouts, lane changes, and turn handling',
    body: 'Users care about the practical driving gains: taking roundabouts, making lane changes more naturally, and improving Autosteer turn radius.',
  },
  {
    kicker: 'Driver monitoring',
    title: 'Less nagging when the cabin camera can see you',
    body: 'When the interior camera can clearly see the driver, the experience should feel closer to the real supervised FSD flow instead of a heavily restricted fallback.',
  },
  {
    kicker: 'Portal',
    title: 'OTA updates and device management stay available',
    body: 'You still manage packages, updates, and diagnostics from the portal, so the setup can keep evolving with future fixes and OTA improvements.',
  },
  {
    kicker: 'Important',
    title: 'These gains only stay active while the device stays connected',
    body: 'If you unplug the device, the car falls back to stock behavior. The unlocked behavior is not permanent without the hardware connected.',
  },
];

const speedProfileRows = [
  {
    distance: '2',
    hw3: { label: 'Hurry', tone: 'docs-profile-hurry' },
    hw4: { label: 'Max', tone: 'docs-profile-max' },
  },
  {
    distance: '3',
    hw3: { label: 'Normal', tone: 'docs-profile-normal' },
    hw4: { label: 'Hurry', tone: 'docs-profile-hurry' },
  },
  {
    distance: '4',
    hw3: { label: 'Chill', tone: 'docs-profile-chill' },
    hw4: { label: 'Normal', tone: 'docs-profile-normal' },
  },
  {
    distance: '5',
    hw3: { label: 'Not used', tone: 'docs-profile-empty' },
    hw4: { label: 'Chill', tone: 'docs-profile-chill' },
  },
  {
    distance: '6',
    hw3: { label: 'Not used', tone: 'docs-profile-empty' },
    hw4: { label: 'Sloth', tone: 'docs-profile-sloth' },
  },
];

</script>
