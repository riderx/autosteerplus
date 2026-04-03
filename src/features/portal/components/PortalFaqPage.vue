<template>
  <div class="faq-page" :hidden="portalView.currentPage !== 'faq'">
    <header class="hero hero-auth faq-hero">
      <p class="eyebrow">FAQ</p>
      <h1 class="hero-title">autosteerplus</h1>
      <p class="hero-copy">
        Community-sourced answers collected from the `#fsd` channel discussions, organized into one place for fast
        reference.
      </p>
      <div class="docs-badge-row">
        <span class="docs-badge">Generated from `#fsd` channel discussions</span>
        <a
          class="docs-badge"
          href="https://teslaandroid.com/blogs/news/the-diagnostic-tool-facts-over-drama"
          target="_blank"
          rel="noreferrer"
        >
          Facts over drama article
        </a>
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
        <button class="button button-ghost" type="button" @click="portalActions.openDocs()">
          Docs
        </button>
        <button class="button button-secondary" type="button" @click="portalActions.openDashboard()">
          {{ portalView.authenticated ? 'Back to Dashboard' : 'Back to Sign In' }}
        </button>
      </div>
    </header>

    <main class="faq-layout">
      <section class="panel faq-panel">
        <div class="panel-heading">
          <div>
            <p class="panel-label">Shipping</p>
            <h2>Order delivery timeline</h2>
          </div>
        </div>
        <p class="muted-copy">
          Estimate updated on 27.03.2026. Subject to change depending on vehicle type and Tesla software changes in
          between. For delivery questions, ask in `#fsd-order-questions`.
        </p>
        <div class="faq-timeline">
          <article v-for="item in deliveryTimeline" :key="item.title" class="docs-step-card">
            <span class="metric-label">{{ item.range }}</span>
            <strong>{{ item.title }}</strong>
            <p class="muted-copy">{{ item.body }}</p>
          </article>
        </div>
      </section>

      <section class="panel faq-panel">
        <div class="panel-heading">
          <div>
            <p class="panel-label">Versions</p>
            <h2>Supported versions and update warnings</h2>
          </div>
        </div>
        <ul class="docs-inline-list">
          <li v-for="item in supportedVersions" :key="item">{{ item }}</li>
        </ul>
        <div class="faq-callout-grid">
          <article class="faq-callout faq-callout-warning">
            <p class="panel-label">Important</p>
            <h3>Do not update AMD cars to 2026.8.6 yet</h3>
            <p class="muted-copy">
              The dongle cannot bypass the region lock on AMD hardware on that version yet. A fix is still being
              developed.
            </p>
          </article>
          <article class="faq-callout">
            <p class="panel-label">Avoid auto updates</p>
            <h3>Keep Wi-Fi off if you need to avoid 2026.8.6</h3>
            <p class="muted-copy">
              Disable Wi-Fi, remove the stored SSID, and keep update preference on `Standard`. If 2026.8.6 is already
              downloaded, you do not have to install it and the prompt should disappear after some time.
            </p>
          </article>
        </div>
      </section>

      <section
        v-for="section in faqSections"
        :key="section.title"
        class="panel faq-panel"
      >
        <div class="panel-heading">
          <div>
            <p class="panel-label">{{ section.label }}</p>
            <h2>{{ section.title }}</h2>
          </div>
        </div>
        <p v-if="section.intro" class="muted-copy panel-note">{{ section.intro }}</p>
        <details v-for="entry in section.entries" :key="entry.question" class="faq-item">
          <summary>{{ entry.question }}</summary>
          <div class="faq-item-body">
            <p v-for="paragraph in entry.paragraphs ?? []" :key="paragraph" class="muted-copy">
              {{ paragraph }}
            </p>
            <ol v-if="entry.ordered?.length" class="docs-checklist">
              <li v-for="item in entry.ordered" :key="item">{{ item }}</li>
            </ol>
            <ul v-if="entry.bullets?.length" class="docs-inline-list">
              <li v-for="item in entry.bullets" :key="item">{{ item }}</li>
            </ul>
            <div v-if="entry.links?.length" class="hero-actions">
              <a
                v-for="link in entry.links"
                :key="link.url"
                class="button button-ghost"
                :href="link.url"
                target="_blank"
                rel="noreferrer"
              >
                {{ link.label }}
              </a>
            </div>
          </div>
        </details>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { portalActions, portalView } from '../view-model';

