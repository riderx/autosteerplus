<template>
  <div class="onboarding-page" :hidden="portalView.currentPage !== 'onboarding'">
    <header class="hero hero-auth onboarding-hero">
      <p class="eyebrow">Guided Setup</p>
      <h1 class="hero-title">autosteerplus onboarding</h1>
      <p class="hero-copy">
        Follow this guided path to confirm you have the right hardware, the right FSD access, the correct install
        video for your car, and the final radius check that proves the install worked.
      </p>
      <div class="docs-badge-row">
        <span class="docs-badge">You need the autosteerplus device physically with you</span>
        <span class="docs-badge">You also need FSD purchased outright or an active subscription</span>
        <span class="docs-badge docs-badge-warning">Do not update AMD cars to 2026.8.6 yet</span>
      </div>
      <div class="hero-actions">
        <button class="button button-primary" type="button" @click="portalActions.openFaq()">
          FAQ
        </button>
        <button class="button button-ghost" type="button" @click="portalActions.openDocs()">
          Docs
        </button>
        <button class="button button-secondary" type="button" @click="portalActions.openDashboard()">
          {{ portalView.authenticated ? 'Back to Dashboard' : 'Back to Sign In' }}
        </button>
      </div>
    </header>

    <main class="onboarding-layout">
      <section class="panel">
        <div class="panel-heading">
          <div>
            <p class="panel-label">Overview</p>
            <h2>What this flow checks</h2>
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

      <section class="panel">
        <div class="panel-heading">
          <div>
            <p class="panel-label">Step 1</p>
            <h2>Do you have the device with you?</h2>
          </div>
        </div>
        <div class="onboarding-choice-grid">
          <button
            type="button"
            class="onboarding-choice"
            :class="{ 'is-active': hasDevice === true }"
            :aria-pressed="hasDevice === true"
            @click="selectHasDevice(true)"
          >
            <span class="metric-label">Ready now</span>
            <strong>Yes, I have the device</strong>
            <p class="muted-copy">Continue directly to FSD access and install steps.</p>
          </button>
          <button
            type="button"
            class="onboarding-choice"
            :class="{ 'is-active': hasDevice === false }"
            :aria-pressed="hasDevice === false"
            @click="selectHasDevice(false)"
          >
            <span class="metric-label">Not yet</span>
            <strong>No, I still need to buy it</strong>
            <p class="muted-copy">I need the purchase link before I can continue.</p>
          </button>
        </div>
        <div v-if="hasDevice === false" class="onboarding-support-card">
          <p class="panel-label">Buy the tool</p>
          <h3>Order the autosteerplus device first</h3>
          <p class="muted-copy">
            The onboarding flow only makes sense once the hardware is in your hands. Use the official product page
            below, then come back here for the install guide and verification steps.
          </p>
          <div class="hero-actions">
            <a
              class="button button-primary"
              href="https://teslaandroid.com/products/tesla-diagnostic-tool"
              target="_blank"
              rel="noreferrer"
            >
              Buy the device
            </a>
            <button class="button button-ghost" type="button" @click="selectHasDevice(true)">
              I have it now, continue
            </button>
          </div>
        </div>
      </section>

      <section v-if="hasDevice === true" class="panel">
        <div class="panel-heading">
          <div>
            <p class="panel-label">Step 2</p>
            <h2>Is FSD already set on this car?</h2>
          </div>
        </div>
        <p class="muted-copy">
          The device removes the geofence. It does not give you FSD for free. Tesla still expects FSD to be
          purchased outright or subscribed to.
        </p>
        <div class="onboarding-choice-grid">
          <button
            type="button"
            class="onboarding-choice"
            :class="{ 'is-active': hasFsd === true }"
            :aria-pressed="hasFsd === true"
            @click="selectHasFsd(true)"
          >
            <span class="metric-label">Already covered</span>
            <strong>Yes, FSD is already set</strong>
            <p class="muted-copy">Purchased outright or subscribed already. Continue to the install guide.</p>
          </button>
          <button
            type="button"
            class="onboarding-choice"
            :class="{ 'is-active': hasFsd === false }"
            :aria-pressed="hasFsd === false"
            @click="selectHasFsd(false)"
          >
            <span class="metric-label">Need a path</span>
            <strong>No, show me how to set it</strong>
            <p class="muted-copy">Compare the official local route with the Canada subscription workaround.</p>
          </button>
        </div>

        <div v-if="hasFsd === false" class="onboarding-fsd-grid">
          <article class="onboarding-support-card">
            <p class="panel-label">Official route</p>
            <h3>Buy or subscribe in your own country</h3>
            <p class="muted-copy">
              This is the cleanest path when your market already exposes the Upgrades menu. You stay on one Tesla
              account, one country, and one billing setup.
            </p>
            <ul class="docs-inline-list">
              <li>Best if your app already shows the Upgrades tab</li>
              <li>No account transfer or country switching</li>
              <li>Usually more expensive than the Canada route</li>
            </ul>
          </article>
          <article class="onboarding-support-card">
            <p class="panel-label">Workaround route</p>
            <h3>Subscribe through a Canadian Tesla account</h3>
            <p class="muted-copy">
              Use this when your local market does not expose FSD upgrades, or when you want the cheaper monthly
              Canadian subscription.
            </p>
            <ul class="docs-inline-list">
              <li>Create a brand-new account at `tesla.com/en_ca`</li>
              <li>Transfer the car there and subscribe for about $99 CAD/month</li>
              <li>Useful when the Upgrades menu is missing in your market</li>
              <li>Switching back cancels subscriptions and some users reported lost charging stats</li>
            </ul>
          </article>
        </div>

        <div v-if="hasFsd === false" class="onboarding-support-card onboarding-support-card-accent">
          <p class="panel-label">Canada route recap</p>
          <div class="docs-step-grid">
            <article v-for="step in fsdCanadaSteps" :key="step.title" class="docs-step-card">
              <span class="metric-label">{{ step.step }}</span>
              <strong>{{ step.title }}</strong>
              <p class="muted-copy">{{ step.body }}</p>
            </article>
          </div>
          <div class="hero-actions">
            <button class="button button-primary" type="button" @click="acknowledgeFsdOptions()">
              FSD is set, continue
            </button>
            <button class="button button-ghost" type="button" @click="portalActions.openFaq()">
              Read full FAQ
            </button>
          </div>
        </div>
      </section>

      <section v-if="canProceedToInstall" class="panel">
        <div class="panel-heading">
          <div>
            <p class="panel-label">Step 3</p>
            <h2>What car profile matches your vehicle?</h2>
          </div>
        </div>
        <p class="muted-copy">
          Pick the closest match first. That lets the app tell you which FSD stack you should expect and which
          install path makes sense.
        </p>
        <div class="onboarding-choice-grid">
          <button
            v-for="car in carOptions"
            :key="car.id"
            type="button"
            class="onboarding-choice"
            :class="{ 'is-active': selectedCarId === car.id }"
            :aria-pressed="selectedCarId === car.id"
            @click="selectCar(car.id)"
          >
            <span class="metric-label">{{ car.kicker }}</span>
            <strong>{{ car.title }}</strong>
            <p class="muted-copy">{{ car.body }}</p>
          </button>
        </div>
        <article v-if="selectedCar" class="onboarding-support-card onboarding-support-card-accent">
          <p class="panel-label">Car profile result</p>
          <h3>{{ selectedCar.title }}</h3>
          <p class="muted-copy">{{ selectedCar.profileNote }}</p>
          <ul class="docs-inline-list">
            <li>{{ selectedCar.expectedFsd }}</li>
            <li>{{ selectedCar.installNote }}</li>
          </ul>
        </article>
      </section>

      <section v-if="selectedCar" class="panel">
        <div class="panel-heading">
          <div>
            <p class="panel-label">Step 4</p>
            <h2>What Tesla software version is on the car?</h2>
          </div>
        </div>
        <p class="muted-copy">
          Enter the car software version before installing. This tells you whether the current release is confirmed,
          mixed, blocked, or still unknown for this setup.
        </p>
        <label class="field onboarding-version-field">
          <span>Car software version</span>
          <input
            v-model="softwareVersion"
            type="text"
            inputmode="decimal"
            autocomplete="off"
            placeholder="e.g. 2026.8.3"
          >
        </label>
        <div class="onboarding-fsd-grid">
          <article class="onboarding-support-card onboarding-support-card-accent">
            <p class="panel-label">Expected FSD stack</p>
            <h3>{{ selectedCar.expectedFsdTitle }}</h3>
            <p class="muted-copy">
              {{ selectedCar.expectedFsdBody }}
            </p>
            <ul class="docs-inline-list">
              <li>{{ selectedCar.installNote }}</li>
              <li>If the car behavior does not match this profile, stop and ask in Slack before proceeding</li>
            </ul>
          </article>
          <article :class="['onboarding-support-card', compatibilityCardClass]">
            <p class="panel-label">Compatibility result</p>
            <h3>{{ compatibilityState.title }}</h3>
            <p class="muted-copy">{{ compatibilityState.body }}</p>
            <ul class="docs-inline-list">
              <li v-for="item in compatibilityState.items" :key="item">{{ item }}</li>
            </ul>
          </article>
        </div>
        <div class="hero-actions">
          <a
            class="button button-ghost"
            href="https://teslaandroid.slack.com"
            target="_blank"
            rel="noreferrer"
          >
            Ask in Slack
          </a>
          <button class="button button-ghost" type="button" @click="portalActions.openFaq()">
            FAQ
          </button>
        </div>
      </section>

      <section v-if="selectedInstallGuide && compatibilityState.canInstall" class="panel">
        <div class="panel-heading">
          <div>
            <p class="panel-label">Step 5</p>
            <h2>{{ selectedInstallGuide.title }} install guide</h2>
          </div>
        </div>
        <p class="muted-copy">
          Watch the video once before touching trim. If your interior or connector path does not match, stop and ask
          before forcing anything.
        </p>
        <div class="onboarding-video-shell">
          <iframe
            class="onboarding-video-frame"
            :src="selectedInstallGuide.embedUrl"
            :title="selectedInstallGuide.videoTitle"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
        <div class="docs-step-grid">
          <article v-for="step in selectedInstallGuide.steps" :key="step.title" class="docs-step-card">
            <span class="metric-label">{{ step.step }}</span>
            <strong>{{ step.title }}</strong>
            <p class="muted-copy">{{ step.body }}</p>
          </article>
        </div>
        <div class="hero-actions">
          <button class="button button-primary" type="button" @click="showVerification = true">
            I did the install, check if it worked
          </button>
          <a
            class="button button-ghost"
            href="https://teslaandroid.slack.com"
            target="_blank"
            rel="noreferrer"
          >
            Ask in Slack
          </a>
          <button class="button button-ghost" type="button" @click="portalActions.openFaq()">
            FAQ
          </button>
        </div>
      </section>

      <section v-if="showVerification" id="onboarding-verification" class="panel">
        <div class="panel-heading">
          <div>
            <p class="panel-label">Step 6</p>
            <h2>Check if it worked</h2>
          </div>
        </div>
        <p class="muted-copy">
          Open Summon in the Tesla app and compare the blue-circle size. This is the fastest way to confirm the
          install took effect.
        </p>
        <PortalRadiusCheck />
        <div class="onboarding-post-check">
          <div class="onboarding-fsd-grid">
            <article class="onboarding-support-card onboarding-support-card-accent">
              <p class="panel-label">What you have now</p>
              <h3>The install is active</h3>
              <p class="muted-copy">
                If the larger Summon circle is showing, the device is doing its job and the car is now running with
                the unlocked behavior this tool enables.
              </p>
              <ul class="docs-inline-list">
                <li>FSD geofence bypass is active while the device stays connected</li>
                <li>Actually Smart Summon range should be the larger one you just verified</li>
                <li>You can manage the device later from the portal login screen in this app</li>
              </ul>
            </article>
            <article class="onboarding-support-card">
              <p class="panel-label">What to be aware of</p>
              <h3>Do not treat it as set-and-forget</h3>
              <p class="muted-copy">
                The device helps, but you still need to drive with supervision and pay attention to software changes.
              </p>
              <ul class="docs-inline-list">
                <li>The device must stay plugged in or the car goes back to stock behavior</li>
                <li>Check the FAQ before accepting Tesla software updates, especially around 2026.8.6</li>
                <li>Remove the device before service visits if you want the car back in stock form</li>
              </ul>
            </article>
          </div>
          <div class="hero-actions">
            <button class="button button-ghost" type="button" @click="portalActions.openFaq()">
              Know more in FAQ
            </button>
            <button class="button button-primary" type="button" @click="portalActions.openDashboard()">
              Let's go
            </button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import PortalRadiusCheck from './PortalRadiusCheck.vue';
