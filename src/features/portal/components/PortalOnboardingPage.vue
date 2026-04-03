<template>
  <k-page class="onboarding-page portal-page" :hidden="portalView.currentPage !== 'onboarding'">
    <div class="portal-content-shell">
      <k-navbar large transparent title="Autosteerplus onboarding" class="portal-navbar" />

      <main class="onboarding-layout">
      <section class="panel">
        <div class="panel-heading">
          <div>
            <p class="panel-label">Overview</p>
            <h2>What this flow checks</h2>
          </div>
        </div>
        <p class="muted-copy panel-note">
          Follow this guided path to confirm hardware readiness, FSD setup, the right install video for your car,
          and the final radius check that proves the install worked.
        </p>
        <div class="hero-actions docs-top-actions">
          <PortalActionButton @click="portalActions.openFaq()">
            FAQ
          </PortalActionButton>
          <PortalActionButton variant="ghost" @click="portalActions.openDocs()">
            Docs
          </PortalActionButton>
          <PortalActionButton variant="secondary" @click="portalActions.openDashboard()">
            {{ portalView.authenticated ? 'Back to Dashboard' : 'Back to Sign In' }}
          </PortalActionButton>
        </div>
        <div class="docs-summary-grid onboarding-summary-grid">
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
          <h3>Order the Autosteerplus device first</h3>
          <p class="muted-copy">
            The onboarding flow only makes sense once the hardware is in your hands. Use the official product page
            below, then come back here for the install guide and verification steps.
          </p>
          <div class="hero-actions">
            <PortalActionButton
              href="https://teslaandroid.com/products/tesla-diagnostic-tool"
              target="_blank"
              rel="noreferrer"
            >
              Buy the device
            </PortalActionButton>
            <PortalActionButton variant="ghost" @click="selectHasDevice(true)">
              I have it now, continue
            </PortalActionButton>
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
            <PortalActionButton @click="acknowledgeFsdOptions()">
              FSD is set, continue
            </PortalActionButton>
            <PortalActionButton variant="ghost" @click="portalActions.openFaq()">
              Read full FAQ
            </PortalActionButton>
          </div>
        </div>
      </section>

      <section v-if="canProceedToInstall" class="panel">
        <div class="panel-heading">
          <div>
            <p class="panel-label">Step 3</p>
            <h2>What Tesla do you have?</h2>
          </div>
        </div>
        <p class="muted-copy">
          Pick the model first, then enter the build year. From that, the app will tell you whether this onboarding
          path is covered and which install video applies.
        </p>
        <div class="onboarding-choice-grid">
          <button
            v-for="model in modelOptions"
            :key="model.id"
            type="button"
            class="onboarding-choice"
            :class="{ 'is-active': selectedModel === model.id }"
            :aria-pressed="selectedModel === model.id"
            @click="selectModel(model.id)"
          >
            <span class="metric-label">{{ model.kicker }}</span>
            <strong>{{ model.title }}</strong>
            <p class="muted-copy">{{ model.body }}</p>
          </button>
        </div>
        <label class="field onboarding-version-field">
          <span>Build year</span>
          <input
            v-model="buildYear"
            type="text"
            inputmode="numeric"
            autocomplete="off"
            placeholder="e.g. 2024"
          >
        </label>
        <p class="muted-copy panel-note">
          Use the year shown in the registration, Tesla app, or the door sticker. You do not need to guess Ryzen,
          Intel, HW3, or HW4 here.
        </p>
        <article class="onboarding-support-card" :class="vehicleSelectionCardClass">
          <p class="panel-label">Result</p>
          <h3>{{ vehicleSelectionState.title }}</h3>
          <p class="muted-copy">{{ vehicleSelectionState.body }}</p>
          <ul class="docs-inline-list">
            <li v-for="item in vehicleSelectionState.items" :key="item">{{ item }}</li>
          </ul>
          <div v-if="selectedInstallGuide && vehicleSelectionState.canInstall" class="onboarding-video-shell onboarding-video-shell-preview">
            <iframe
              class="onboarding-video-frame"
              :src="selectedInstallGuide.embedUrl"
              :title="selectedInstallGuide.videoTitle"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          </div>
          <p v-if="selectedInstallGuide && vehicleSelectionState.canInstall" class="muted-copy">
            This is the install video for your car. The full written step-by-step stays below after the version
            compatibility check.
          </p>
        </article>
      </section>

      <section v-if="selectedCar && vehicleSelectionState.canInstall" class="panel">
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
          <PortalActionButton
            variant="ghost"
            href="https://teslaandroid.slack.com"
            target="_blank"
            rel="noreferrer"
          >
            Ask in Slack
          </PortalActionButton>
          <PortalActionButton variant="ghost" @click="portalActions.openFaq()">
            FAQ
          </PortalActionButton>
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
          <PortalActionButton @click="showVerification = true">
            I did the install, check if it worked
          </PortalActionButton>
          <PortalActionButton
            variant="ghost"
            href="https://teslaandroid.slack.com"
            target="_blank"
            rel="noreferrer"
          >
            Ask in Slack
          </PortalActionButton>
          <PortalActionButton variant="ghost" @click="portalActions.openFaq()">
            FAQ
          </PortalActionButton>
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
        <div class="docs-step-grid onboarding-visual-check">
          <article class="docs-step-card">
            <span class="metric-label">Second check</span>
            <strong>Compare the FSD driving visualization too</strong>
            <p class="muted-copy">
              The larger Summon circle is the quick proof, but you should also compare the in-drive visualization to
              the expected FSD look. That gives you a second confirmation that the unlocked stack is active.
            </p>
            <ul class="docs-inline-list">
              <li>Check it while the device is still connected.</li>
              <li>If the visualization still looks like the restricted fallback, verify version compatibility before driving further.</li>
              <li>When in doubt, compare against the FAQ and ask in Slack before assuming the install failed.</li>
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
                <li>Longer Actually Smart Summon range should now be active</li>
                <li>Real supervised FSD features should be available rather than the regional lockout behavior</li>
                <li>Roundabouts, lane changes, and turn handling should feel closer to the real FSD stack</li>
                <li>When the interior camera can see you properly, the experience should have less nagging than the restricted fallback</li>
                <li>FSD geofence bypass stays active while the device remains connected</li>
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
            <PortalActionButton variant="ghost" @click="portalActions.openFaq()">
              Know more in FAQ
            </PortalActionButton>
            <PortalActionButton @click="portalActions.openDashboard()">
              Let's go
            </PortalActionButton>
          </div>
        </div>
      </section>
      </main>
    </div>
  </k-page>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { kNavbar, kPage } from 'konsta/vue';

