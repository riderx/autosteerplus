<template>
  <k-page class="onboarding-page portal-page" :hidden="portalView.currentPage !== 'onboarding'">
    <div class="portal-content-shell">
      <header class="px-1 pb-2 pt-1">
        <h1 class="m-0 text-[clamp(2.1rem,5vw,3.25rem)] leading-[0.96] tracking-[-0.03em] text-[#111111]">Autosteerplus onboarding</h1>
      </header>

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
          Pick the model first, then choose the matching build-year range. From that, the app will tell you whether this onboarding
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
        <div v-if="modelYearOptions.length" class="onboarding-choice-grid onboarding-year-grid">
          <button
            v-for="option in modelYearOptions"
            :key="option.id"
            type="button"
            class="onboarding-choice"
            :class="{ 'is-active': selectedYearBand === option.id }"
            :aria-pressed="selectedYearBand === option.id"
            @click="selectYearBand(option.id)"
          >
            <span class="metric-label">{{ option.kicker }}</span>
            <strong>{{ option.title }}</strong>
            <p class="muted-copy">{{ option.body }}</p>
          </button>
        </div>
        <p v-if="modelYearOptions.length" class="muted-copy panel-note">
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
          mixed, blocked, or still unknown for this setup. The Tesla software version decides install safety. The
          expected FSD branch comes from the car profile you picked above.
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
        <div class="onboarding-version-presets">
          <button
            v-for="version in popularSoftwareVersions"
            :key="version"
            type="button"
            class="docs-badge onboarding-version-chip"
            :class="{ 'is-active': softwareVersion === version }"
            @click="softwareVersion = version"
          >
            {{ version }}
          </button>
        </div>
        <div v-if="normalizedSoftwareVersion" class="onboarding-step4-grid">
          <article class="onboarding-support-card onboarding-support-card-accent">
            <p class="panel-label">Expected FSD version</p>
            <h3>{{ expectedFsdState.title }}</h3>
            <p class="muted-copy">{{ expectedFsdState.body }}</p>
            <ul class="docs-inline-list">
              <li v-for="item in expectedFsdState.items" :key="item">{{ item }}</li>
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
        <p v-if="normalizedSoftwareVersion" class="muted-copy panel-note onboarding-step4-note">
          Want the exact FSD build number, not just 12 / 13 / 14? Ask the Tesla app Service AI assistant after checking
          the car profile and software version here.
        </p>
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
            <h2>Do the install</h2>
          </div>
        </div>
        <p class="muted-copy">
          You already matched the correct video above. Use the checklist below while you work. If the interior or
          connector path does not match what you saw in the selected video, stop and ask before forcing anything.
        </p>
        <div class="hero-actions">
          <PortalActionButton
            variant="ghost"
            :href="selectedInstallGuide.videoUrl"
            target="_blank"
            rel="noreferrer"
          >
            Open the selected video again
          </PortalActionButton>
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
import { kPage } from 'konsta/vue';

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
  videoUrl: string;
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
  featureTitle: string;
  featureBody: string;
  featureHighlights: string[];
  exactFsdHint: string;
  installNote: string;
}

type YearBandId = 'older' | 'newer' | 'unsure';