import { portalActions, portalView } from '../view-model';

type CarOptionId = 'highland' | 'legacy';

const summaryCards = [
  {
    kicker: 'Hardware',
    title: 'Tool in hand first',
    body: 'If you do not physically have the autosteerplus device yet, buy it before worrying about install steps.',
  },
  {
    kicker: 'Access',
    title: 'FSD is still required',
    body: 'The tool removes the region lock only. Tesla still expects FSD to be purchased or actively subscribed.',
  },
  {
    kicker: 'Proof',
    title: 'Summon radius is the final check',
    body: 'A successful install shows a much larger Summon circle. Before install it may be only about 5 m to 40 m diameter depending on region, while after install it should be about 200 m diameter.',
  },
];

const fsdCanadaSteps = [
  {
    step: 'Step 1',
    title: 'Create a Canadian Tesla account',
    body: 'Use `tesla.com/en_ca` and create a brand-new account. Do not just change the country on your existing account.',
  },
  {
    step: 'Step 2',
    title: 'Add a working payment method',
    body: 'Use an international card. If Tesla insists on a Canadian postal code, the fallback used in the community is `T4A 2G4`.',
  },
  {
    step: 'Step 3',
    title: 'Transfer the vehicle',
    body: 'From your original Tesla account, go to Manage Drivers and remove or transfer ownership to the Canadian account.',
  },
  {
    step: 'Step 4',
    title: 'Start the subscription',
    body: 'Log in with the Canadian account and subscribe to FSD there. That route is usually much cheaper than buying FSD outright.',
  },
];