import fsdVisualisationImage from '../../../../fsd_visualisation.png';
import PortalActionButton from './PortalActionButton.vue';
import PortalRadiusCheck from './PortalRadiusCheck.vue';
import { portalActions, portalView } from '../view-model';

type ModelId = '3' | 'y' | 's' | 'x';
type CarOptionId = 'model3-highland' | 'model3-legacy' | 'modely-juniper';
type InstallGuideId = 'highland' | 'legacy';
type CompatibilityGroup = 'newer' | 'older';

interface InstallGuideStep {
  step: string;
  title: string;
  body: string;
}

interface InstallGuide {
  id: InstallGuideId;
  title: string;
  videoTitle: string;
  embedUrl: string;
  steps: InstallGuideStep[];
}

interface CarOption {
  id: CarOptionId;
  guideId: InstallGuideId;
  compatibilityGroup: CompatibilityGroup;
  kicker: string;
  title: string;
  body: string;
  yearHint: string;
  profileNote: string;
  expectedFsd: string;
  expectedFsdTitle: string;
  expectedFsdBody: string;
  installNote: string;
}

interface CompatibilityState {
  canInstall: boolean;
  status: 'idle' | 'ok' | 'warn' | 'blocked';
  title: string;
  body: string;
  items: string[];
}

const modelOptions = [
  {
    id: '3' as const,
    kicker: 'Model',
    title: 'Model 3',
    body: 'Supported in this onboarding. The build year decides which install path applies.',
  },
  {
    id: 'y' as const,
    kicker: 'Model',
    title: 'Model Y',
    body: 'Only the newer Juniper path is covered in this onboarding flow right now.',
  },
  {
    id: 's' as const,
    kicker: 'Model',
    title: 'Model S',
    body: 'Not covered by the current in-app install videos. This needs manual confirmation first.',
  },
  {
    id: 'x' as const,
    kicker: 'Model',
    title: 'Model X',
    body: 'Not covered by the current in-app install videos. This needs manual confirmation first.',
  },
];

