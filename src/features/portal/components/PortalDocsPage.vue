<template>
  <div class="docs-page" :hidden="portalView.currentPage !== 'docs'">
    <header class="hero hero-auth docs-hero">
      <p class="eyebrow">Tesla FSD</p>
      <h1 class="hero-title">autosteerplus docs</h1>
      <p class="hero-copy">
        Use this page for the two non-obvious parts of the process: getting an FSD subscription on a car that does
        not already own it, and verifying the install without guessing.
      </p>
      <div class="docs-badge-row">
        <span class="docs-badge">Skip the subscription route if the car already owns FSD outright</span>
        <span class="docs-badge docs-badge-warning">Avoid 2026.8.6 on AMD. Intel results are mixed too.</span>
      </div>
      <div class="hero-actions">
        <button class="button button-primary" type="button" @click="portalActions.openOnboarding()">
          Start Onboarding
        </button>
        <a
          class="button button-ghost"
          href="https://teslaandroid.slack.com"
          target="_blank"
          rel="noreferrer"
        >
          Slack Community
        </a>
        <button class="button button-ghost" type="button" @click="portalActions.openFaq()">
          FAQ
        </button>
        <button class="button button-secondary" type="button" @click="portalActions.openDashboard()">
          {{ portalView.authenticated ? 'Back to Dashboard' : 'Back to Sign In' }}
        </button>
      </div>
    </header>

    <main class="docs-layout">
      <section class="panel docs-summary-panel">
        <div class="panel-heading">
          <div>
            <p class="panel-label">Overview</p>
            <h2>What this page is for</h2>
          </div>
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
          <button class="button button-primary" type="button" @click="portalActions.openOnboarding()">
            Start Onboarding
          </button>
          <button class="button button-ghost" type="button" @click="portalActions.openFaq()">
            FAQ
          </button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import PortalRadiusCheck from './PortalRadiusCheck.vue';
import { portalActions, portalView } from '../view-model';

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

</script>