interface YearBandOption {
  id: YearBandId;
  kicker: string;
  title: string;
  body: string;
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
    videoUrl: 'https://www.youtube.com/watch?v=AFFVvfFIPFY',
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
    videoUrl: 'https://www.youtube.com/watch?v=ifwJNZgykVI',
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
    expectedFsd: 'If the car is on 2026.2.9.x, expect FSD 14-family on HW4. If it is on 2026.8.3, expect FSD 13.',
    expectedFsdTitle: 'Newer HW4 / Highland stack',
    expectedFsdBody: 'Highland cars should be on the newer supervised branch, not the older HW3 fallback path. Think newer-stack behavior first.',
    featureTitle: 'Newer-stack supervised behavior',
    featureBody: 'On this profile, the point is not just unlocking the menu. The goal is to get the newer real-world supervised behavior set the HW4 branch is known for.',
    featureHighlights: [
      'Expect the newer branch: usually v13 today, with later v14-family builds over time.',
      'Lane changes, turn handling, and roundabouts should feel closer to the full supervised stack.',
      'Actually Smart Summon should move to the larger unlocked range once the install works.',
      'If the cabin camera can see you properly, nagging should feel lighter than the restricted fallback path.',
    ],
    exactFsdHint: 'Open the Tesla app, go to Service, ask the AI assistant for the current FSD version, and use that as the exact-number check for this newer-car profile.',
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
    expectedFsd: 'Older Model 3 / HW3 cars are on the FSD 12 branch for now, not FSD 13 or 14.',
    expectedFsdTitle: 'HW3 / legacy stack',
    expectedFsdBody: 'Older Model 3 cars should be thought of as the HW3 branch. Expect v12.6.4-style behavior, not the newer HW4 v13/v14 family.',
    featureTitle: 'Older-stack supervised behavior',
    featureBody: 'This profile still aims for the real supervised behavior set, but on the HW3 branch. The gains matter most in how the car behaves, not in a bigger version number.',
    featureHighlights: [
      'Expect the HW3 branch: usually FSD v12.6.4.',
      'You should still gain the practical improvements users care about: lane changes, turns, and roundabouts.',
      'Actually Smart Summon should still expand to the larger unlocked circle if the install took effect.',
      'This path is more sensitive around 2026.8.6, so the firmware compatibility result matters more here.',
    ],
    exactFsdHint: 'Use the Tesla app Service AI assistant to ask for the current FSD version. On this older-car profile, the answer typically points to v12.6.4 rather than the newer HW4 branch.',
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
    expectedFsd: 'If the car is on 2026.2.9.x, expect FSD 14-family on HW4. If it is on 2026.8.3, expect FSD 13.',
    expectedFsdTitle: 'Newer Model Y / Juniper stack',
    expectedFsdBody: 'Juniper should follow the newer-car path once FSD access is set correctly on the Tesla side. Treat it like the newer HW4 family, not the older fallback branch.',
    featureTitle: 'Newer-stack supervised behavior',
    featureBody: 'This should behave like the newer supervised path: the practical benefit is the richer driving stack, not just an unlocked toggle.',
    featureHighlights: [
      'Expect the newer branch: usually v13 now, with later v14-family updates as Tesla rolls them out.',
      'The unlocked behavior should include better lane changes, turns, and roundabouts.',
      'Actually Smart Summon should expand to the larger unlocked range when the install succeeds.',
      'If the cabin camera sees you properly, the experience should feel closer to real supervised FSD than the regional fallback.',
    ],
    exactFsdHint: 'To confirm the exact FSD version, ask the Tesla app Service AI assistant. On this Juniper profile, you should expect the newer HW4 branch rather than the older HW3 number.',
    installNote: 'Install path: use the shared old Model 3 / Juniper video, then verify with the Summon range check.',
  },
];

const supportedVersions = new Set(['2026.2.9', '2026.2.9.1', '2026.2.9.2', '2026.2.9.3', '2026.8.3']);
const popularSoftwareVersions = ['2026.8.3', '2026.2.9.3', '2026.8.6'];

const hasDevice = ref<boolean | null>(null);
const hasFsd = ref<boolean | null>(null);
const reviewedFsdOptions = ref(false);
const selectedModel = ref<ModelId | null>(null);
const selectedYearBand = ref<YearBandId | null>(null);
const softwareVersion = ref('');
const showVerification = ref(false);

const modelYearOptions = computed<YearBandOption[]>(() => {
  if (selectedModel.value === '3') {
    return [
      {
        id: 'older',
        kicker: 'Year range',
        title: '2017 to 2023',
        body: 'Model 3 before Highland.',
      },
      {
        id: 'newer',
        kicker: 'Year range',
        title: 'Late 2023 / 2024 and newer',
        body: 'Model 3 Highland / refresh.',
      },
      {
        id: 'unsure',
        kicker: 'Need to check',
        title: 'I am not sure',
        body: 'Stop here and confirm the year before touching trim.',
      },
    ];
  }

  if (selectedModel.value === 'y') {
    return [
      {
        id: 'older',
        kicker: 'Year range',
        title: '2020 to 2024',
        body: 'Model Y before Juniper.',
      },
      {
        id: 'newer',
        kicker: 'Year range',
        title: '2025 and newer',
        body: 'Model Y Juniper / refresh.',
      },
      {
        id: 'unsure',
        kicker: 'Need to check',
        title: 'I am not sure',
        body: 'Stop here and confirm the year before touching trim.',
      },
    ];
  }

  return [];
});