const summaryCards = [
  {
    kicker: 'Hardware',
    title: 'Tool in hand first',
    body: 'If you do not physically have the Autosteerplus device yet, buy it before worrying about install steps.',
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

const installGuides: InstallGuide[] = [
  {
    id: 'highland',
    title: 'Model 3 Highland install guide',
    videoTitle: 'Model 3 Highland Autosteerplus install',
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
    id: 'legacy',
    title: 'Old Model 3 / Juniper install guide',
    videoTitle: 'Old Model 3 and Juniper Autosteerplus install',
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

const carOptions: CarOption[] = [
  {
    id: 'model3-highland',
    guideId: 'highland',
    compatibilityGroup: 'newer',
    kicker: 'Model 3',
    title: 'Model 3 Highland',
    body: 'Choose this for Highland / refresh cars, roughly late 2023 build and newer.',
    yearHint: 'Build year hint: usually late 2023 or newer.',
    profileNote: 'This is the newer Model 3 refresh. Use the Highland video. You do not need to know Ryzen or HW4 to pick this path.',
    expectedFsd: 'Expected FSD: HW4 cars should get v13 or newer when the Tesla side is set correctly.',
    expectedFsdTitle: 'Newer Model 3 profile',
    expectedFsdBody: 'Highland cars are on the newer path. When everything is aligned, they should be on the newer FSD generation rather than the older fallback stack.',
    installNote: 'Install path: use the dedicated Highland video and do not follow the legacy trim route.',
  },
  {
    id: 'model3-legacy',
    guideId: 'legacy',
    compatibilityGroup: 'older',
    kicker: 'Model 3',
    title: 'Model 3 before Highland',
    body: 'Choose this for older Model 3 cars, roughly 2017 to 2023 build years.',
    yearHint: 'Build year hint: usually 2017 to 2023.',
    profileNote: 'This is the older Model 3 path. Use the shared legacy video. Version checks matter more here, especially around 2026.8.6.',
    expectedFsd: 'Expected FSD: HW3 cars generally get v12.6.4, which the community treats as the HW3 equivalent path.',
    expectedFsdTitle: 'Older Model 3 profile',
    expectedFsdBody: 'Expect the older FSD stack rather than the newer refresh-car path. Results on 2026.8.6 are mixed, so stay on the confirmed versions only.',
    installNote: 'Install path: use the shared legacy / Juniper video and stop if the connector path does not match.',
  },
  {
    id: 'modely-juniper',
    guideId: 'legacy',
    compatibilityGroup: 'newer',
    kicker: 'Model Y',
    title: 'Model Y Juniper',
    body: 'Choose this for Juniper / refresh Model Y cars, roughly 2025 build and newer.',
    yearHint: 'Build year hint: usually 2025 or newer.',
    profileNote: 'Juniper follows the shared legacy / Juniper install video. You can identify it by model and build year instead of trying to determine the chip yourself.',
    expectedFsd: 'Expected FSD: newer HW4 / Ryzen-side cars should be on v13 or newer, not the HW3 fallback branch.',
    expectedFsdTitle: 'Model Y Juniper profile',
    expectedFsdBody: 'Juniper should follow the newer-car path once FSD access is correctly set on the Tesla side.',
    installNote: 'Install path: use the shared old Model 3 / Juniper video, then verify with the Summon range check.',
  },
];

const supportedVersions = new Set(['2026.2.9', '2026.2.9.1', '2026.2.9.2', '2026.2.9.3', '2026.8.3']);

const hasDevice = ref<boolean | null>(null);
const hasFsd = ref<boolean | null>(null);
const reviewedFsdOptions = ref(false);
const selectedModel = ref<ModelId | null>(null);
const buildYear = ref('');
const softwareVersion = ref('');
const showVerification = ref(false);

const parsedBuildYear = computed(() => {
  const year = Number.parseInt(buildYear.value.trim(), 10);
  return Number.isFinite(year) ? year : null;
});

const selectedCarId = computed<CarOptionId | null>(() => {
  if (!selectedModel.value || !parsedBuildYear.value) {
    return null;
  }

  if (selectedModel.value === '3') {
    return parsedBuildYear.value >= 2024 ? 'model3-highland' : 'model3-legacy';
  }

  if (selectedModel.value === 'y') {
    return parsedBuildYear.value >= 2025 ? 'modely-juniper' : null;
  }

  return null;
});

const selectedCar = computed(() => carOptions.find((entry) => entry.id === selectedCarId.value) ?? null);
const selectedInstallGuide = computed(() => {
  if (!selectedCar.value) {
    return null;
  }

  return installGuides.find((entry) => entry.id === selectedCar.value?.guideId) ?? null;
});
const canProceedToInstall = computed(() => hasDevice.value === true && (hasFsd.value === true || reviewedFsdOptions.value));
const normalizedSoftwareVersion = computed(() => softwareVersion.value.trim().toLowerCase());

const vehicleSelectionState = computed<CompatibilityState>(() => {
  if (!selectedModel.value) {
    return {
      canInstall: false,
      status: 'idle',
      title: 'Choose your Tesla model first',
      body: 'Start with Model 3, Y, S, or X. Then enter the build year so the app can tell you whether this onboarding path is covered.',
      items: ['This step should decide coverage and video before you touch trim.'],
    };
  }

  if (!parsedBuildYear.value) {
    return {
      canInstall: false,
      status: 'idle',
      title: 'Enter the build year',
      body: 'The build year is enough for this step. Use the year from the Tesla app, registration, or door sticker.',
      items: ['Example: 2024 for Highland Model 3, 2025 for Juniper Model Y.'],
    };
  }

  if (selectedModel.value === 's' || selectedModel.value === 'x') {
    return {
      canInstall: false,
      status: 'warn',
      title: 'Not covered by the current onboarding videos',
      body: `Model ${selectedModel.value.toUpperCase()} is not covered by the current in-app install videos. Do not continue blindly from this flow.`,
      items: [
        'Ask in Slack before attempting the install on S or X.',
        'The current app video guidance only covers Model 3 Highland, older Model 3, and Model Y Juniper.',
      ],
    };
  }

  if (selectedModel.value === 'y' && parsedBuildYear.value < 2025) {
    return {
      canInstall: false,
      status: 'warn',
      title: 'This Model Y path is not covered here',
      body: 'The in-app video currently covers Juniper Model Y only. Older Model Y cars need manual confirmation first.',
      items: [
        'If your Model Y is pre-Juniper, ask in Slack before installing.',
        'Do not assume the Juniper video applies to an older Model Y.',
      ],
    };
  }

  if (!selectedCar.value || !selectedInstallGuide.value) {
    return {
      canInstall: false,
      status: 'warn',
      title: 'This combination is not mapped yet',
      body: 'The app could not match your model and year to a safe install path yet.',
      items: ['Ask in Slack before proceeding.'],
    };
  }

  return {
    canInstall: true,
    status: 'ok',
    title: `Covered: ${selectedCar.value.title}`,
    body: 'This onboarding path is covered. The matching install video is selected below, and the Tesla software version check comes next.',
    items: [
      selectedCar.value.yearHint,
      `Install video: ${selectedInstallGuide.value.title}.`,
      selectedCar.value.expectedFsd,
    ],
  };
});

const vehicleSelectionCardClass = computed(() => {
  if (vehicleSelectionState.value.status === 'ok') {
    return 'onboarding-support-card-success';
  }

  if (vehicleSelectionState.value.status === 'warn') {
    return 'onboarding-support-card-warning';
  }

  return 'onboarding-support-card-neutral';
});

const compatibilityState = computed<CompatibilityState>(() => {
  if (!selectedCar.value) {
    return {
      canInstall: false,
      status: 'idle',
      title: 'Choose your car first',
      body: 'Pick the closest car profile first so the app can apply the right compatibility guidance.',
      items: ['If you are unsure, stop and confirm the hardware profile before installing anything.'],
    };
  }

  if (!normalizedSoftwareVersion.value) {
    return {
      canInstall: false,
      status: 'idle',
      title: 'Version check still needed',
      body: 'Enter the Tesla software version from the car before deciding whether this install is safe to do now.',
      items: ['Confirmed versions: 2026.2.9 through 2026.2.9.3, and 2026.8.3.'],
    };
  }

  if (normalizedSoftwareVersion.value === '2026.8.6') {
    if (selectedCar.value.compatibilityGroup === 'newer') {
      return {
        canInstall: false,
        status: 'blocked',
        title: 'Blocked on 2026.8.6 for this newer car path',
        body: 'Do not proceed on 2026.8.6 on the newer Highland / Juniper side. The bypass is not ready there yet.',
        items: [
          'Keep Wi-Fi off and remove saved Wi-Fi if you are trying to avoid this update.',
          'If the update is already downloaded, you still do not need to install it.',
        ],
      };
    }

    return {
      canInstall: false,
      status: 'warn',
      title: 'Mixed results on 2026.8.6',
      body: 'Intel / older setups on 2026.8.6 are still community-risky. The safe recommendation is still to wait.',
      items: [
        'Do not treat this as a confirmed-good version.',
        'Ask in Slack before proceeding if you are already on 2026.8.6.',
      ],
    };
  }

  if (supportedVersions.has(normalizedSoftwareVersion.value)) {
    return {
      canInstall: true,
      status: 'ok',
      title: 'Version looks compatible',
      body: 'This version is currently in the confirmed-good set from the community guidance. You can move to the install video for your profile.',
      items: [
        `Profile match: ${selectedCar.value.title}.`,
        'Still verify the result with the Summon range check after install.',
      ],
    };
  }

  return {
    canInstall: false,
    status: 'warn',
    title: 'Version not confirmed yet',
    body: 'This version is not in the known-good list. It may still work, but the app should not tell you to continue blindly.',
    items: [
      'Check the FAQ and Slack before installing on an unknown Tesla software version.',
      'Known-good versions today are 2026.2.9 through 2026.2.9.3 and 2026.8.3.',
    ],
  };
});

const compatibilityCardClass = computed(() => {
  if (compatibilityState.value.status === 'ok') {
    return 'onboarding-support-card-success';
  }

  if (compatibilityState.value.status === 'blocked') {
    return 'onboarding-support-card-danger';
  }

  if (compatibilityState.value.status === 'warn') {
    return 'onboarding-support-card-warning';
  }

  return 'onboarding-support-card-neutral';
});

watch([selectedModel, buildYear, softwareVersion], () => {
  showVerification.value = false;
});

watch([hasDevice, hasFsd], () => {
  if (!canProceedToInstall.value) {
    selectedModel.value = null;
    buildYear.value = '';
    softwareVersion.value = '';
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
    selectedModel.value = null;
    buildYear.value = '';
    softwareVersion.value = '';
    showVerification.value = false;
  }
}

function acknowledgeFsdOptions() {
  reviewedFsdOptions.value = true;
}

function selectModel(modelId: ModelId) {
  selectedModel.value = modelId;
}
</script>
