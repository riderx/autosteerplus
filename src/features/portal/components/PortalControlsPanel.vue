<template>
  <section
    :class="['col-span-6 max-[980px]:col-span-12', panelClass]"
  >
    <div :class="panelHeadingClass">
      <div :class="sectionTextStackClass">
        <p :class="panelLabelClass">Device Manager</p>
        <h2 :class="sectionTitleClass">Preset and payload controls</h2>
      </div>
    </div>

    <p :class="['mt-4', mutedTextClass]">
      {{ portalView.managementModeSummary }}
    </p>

    <label
      class="mt-5 grid gap-4 overflow-hidden rounded-[22px] border border-[rgba(60,60,67,0.14)] bg-[rgba(255,255,255,0.94)] px-5 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start"
      for="hooks-toggle"
    >
      <div class="grid min-w-0 flex-1 gap-2">
        <span class="text-[1.02rem] font-semibold text-[#111111]">
          Enable CAN hooks
        </span>
        <p :class="mutedTextClass">
          When disabled, the device stays online and observable but stops
          enabling Full Self Driving in your vehicle.
        </p>
      </div>
      <k-toggle
        id="hooks-toggle"
        class="justify-self-start self-start sm:justify-self-end"
        :checked="portalView.hooksEnabled"
        :disabled="portalView.hooksDisabled"
        @change="
          portalActions.toggleHooks(($event.target as HTMLInputElement).checked)
        "
      />
    </label>

    <label
      v-if="portalView.managementModeOptions.length > 0"
      :class="['mt-5', inputLabelClass]"
      for="mode-select"
    >
      <span>Operation preset</span>
      <select
        id="mode-select"
        v-model="portalView.managementSelectedModeId"
        :class="inputClass"
        :disabled="portalView.deviceConfigDisabled"
        @change="
          portalActions.setOperationMode(
            ($event.target as HTMLSelectElement).value,
          )
        "
      >
        <option
          v-for="mode in portalView.managementModeOptions"
          :key="mode.id"
          :value="mode.id"
        >
          {{ mode.label }}
        </option>
      </select>
    </label>

    <div
      v-if="portalView.managementPayloads.length > 0"
      class="mt-5 grid gap-4"
    >
      <article
        v-for="payload in portalView.managementPayloads"
        :key="payload.id"
        class="grid gap-4 overflow-hidden rounded-[22px] border border-[rgba(60,60,67,0.14)] bg-[rgba(255,255,255,0.94)] px-5 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start"
      >
      <div class="grid min-w-0 flex-1 gap-2">
          <strong class="text-[1.02rem] text-[#111111]">{{
            payload.label
          }}</strong>
          <p :class="mutedTextClass">
            {{ describeManagementItem(payload.label, payload.summary) }}
          </p>
        </div>
        <k-toggle
          class="justify-self-start self-start sm:justify-self-end"
          :checked="payload.enabled"
          :disabled="payload.disabled"
          @change="handlePayloadToggle(payload, $event)"
        />
      </article>
    </div>

    <div
      v-if="portalView.managementChoices.length > 0"
      class="mt-5 grid gap-4"
    >
      <article
        v-for="choice in portalView.managementChoices"
        :key="choice.id"
        class="grid gap-4 rounded-[22px] border border-[rgba(60,60,67,0.14)] bg-[rgba(255,255,255,0.94)] px-5 py-5"
      >
        <div class="grid gap-2">
          <strong class="text-[1.02rem] text-[#111111]">{{
            choice.label
          }}</strong>
          <p :class="mutedTextClass">
            {{ describeManagementItem(choice.label, choice.summary) }}
          </p>
        </div>

        <label v-if="choice.control === 'select'" :class="inputLabelClass">
          <span>Selection</span>
          <select
            v-model="choice.value"
            :class="inputClass"
            :disabled="choice.disabled"
            @change="commitChoice(choice, $event)"
          >
            <option
              v-for="option in choice.options"
              :key="option.id"
              :value="option.id"
            >
              {{ option.label }}
            </option>
          </select>
        </label>

        <label v-else :class="inputLabelClass">
          <span class="flex items-center justify-between gap-3">
            <span>Offset</span>
            <span
              v-if="choice.showValue"
              class="text-[0.92rem] font-semibold text-[#0a60ff]"
            >
              {{ choice.value }}{{ choice.suffix }}
            </span>
          </span>
          <input
            type="range"
            :min="choice.min"
            :max="choice.max"
            :step="choice.step"
            :value="choice.value"
            :disabled="choice.disabled"
            class="accent-[#0a60ff]"
            @input="updateRangePreview(choice, $event)"
            @change="commitChoice(choice, $event)"
          />
        </label>
      </article>
    </div>

    <p
      v-if="
        portalView.managementModeOptions.length === 0 &&
        portalView.managementPayloads.length === 0 &&
        portalView.managementChoices.length === 0
      "
      :class="['mt-5', mutedTextClass]"
    >
      No extra payload toggles or preset overrides are available for this
      device firmware yet.
    </p>

    <div
      v-if="portalView.payloadResetAfterOta"
      class="mt-5 rounded-[22px] border border-[rgba(255,149,0,0.18)] bg-[rgba(255,149,0,0.08)] px-5 py-4"
    >
      <p class="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[#9a3412]">
        After OTA
      </p>
      <p class="mt-2 text-[0.98rem] leading-[1.55] text-[#9a3412]">
        Extra payload toggles reset after firmware updates. Reconnect after the
        install and check the preset again.
      </p>
    </div>

    <p id="config-note" :class="['mt-5', mutedTextClass]">
      {{ portalView.configNote }}
    </p>
  </section>
</template>

<script setup lang="ts">
import { kToggle } from "konsta/vue";

import { portalActions, portalView, type PortalManagementChoiceView, type PortalManagementPayloadView } from "../view-model";
import {
  inputClass,
  inputLabelClass,
  mutedTextClass,
  panelClass,
  panelHeadingClass,
  panelLabelClass,
  sectionTextStackClass,
  sectionTitleClass,
} from "../ui";

function handlePayloadToggle(
  payload: PortalManagementPayloadView,
  event: Event,
) {
  const checked = (event.target as HTMLInputElement).checked;
  payload.enabled = checked;
  portalActions.setManagementPayloadEnabled(payload.id, checked);
}

function updateRangePreview(choice: PortalManagementChoiceView, event: Event) {
  choice.value = (event.target as HTMLInputElement).value;
}

function describeManagementItem(label: string, summary: string) {
  const baseSummary = summary.trim() || "No description available.";
  const combined = `${label} ${summary}`.toLowerCase();

  if (combined.includes("isa")) {
    return `${baseSummary} When enabled, it removes the speed-limit sign from the on-screen driving view.`;
  }

  return baseSummary;
}

function commitChoice(choice: PortalManagementChoiceView, event: Event) {
  const value = (event.target as HTMLInputElement | HTMLSelectElement).value;
  choice.value = value;
  portalActions.setManagementChoiceValue(choice.id, value);
}
</script>
