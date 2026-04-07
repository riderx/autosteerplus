<template>
  <k-card class="col-span-6 overflow-hidden rounded-[22px] border border-[rgba(60,60,67,0.14)] bg-[rgba(255,255,255,0.98)] p-[1.15rem] shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_28px_rgba(15,23,42,0.05)] max-[980px]:col-span-12">
    <div class="mb-[1.15rem] flex items-center justify-between gap-3">
      <div>
        <p class="mb-1.5 text-[0.74rem] font-semibold uppercase tracking-[0.08em] text-[#6e6e73]">OTA</p>
        <h2 class="m-0 leading-[1.08] text-[#111111]">Install firmware</h2>
      </div>
    </div>
    <p class="text-[0.98rem] leading-[1.55] text-[rgba(60,60,67,0.82)]">
      Select the firmware package approved for your device, then transfer it over Web Bluetooth.
    </p>
    <div id="install-options" class="mt-4 flex flex-wrap gap-3">
      <PortalActionButton
        v-for="pkg in portalView.installPackages"
        :key="pkg.id"
        :disabled="pkg.disabled"
        @click="portalActions.installPackage(pkg.id)"
      >
        {{ pkg.label }}
      </PortalActionButton>
    </div>
    <p id="package-note" class="mt-4 text-[0.98rem] leading-[1.55] text-[rgba(60,60,67,0.82)]">
      {{ portalView.packageNote }}
    </p>
    <div
      v-if="portalView.otaActivityVisible"
      class="mt-4 flex flex-wrap items-center gap-3"
    >
      <PortalActionButton id="ota-abort-button" variant="secondary" :disabled="portalView.abortOtaDisabled" @click="portalActions.abortOta()">
        Abort OTA
      </PortalActionButton>
    </div>
    <div v-if="portalView.otaActivityVisible" class="mt-5 grid gap-3">
      <div class="flex items-center justify-between gap-3 text-[0.95rem] font-medium text-[rgba(60,60,67,0.82)]">
        <span id="progress-label">{{ portalView.progressLabel }}</span>
        <span id="progress-percent">{{ portalView.progressPercentText }}</span>
      </div>
      <k-progressbar id="progress-bar" :progress="portalView.progressPercent / 100" />
    </div>
  </k-card>
</template>

<script setup lang="ts">
import { kCard, kProgressbar } from 'konsta/vue';

import PortalActionButton from './PortalActionButton.vue';
import { portalActions, portalView } from '../view-model';
</script>
