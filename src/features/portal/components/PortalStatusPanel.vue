<template>
  <k-card class="col-span-12 overflow-hidden rounded-[22px] border border-[rgba(60,60,67,0.14)] bg-[rgba(255,255,255,0.98)] p-[1.15rem] shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_28px_rgba(15,23,42,0.05)]">
    <div class="mb-[1.15rem] flex items-center justify-between gap-3">
      <div>
        <p class="mb-1.5 text-[0.74rem] font-semibold uppercase tracking-[0.08em] text-[#6e6e73]">Device Snapshot</p>
        <h2 class="m-0 leading-[1.08] text-[#111111]">Runtime status</h2>
      </div>
      <PortalActionButton id="reboot-button" variant="ghost" :disabled="portalView.rebootDisabled" @click="portalActions.rebootDevice()">
        Reboot Device
      </PortalActionButton>
    </div>
    <div class="grid grid-cols-4 gap-4 max-[980px]:grid-cols-2 max-[640px]:grid-cols-1">
      <article class="grid gap-2 rounded-[18px] border border-[rgba(60,60,67,0.14)] bg-[rgba(255,255,255,0.94)] px-[1.1rem] py-[1rem]">
        <span class="text-[0.74rem] font-semibold uppercase tracking-[0.08em] text-[#6e6e73]">Device</span>
        <strong id="device-name" class="text-[1.05rem] text-[#111111]">{{ portalView.deviceName }}</strong>
      </article>
      <article class="grid gap-2 rounded-[18px] border border-[rgba(60,60,67,0.14)] bg-[rgba(255,255,255,0.94)] px-[1.1rem] py-[1rem]">
        <span class="text-[0.74rem] font-semibold uppercase tracking-[0.08em] text-[#6e6e73]">Firmware</span>
        <strong id="firmware-version" class="text-[1.05rem] text-[#111111]">{{ portalView.firmwareVersion }}</strong>
      </article>
      <article class="grid gap-2 rounded-[18px] border border-[rgba(60,60,67,0.14)] bg-[rgba(255,255,255,0.94)] px-[1.1rem] py-[1rem]">
        <span class="text-[0.74rem] font-semibold uppercase tracking-[0.08em] text-[#6e6e73]">CAN</span>
        <strong id="can-state" class="text-[1.05rem] text-[#111111]">{{ portalView.canState }}</strong>
      </article>
      <article class="grid gap-2 rounded-[18px] border border-[rgba(60,60,67,0.14)] bg-[rgba(255,255,255,0.94)] px-[1.1rem] py-[1rem]">
        <span class="text-[0.74rem] font-semibold uppercase tracking-[0.08em] text-[#6e6e73]">Hooks</span>
        <strong id="hooks-state" class="text-[1.05rem] text-[#111111]">{{ portalView.hooksState }}</strong>
      </article>
      <article class="grid gap-2 rounded-[18px] border border-[rgba(60,60,67,0.14)] bg-[rgba(255,255,255,0.94)] px-[1.1rem] py-[1rem]">
        <span class="text-[0.74rem] font-semibold uppercase tracking-[0.08em] text-[#6e6e73]">Profile</span>
        <strong id="profile-state" class="text-[1.05rem] text-[#111111]">{{ portalView.profileState }}</strong>
      </article>
      <article class="grid gap-2 rounded-[18px] border border-[rgba(60,60,67,0.14)] bg-[rgba(255,255,255,0.94)] px-[1.1rem] py-[1rem]">
        <span class="text-[0.74rem] font-semibold uppercase tracking-[0.08em] text-[#6e6e73]">Speed Offset</span>
        <strong id="speed-offset-state" class="text-[1.05rem] text-[#111111]">{{ portalView.speedOffsetState }}</strong>
      </article>
      <article class="grid gap-2 rounded-[18px] border border-[rgba(60,60,67,0.14)] bg-[rgba(255,255,255,0.94)] px-[1.1rem] py-[1rem]">
        <span class="text-[0.74rem] font-semibold uppercase tracking-[0.08em] text-[#6e6e73]">FSD Flag</span>
        <strong id="fsd-flag-state" class="text-[1.05rem] text-[#111111]">{{ portalView.fsdFlagState }}</strong>
      </article>
      <article class="grid gap-2 rounded-[18px] border border-[rgba(60,60,67,0.14)] bg-[rgba(255,255,255,0.94)] px-[1.1rem] py-[1rem]">
        <span class="text-[0.74rem] font-semibold uppercase tracking-[0.08em] text-[#6e6e73]">OTA</span>
        <strong id="ota-state" class="text-[1.05rem] text-[#111111]">{{ portalView.otaState }}</strong>
      </article>
    </div>
  </k-card>
</template>

<script setup lang="ts">
import { kCard } from 'konsta/vue';

import PortalActionButton from './PortalActionButton.vue';
import { portalActions, portalView } from '../view-model';
</script>