const carOptions = [
  {
    id: 'highland' as const,
    kicker: 'Video A',
    title: 'Model 3 Highland',
    body: 'Use the dedicated Highland install video and trim path.',
    videoTitle: 'Model 3 Highland autosteerplus install',
    embedUrl: 'https://www.youtube.com/embed/AFFVvfFIPFY?rel=0',
    steps: [
      {
        step: 'Step 1',
        title: 'Park and watch once',
        body: 'Put the car in a safe parked state and watch the video through once before opening any trim.',
      },
      {
        step: 'Step 2',
        title: 'Open the exact access point shown',
        body: 'Use the trim location from the video for Highland only. Do not improvise on a different panel.',
      },
      {
        step: 'Step 3',
        title: 'Insert the device inline',
        body: 'Disconnect the factory connector shown in the video and insert the device or harness exactly inline.',
      },
      {
        step: 'Step 4',
        title: 'Secure and close',
        body: 'Make sure the device and cables are seated, not pinched, and the trim closes cleanly before moving on.',
      },
    ],
  },
  {
    id: 'legacy' as const,
    kicker: 'Video B',
    title: 'Old Model 3 / Juniper',
    body: 'Use the shared video for older Model 3 and Juniper cars.',
    videoTitle: 'Old Model 3 and Juniper autosteerplus install',
    embedUrl: 'https://www.youtube.com/embed/ifwJNZgykVI?rel=0',
    steps: [
      {
        step: 'Step 1',
        title: 'Confirm the car matches this video',
        body: 'Use this path only for older Model 3 or Juniper. If your connector location differs, stop before opening more trim.',
      },
      {
        step: 'Step 2',
        title: 'Expose the connector path',
        body: 'Open the access area shown in the video and work only from the exact connector route demonstrated there.',
      },
      {
        step: 'Step 3',
        title: 'Install the device inline',
        body: 'Unplug the factory connector, insert the device or harness inline, and verify both sides are fully seated.',
      },
      {
        step: 'Step 4',
        title: 'Reassemble carefully',
        body: 'Secure the cable routing, close trim cleanly, and only then move to the verification step in the app.',
      },
    ],
  },
];

const hasDevice = ref<boolean | null>(null);
const hasFsd = ref<boolean | null>(null);
const reviewedFsdOptions = ref(false);
const selectedCarId = ref<CarOptionId | null>(null);
const showVerification = ref(false);

const selectedCar = computed(() => carOptions.find((entry) => entry.id === selectedCarId.value) ?? null);
const canProceedToInstall = computed(() => hasDevice.value === true && (hasFsd.value === true || reviewedFsdOptions.value));

watch(selectedCarId, () => {
  showVerification.value = false;
});

watch([hasDevice, hasFsd], () => {
  if (!canProceedToInstall.value) {
    selectedCarId.value = null;
    showVerification.value = false;
  }
});

function selectHasDevice(value: boolean) {
  hasDevice.value = value;
  if (!value) {
    hasFsd.value = null;
    reviewedFsdOptions.value = false;
  }
}

function selectHasFsd(value: boolean) {
  hasFsd.value = value;
  reviewedFsdOptions.value = value;
  if (!value) {
    selectedCarId.value = null;
    showVerification.value = false;
  }
}

function acknowledgeFsdOptions() {
  reviewedFsdOptions.value = true;
}

function selectCar(carId: CarOptionId) {
  selectedCarId.value = carId;
}
</script>
