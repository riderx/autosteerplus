<template>
  <k-page id="app-shell" class="bg-transparent" :hidden="!portalView.authenticated || portalView.currentPage !== 'dashboard'">
    <PortalPasswordGate />
    <PortalPasskeySetupGate />
    <div class="mx-auto grid w-full max-w-260 gap-6">
      <PortalHeader />

      <main id="dashboard" class="grid grid-cols-12 gap-6">
        <k-card
          v-if="!portalView.connectionOnline"
          class="col-span-12 overflow-hidden rounded-[22px] border border-[rgba(60,60,67,0.14)] bg-[rgba(255,255,255,0.98)] p-[1.15rem] shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_28px_rgba(15,23,42,0.05)]"
        >
          <div class="mb-[1.15rem] flex items-center justify-between gap-3">
            <div>
              <p class="mb-1.5 text-[0.74rem] font-semibold uppercase tracking-[0.08em] text-[#6e6e73]">Next step</p>
              <h2 class="m-0 leading-[1.08] text-[#111111]">Connect your device first</h2>
            </div>
          </div>
          <p class="text-[0.98rem] leading-[1.55] text-[rgba(60,60,67,0.82)]">
            Runtime status, CAN controls, OTA installs, and the advanced tools only make sense once the device is
            connected over Bluetooth.
          </p>
        </k-card>

        <template v-else>
          <k-card
            v-if="portalView.managementUpgradeVisible || (portalView.alternateManagementVisible && portalView.alternateManagementNote !== '')"
            class="col-span-12 overflow-hidden rounded-[22px] border border-[rgba(10,96,255,0.16)] bg-[rgba(10,96,255,0.05)] p-[1.15rem] shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_28px_rgba(15,23,42,0.05)]"
          >
            <p class="mb-1.5 text-[0.74rem] font-semibold uppercase tracking-[0.08em] text-[#0a60ff]">
              Device Manager
            </p>
            <p
              v-if="portalView.managementUpgradeVisible"
              class="m-0 text-[0.98rem] leading-[1.55] text-[#0a60ff]"
            >
              {{ portalView.managementUpgradeNote }}
            </p>
            <p
              v-if="portalView.alternateManagementVisible && portalView.alternateManagementNote !== ''"
              class="mt-2 text-[0.98rem] leading-[1.55] text-[#0a60ff]"
            >
              {{ portalView.alternateManagementNote }}
            </p>
          </k-card>

          <PortalStatusPanel />
          <PortalControlsPanel />
          <PortalOtaPanel />
        </template>
        <k-card
          v-if="portalView.connectionOnline && !portalView.advancedMode"
          class="col-span-12 overflow-hidden rounded-[22px] border border-[rgba(60,60,67,0.14)] bg-[rgba(255,255,255,0.98)] p-[1.15rem] shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_28px_rgba(15,23,42,0.05)]"
        >
          <div class="mb-[1.15rem] flex items-center justify-between gap-3">
            <div>
              <p class="mb-1.5 text-[0.74rem] font-semibold uppercase tracking-[0.08em] text-[#6e6e73]">Mode</p>
              <h2 class="m-0 leading-[1.08] text-[#111111]">Basic mode is active</h2>
            </div>
          </div>
          <p class="text-[0.98rem] leading-[1.55] text-[rgba(60,60,67,0.82)]">
            Switch to advanced mode if you need passkeys, admin controls, or the live session log.
          </p>
        </k-card>
        <PortalAdminPanel v-if="portalView.connectionOnline && portalView.advancedMode" />
        <PortalPasskeysPanel v-if="portalView.connectionOnline && portalView.advancedMode" />
        <PortalSessionLogPanel v-if="portalView.connectionOnline && portalView.advancedMode" />
      </main>
      <div class="px-safe-1 pb-safe-2 pt-2 text-center text-[0.78rem] font-medium tracking-[-0.01em] text-[rgba(60,60,67,0.62)]">
        autosteerplus v{{ appVersion }}
      </div>
    </div>
  </k-page>
</template>

<script setup lang="ts">
import { kCard, kPage } from 'konsta/vue';

import PortalAdminPanel from './PortalAdminPanel.vue';
import PortalControlsPanel from './PortalControlsPanel.vue';
import PortalHeader from './PortalHeader.vue';
import PortalOtaPanel from './PortalOtaPanel.vue';
import PortalPasskeysPanel from './PortalPasskeysPanel.vue';
import PortalPasskeySetupGate from './PortalPasskeySetupGate.vue';
import PortalPasswordGate from './PortalPasswordGate.vue';
import PortalSessionLogPanel from './PortalSessionLogPanel.vue';
import PortalStatusPanel from './PortalStatusPanel.vue';
import { portalView } from '../view-model';
import { APP_VERSION } from '../../../app-version';

const appVersion = APP_VERSION;
</script>
