<template>
  <k-block
    strong-ios
    inset-ios
    class="relative mb-4 overflow-hidden rounded-[22px] border border-[rgba(60,60,67,0.14)] bg-[rgba(255,255,255,0.98)] px-[1.4rem] pb-[1.45rem] pt-[1.35rem] shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_28px_rgba(15,23,42,0.05)]"
  >
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="mb-1.5 text-[0.74rem] font-semibold uppercase tracking-[0.08em] text-[#6e6e73]">Device Manager</p>
        <h1 class="m-0 text-[clamp(2rem,5vw,3.1rem)] leading-[0.96] tracking-[-0.03em] text-[#111111]">Autosteerplus</h1>
      </div>
      <div class="relative">
        <button
          type="button"
          class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[rgba(60,60,67,0.2)] bg-white text-[0.95rem] font-semibold text-[#111111]"
          @click="accountOpen = !accountOpen"
        >
          <span class="sr-only">Account menu</span>
          <svg viewBox="0 0 24 24" class="h-5 w-5" aria-hidden="true">
            <path
              d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-3.3 0-6 2.1-6 4.8a1.2 1.2 0 0 0 1.2 1.2h9.6a1.2 1.2 0 0 0 1.2-1.2C18 16.1 15.3 14 12 14Z"
              fill="currentColor"
            />
          </svg>
        </button>
        <div
          v-if="accountOpen"
          class="absolute right-0 z-10 mt-2 w-44 rounded-[16px] border border-[rgba(60,60,67,0.18)] bg-white p-1 shadow-[0_6px_18px_rgba(15,23,42,0.12)]"
        >
          <button
            v-if="portalView.showChangePasswordButton"
            type="button"
            class="w-full rounded-[12px] px-3 py-2 text-left text-[0.95rem] text-[#111111] hover:bg-[rgba(10,96,255,0.08)]"
            @click="portalActions.openPasswordDialog(); accountOpen = false"
          >
            Change Password
          </button>
          <button
            v-if="portalView.showLogoutButton"
            type="button"
            class="w-full rounded-[12px] px-3 py-2 text-left text-[0.95rem] text-[#111111] hover:bg-[rgba(10,96,255,0.08)]"
            @click="portalActions.logout(); accountOpen = false"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
    <p class="mt-3 max-w-2xl text-[1rem] leading-[1.55] text-[rgba(60,60,67,0.82)]">
      OTA updates, presets, and device diagnostics.
    </p>
    <div class="mt-5 flex flex-wrap items-center gap-3">
      <PortalActionButton
        v-if="!portalView.connectionOnline"
        id="connect-button"
        :disabled="portalView.connectDisabled"
        @click="portalActions.connect()"
      >
        Connect Device
      </PortalActionButton>
      <PortalActionButton
        v-if="portalView.connectionOnline"
        id="disconnect-button"
        variant="secondary"
        :disabled="portalView.disconnectDisabled"
        @click="portalActions.disconnect()"
      >
        Disconnect
      </PortalActionButton>
      <PortalActionButton
        v-if="portalView.connectionOnline"
        id="refresh-button"
        variant="ghost"
        :disabled="portalView.refreshDisabled"
        @click="portalActions.refreshStatus()"
      >
        Refresh Status
      </PortalActionButton>
      <PortalActionButton variant="ghost" @click="portalActions.openOnboarding()">
        Onboarding
      </PortalActionButton>
      <PortalActionButton variant="ghost" @click="portalActions.openDocs()">
        Docs
      </PortalActionButton>
      <PortalActionButton v-if="portalView.connectionOnline" variant="ghost" @click="portalActions.toggleAdvancedMode()">
        {{ portalView.advancedMode ? 'Basic Mode' : 'Advanced Mode' }}
      </PortalActionButton>
    </div>
    <div class="mt-6 flex flex-wrap items-center gap-3">
      <k-chip
        id="connection-pill"
        class="border border-[rgba(60,60,67,0.14)] bg-[rgba(255,255,255,0.92)]"
        :class="portalView.connectionOnline ? '!text-[#136c37]' : '!text-[#ff3b30]'"
        :hidden="!portalView.connectionOnline"
      >
        {{ portalView.connectionLabel }}
      </k-chip>
    </div>
  </k-block>
</template>

<script setup lang="ts">
import { kBlock, kChip } from 'konsta/vue';

import PortalActionButton from './PortalActionButton.vue';
import { ref } from 'vue';
import { portalActions, portalView } from '../view-model';

const accountOpen = ref(false);
</script>