interface FaqLink {
  label: string;
  url: string;
}

interface FaqEntry {
  question: string;
  paragraphs?: string[];
  bullets?: string[];
  ordered?: string[];
  links?: FaqLink[];
}

interface FaqSection {
  label: string;
  title: string;
  intro?: string;
  entries: FaqEntry[];
}

const deliveryTimeline = [
  {
    range: '1-1750',
    title: 'Dispatch by 03.04',
    body: 'Orders up to 1750 were estimated to dispatch by April 3rd.',
  },
  {
    range: '1750-1950/2000',
    title: 'Dispatch by 15.04',
    body: 'Orders in this range were estimated to move after Easter, around April 15th.',
  },
  {
    range: '2000-2300',
    title: 'Dispatch by 25.04',
    body: 'Current rough estimate for this range was dispatch by April 25th.',
  },
  {
    range: 'Board supply',
    title: '200 boards arrived on 31.03',
    body: 'Another 150 units were planned to ship before Easter.',
  },
];

const supportedVersions = [
  '2026.2.9',
  '2026.2.9.1',
  '2026.2.9.2',
  '2026.2.9.3',
  '2026.8.3',
  '2026.8.6 (HW3 Intel) with mixed results. Wait for a proper cure before updating.',
];

const faqSections: FaqSection[] = [
  {
    label: 'Cancellation',
    title: 'Cancellations and refunds',
    entries: [
      {
        question: 'My item has not been dispatched. Can I cancel?',
        paragraphs: [
          'Send an email to store@teslaandroid.com and request cancellation. Since March 31st at 14:00, cancellations are handled automatically by AI for the store.',
          'For returns after delivery, use the official refund policy.',
        ],
        links: [
          { label: 'Refund policy', url: 'https://teslaandroid.com/policies/refund-policy' },
        ],
      },
    ],
  },
  {
    label: 'General',
    title: 'General questions',
    entries: [
      {
        question: 'What does autosteerplus do?',
        paragraphs: [
          'It removes the geofencing restriction on FSD so Full Self-Driving (Supervised) can work in regions where Tesla has not officially launched it yet.',
          'It also enables unrestricted Actually Smart Summon with a much larger range, and improves lane change plus Autosteer turn radius.',
        ],
      },
      {
        question: 'Does the tool need to stay plugged in for FSD to work?',
        paragraphs: [
          'Yes. The device must remain connected. If you unplug it, the car reverts to stock configuration.',
        ],
      },
      {
        question: 'Can I daisy-chain it with the S3XY Commander?',
        paragraphs: ['Yes, chain-linking with the Commander is supported.'],
      },
      {
        question: 'Is the tool configurable, for example ASS without FSD?',
        paragraphs: [
          'AP and EAP improvements are still in progress and pending OTA.',
          'The tool is expected to be rebranded to Autosteer Plus, which may expose more granular options later.',
        ],
      },
      {
        question: 'Does the tool receive updates?',
        paragraphs: [
          'Yes. OTA update support is already built in, and future Tesla firmware changes are expected to be handled through device OTA updates.',
        ],
      },
      {
        question: 'Can I move it between multiple cars?',
        paragraphs: [
          'Yes, as long as both cars have FSD. You can move the device between cars and buy an extra harness for the other vehicle if needed.',
        ],
        links: [
          { label: 'Example harness source', url: 'https://enhauto.com' },
        ],
      },
      {
        question: 'How do I control or update the device?',
        paragraphs: [
          'Use the web interface at fsd.teslaandroid.com.',
          'That requires a Web Bluetooth compatible browser. Chrome works on Windows, Linux, Android and macOS. On iOS, Bluefy works while Safari and most other browsers do not.',
        ],
        links: [
          { label: 'Web interface', url: 'https://fsd.teslaandroid.com' },
          { label: 'Bluefy on App Store', url: 'https://apps.apple.com/app/id1492822055' },
        ],
      },
    ],
  },
  {
    label: 'Purchase',
    title: 'Purchasing and subscription',
    entries: [
      {
        question: 'Do I need to have FSD purchased or subscribed to use this?',
        paragraphs: [
          'Yes. The tool only removes geofencing. Without FSD purchased outright or an active FSD subscription, it will not enable FSD for you.',
        ],
      },
      {
        question: 'Can I subscribe to FSD instead of buying it outright?',
        paragraphs: [
          'Yes. You can transfer the car to a Canadian Tesla account and subscribe there. This is often cheaper than buying FSD outright.',
        ],
      },
      {
        question: 'How do I subscribe via a Canadian account?',
        ordered: [
          'Create a brand-new Tesla account with region set to Canada.',
          'Transfer your vehicle to that account.',
          'Subscribe to FSD from the Tesla app once the Upgrades menu appears.',
        ],
        paragraphs: [
          'Do not just change the country on your existing account. The community guidance is to create a completely new account in the target country and transfer the car there.',
        ],
      },
      {
        question: 'If I subscribe via Canada and switch back, is the subscription cancelled?',
        paragraphs: [
          'Yes. Switching back to the original account cancels the subscription.',
          'Some users reported that changing the original account region to Canada and back can expose the ability to subscribe, but another user reported their account disappeared, so that path is not recommended.',
          'Another community note is that switching between accounts may lose charging stats, so staying on one country and one account is safer.',
        ],
      },
      {
        question: 'I do not see the Upgrades menu in my app or car. What should I do?',
        paragraphs: [
          'Some markets do not show the Upgrades menu at all. Creating a new account in the US or Canada and transferring the vehicle there should make the tab appear.',
        ],
      },
      {
        question: 'How much does the FSD subscription cost?',
        paragraphs: [
          'In Canada it is about $99 CAD per month, roughly around 60 EUR per month depending on exchange rate.',
        ],
      },
    ],
  },
  {
    label: 'Compatibility',
    title: 'Compatibility',
    entries: [
      {
        question: 'Which Tesla models are supported?',
        paragraphs: [
          'Model 3 and Model Y are supported. Model S and X support is more limited, currently with AMD-only support for some S/X cases.',
          'Intel MCU support is limited. Pre-Raven Model X uses a different harness and is still being worked on.',
        ],
      },
      {
        question: 'Does it work with HW3?',
        paragraphs: ['Yes. HW3 cars get FSD v12.6.4, which the community considers functionally equivalent to v13 behavior on HW4 for the key areas discussed.'],
      },
      {
        question: 'Does it work with HW4?',
        paragraphs: ['Yes. HW4 cars get the newer FSD stack, v13 or newer.'],
      },
      {
        question: 'What FSD version will I get?',
        paragraphs: [
          'You can ask the AI assistant in the Tesla app Service section for your current FSD version. In general, HW3 tends toward v12.6.4 and HW4 toward v13 or higher.',
        ],
      },
      {
        question: 'Does it work on right-hand-drive cars?',
        paragraphs: [
          'It works, but the current stack is not optimized for RHD roads yet. Future Tesla updates, especially later v14 builds, are expected to improve that and the tool can follow up via OTA.',
        ],
      },
      {
        question: 'Does it work in China?',
        paragraphs: ['Yes, as long as FSD is purchased, the tool can activate it there as well.'],
      },
    ],
  },
  {
    label: 'Risk',
    title: 'Safety, warranty and bans',
    entries: [
      {
        question: 'Will Tesla ban or block my car?',
        paragraphs: [
          'Community consensus is that a mass ban is unlikely because Tesla is still getting paid via purchase or subscription. The device also disables telemetry automatically.',
        ],
      },
      {
        question: 'Does it void my warranty?',
        paragraphs: [
          'It can affect warranty the same way any third-party CANBUS device can. The common advice is to unplug it before service appointments because the car reverts to stock when unplugged.',
        ],
      },
      {
        question: 'Are logs left on the car after unplugging?',
        paragraphs: [
          'Vehicle logs can remain for about 14 days at a forensic level, although service centers are unlikely to inspect that deeply unless you raise an issue specifically about FSD.',
        ],
      },
      {
        question: 'Does it disable telemetry?',
        paragraphs: ['Yes, telemetry is disabled automatically by the device.'],
      },
      {
        question: 'Does the car appear to be in the US after using the tool?',
        paragraphs: [
          'No. The car still appears where it physically is based on GPS. The tool removes geofencing restrictions but does not virtually relocate the vehicle.',
        ],
      },
      {
        question: 'Can Tesla patch this?',
        paragraphs: [
          'It would be difficult without changing how FSD configuration is handled over CAN, and that would impact third-party accessories too. Community expectation is that hardening efforts can be matched with OTA updates to the tool.',
        ],
      },
      {
        question: 'What about insurance after an accident?',
        paragraphs: [
          'Community guidance is cautious here: if insurance learns about an unauthorized modification after an accident, that can create coverage risk. The practical advice shared was to remove the dongle before an expert inspects the car.',
        ],
      },
    ],
  },
  {
    label: 'Europe',
    title: 'FSD driving behavior in Europe',
    entries: [
      {
        question: 'Does FSD follow right-of-way from the right in Europe?',
        paragraphs: [
          'Yes, users reported it working correctly in Switzerland on v12.6.4. France was reported as less reliable, so caution is still advised.',
        ],
      },
      {
        question: 'Does FSD stop for pedestrians at zebra crossings?',
        paragraphs: ['Yes, users reported v12.6.4 handling zebra crossings correctly.'],
      },
      {
        question: 'How does FSD perform in France?',
        paragraphs: ['Users reported it can work well, but the country-specific behavior still needs caution and close supervision.'],
      },
      {
        question: 'How does FSD perform in the UK?',
        paragraphs: [
          'The current stack is still optimized for driving on the right, so UK behavior is not ideal yet. Community expectation is that future Tesla releases will improve left-hand-driving behavior.',
        ],
      },
    ],
  },
  {
    label: 'Orders',
    title: 'Shipping and orders',
    entries: [
      {
        question: 'What is the current shipping status?',
        paragraphs: [
          'As of April 2nd 2026, orders up to roughly 1750 were prioritized and FedEx waves of 30 to 50 orders were going out regularly as customs cleared.',
        ],
      },
      {
        question: 'How long does shipping take?',
        paragraphs: ['Orders are shipped via FedEx International Priority. Within the EU, community reports were around one to two days once shipped.'],
      },
      {
        question: 'Can I pay for expedited shipping?',
        paragraphs: ['Not currently available.'],
      },
    ],
  },
  {
    label: 'Troubleshooting',
    title: 'Troubleshooting',
    entries: [
      {
        question: 'I transferred my car but it does not appear in the new account',
        paragraphs: [
          'Community expectation is that it should be instant. If it does not appear, creating a completely new account instead of changing country on an existing one is the first thing to try.',
          'If access is lost entirely, contact Tesla support to reattach the car to your VIN.',
        ],
      },
      {
        question: 'I have a pending service appointment. Will I lose it if I transfer accounts?',
        paragraphs: [
          'Possibly. Service requests are tied to the account. Some users reported service centers were still flexible and contacted them anyway, but you may want to contact the service center directly to reconnect the appointment to your VIN.',
        ],
      },
    ],
  },
  {
    label: 'Manual',
    title: 'FSD subscription manual',
    intro: 'If you have not purchased FSD outright, you can subscribe monthly through a Canadian Tesla account.',
    entries: [
      {
        question: 'Step-by-step manual',
        ordered: [
          'Create a new Tesla account at tesla.com/en_ca with region set to Canada.',
          'Add a payment card that supports international transactions. If Tesla asks for a Canadian postal code, use T4A 2G4.',
          'Open the Tesla app on the original account, go to Manage Drivers, and transfer the car to the Canadian account.',
          'Log in with the Canadian account and start the FSD subscription for $99 CAD per month.',
        ],
      },
    ],
  },
];
</script>