const selectedCarId = computed<CarOptionId | null>(() => {
  if (!selectedModel.value) {
    return null;
  }

  if (selectedModel.value === '3') {
    if (selectedYearBand.value === 'older') {
      return 'model3-legacy';
    }

    if (selectedYearBand.value === 'newer') {
      return 'model3-highland';
    }

    return null;
  }

  if (selectedModel.value === 'y') {
    return selectedYearBand.value === 'newer' ? 'modely-juniper' : null;
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
      body: 'Start with Model 3, Y, S, or X. Then choose the matching year range so the app can tell you whether this onboarding path is covered.',
      items: ['This step should decide coverage and video before you touch trim.'],
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

  if (!selectedYearBand.value) {
    return {
      canInstall: false,
      status: 'idle',
      title: 'Choose the year range',
      body: 'Use the registration, Tesla app, or door sticker and pick the matching year band instead of typing it manually.',
      items: ['The year range is enough for this step. You do not need to identify Ryzen, Intel, HW3, or HW4 yourself.'],
    };
  }

  if (selectedYearBand.value === 'unsure') {
    return {
      canInstall: false,
      status: 'warn',
      title: 'Confirm the year first',
      body: 'Do not guess here. Check the Tesla app, registration, or door sticker, then come back and choose the correct year range.',
      items: ['This step is meant to choose the right install path before you touch trim.'],
    };
  }

  if (selectedModel.value === 'y' && selectedYearBand.value === 'older') {
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

const expectedFsdState = computed(() => {
  if (!selectedCar.value || !normalizedSoftwareVersion.value) {
    return {
      title: 'Pick a version first',
      body: 'Select the Tesla software version on the car to map it to the expected FSD branch.',
      items: [] as string[],
    };
  }

  if (selectedCar.value.compatibilityGroup === 'older') {
    return {
      title: 'Expect FSD 12 on this HW3 path',
      body: 'All older Model 3 / HW3 cars are still on the FSD 12 branch for now. Do not expect FSD 13 or 14 on this path today.',
      items: [
        'Current practical expectation: FSD v12.6.4 on HW3.',
        'The Tesla software version matters for compatibility, but not because HW3 jumps to v13 or v14 here.',
      ],
    };
  }

  if (normalizedSoftwareVersion.value.startsWith('2026.2.9')) {
    return {
      title: 'Expect FSD 14 on this HW4 path',
      body: 'On newer HW4 cars, the 2026.2.9.x software line maps to the FSD 14 family rather than the older FSD 13 branch.',
      items: [
        'Community reference: 2026.2.9.3 apparently contains FSD 14.2.2.5 on HW4.',
        'Use this as the newer-car expectation for Highland and Juniper profiles.',
      ],
    };
  }

  if (normalizedSoftwareVersion.value === '2026.8.3') {
    return {
      title: 'Expect FSD 13 on this HW4 path',
      body: 'On newer HW4 cars, 2026.8.3 is associated with the FSD 13 branch, not the FSD 14 family.',
      items: [
        'Do not assume the higher Tesla software number means a newer FSD branch than 2026.2.9.x.',
        'Use the compatibility card separately to decide whether this branch is safe to install on.',
      ],
    };
  }

  if (normalizedSoftwareVersion.value === '2026.8.6') {
    return {
      title: 'This is still the newer HW4 branch, but blocked here',
      body: 'Treat 2026.8.6 as part of the newer-car line, but do not use it for the supported HW4 install path right now.',
      items: [
        'The app should treat this as blocked on newer Highland / Juniper cars.',
        'Wait for updated community guidance before proceeding on this version.',
      ],
    };
  }

  return {
    title: 'Likely newer HW4 branch',
    body: 'This is still a newer-car HW4 profile, but this Tesla software version is not mapped precisely enough here to say FSD 13 or 14 with confidence.',
    items: [
      'Use the Tesla app Service AI assistant if you need the exact FSD branch for this unknown software version.',
      'Do not rely on guesswork when the firmware is outside the known mapping.',
    ],
  };
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

watch([selectedModel, selectedYearBand, softwareVersion], () => {
  showVerification.value = false;
});

watch([hasDevice, hasFsd], () => {
  if (!canProceedToInstall.value) {
    selectedModel.value = null;
    selectedYearBand.value = null;
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
    selectedYearBand.value = null;
    softwareVersion.value = '';
    showVerification.value = false;
  }
}

function acknowledgeFsdOptions() {
  reviewedFsdOptions.value = true;
}

function selectModel(modelId: ModelId) {
  selectedModel.value = modelId;
  selectedYearBand.value = null;
}

function selectYearBand(yearBandId: YearBandId) {
  selectedYearBand.value = yearBandId;
}
</script>
