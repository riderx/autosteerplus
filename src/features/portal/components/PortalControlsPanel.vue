<template>
  <k-card class="col-span-6 overflow-hidden rounded-[22px] border border-[rgba(60,60,67,0.14)] bg-[rgba(255,255,255,0.98)] p-[1.15rem] shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_28px_rgba(15,23,42,0.05)] max-[980px]:col-span-12">
    <div class="mb-[1.15rem] flex items-center justify-between gap-3">
      <div>
        <p class="mb-1.5 text-[0.74rem] font-semibold uppercase tracking-[0.08em] text-[#6e6e73]">Control</p>
        <h2 class="m-0 leading-[1.08] text-[#111111]">CAN hook gate</h2>
      </div>
    </div>
    <k-list strong-ios inset-ios class="m-0">
      <k-list-item
        title="Enable CAN hooks"
        text="When disabled, the device stays online and observable but stops enabling Full Self Driving in your vehicle."
      >
        <template #after>
          <k-toggle
            id="hooks-toggle"
            :checked="portalView.hooksEnabled"
            :disabled="portalView.hooksDisabled"
            @change="portalActions.toggleHooks(($event.target as HTMLInputElement).checked)"
          />
        </template>
      </k-list-item>
    </k-list>
    <p id="config-note" class="mt-4 text-[0.98rem] leading-[1.55] text-[rgba(60,60,67,0.82)]">
      {{ portalView.configNote }}
    </p>
  </k-card>
</template>

<script setup lang="ts">
import { kCard, kList, kListItem, kToggle } from 'konsta/vue';

import { portalActions, portalView } from '../view-model';
</script>
