<template>
  <k-block
    strong-ios
    inset-ios
    class="relative mb-4 overflow-hidden rounded-[22px] border border-[rgba(60,60,67,0.14)] bg-[rgba(255,255,255,0.98)] px-[1.4rem] pb-[1.45rem] pt-[1.35rem] shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_28px_rgba(15,23,42,0.05)]"
  >
    <p class="mb-1.5 text-[0.74rem] font-semibold uppercase tracking-[0.08em] text-[#6e6e73]">Device Manager</p>
    <h1 class="m-0 text-[clamp(2.1rem,5vw,3.25rem)] leading-[0.96] tracking-[-0.03em] text-[#111111]">Autosteerplus</h1>
    <p class="mt-3 max-w-2xl text-[1rem] leading-[1.55] text-[rgba(60,60,67,0.82)]">
      OTA updates, presets, and device diagnostics.
    </p>
    <div class="mt-6 flex flex-wrap items-center gap-3">
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
      <PortalActionButton
        id="change-password-button"
        variant="ghost"
        :hidden="!portalView.showChangePasswordButton"
        @click="portalActions.openPasswordDialog()"
      >
        Change Password
      </PortalActionButton>
      <PortalActionButton
        id="logout-button"
        variant="secondary"
        :hidden="!portalView.showLogoutButton"
        @click="portalActions.logout()"
      >
        Log Out
      </PortalActionButton>
    </div>
    <div class="mt-6 flex flex-wrap items-center gap-3">
      <k-chip
        id="connection-pill"
        class="border border-[rgba(60,60,67,0.14)] bg-[rgba(255,255,255,0.92)]"
        :class="portalView.connectionOnline ? '!text-[#136c37]' : '!text-[#ff3b30]'"
      >
        {{ portalView.connectionLabel }}
      </k-chip>
    </div>
  </k-block>
</template>

<script setup lang="ts">
import { kBlock, kChip } from 'konsta/vue';

import PortalActionButton from './PortalActionButton.vue';
import { portalActions, portalView } from '../view-model';
</script>
