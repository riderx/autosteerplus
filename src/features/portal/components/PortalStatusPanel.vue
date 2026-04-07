<template>
  <section :class="['col-span-12', panelClass]">
    <div :class="panelHeadingClass">
      <div :class="sectionTextStackClass">
        <p :class="panelLabelClass">Device Snapshot</p>
        <h2 :class="sectionTitleClass">Runtime status</h2>
      </div>
      <PortalActionButton
        id="reboot-button"
        variant="ghost"
        :disabled="portalView.rebootDisabled"
        @click="portalActions.rebootDevice()"
      >
        Reboot Device
      </PortalActionButton>
    </div>

    <div class="mt-5 grid gap-4 xl:grid-cols-5 sm:grid-cols-2">
      <article :class="nestedCardClass">
        <span :class="panelLabelClass">Device</span>
        <strong id="device-name" class="text-[1.05rem] text-[#111111]">{{
          portalView.deviceName
        }}</strong>
      </article>
      <article :class="nestedCardClass">
        <span :class="panelLabelClass">Firmware</span>
        <strong id="firmware-version" class="text-[1.05rem] text-[#111111]">{{
          portalView.firmwareVersion
        }}</strong>
      </article>
      <article :class="nestedCardClass">
        <span :class="panelLabelClass">Hooks</span>
        <strong id="hooks-state" class="text-[1.05rem] text-[#111111]">{{
          portalView.hooksState
        }}</strong>
      </article>
      <article :class="nestedCardClass">
        <span :class="panelLabelClass">Mode</span>
        <strong id="mode-state" class="text-[1.05rem] text-[#111111]">{{
          portalView.managementModeState
        }}</strong>
      </article>
      <article :class="nestedCardClass">
        <span :class="panelLabelClass">OTA</span>
        <strong id="ota-state" class="text-[1.05rem] text-[#111111]">{{
          portalView.otaState
        }}</strong>
      </article>
    </div>

    <div
      v-if="portalView.advancedMode"
      class="mt-5 grid gap-4 lg:grid-cols-4 sm:grid-cols-2"
    >
      <article :class="nestedCardClass">
        <span :class="panelLabelClass">CAN</span>
        <strong id="can-state" class="text-[1.02rem] text-[#111111]">{{
          portalView.canState
        }}</strong>
      </article>
      <article :class="nestedCardClass">
        <span :class="panelLabelClass">Profile</span>
        <strong id="profile-state" class="text-[1.02rem] text-[#111111]">{{
          portalView.profileState
        }}</strong>
      </article>
      <article :class="nestedCardClass">
        <span :class="panelLabelClass">Speed Offset</span>
        <strong id="speed-offset-state" class="text-[1.02rem] text-[#111111]">{{
          portalView.speedOffsetState
        }}</strong>
      </article>
      <article :class="nestedCardClass">
        <span :class="panelLabelClass">FSD Flag</span>
        <strong id="fsd-flag-state" class="text-[1.02rem] text-[#111111]">{{
          portalView.fsdFlagState
        }}</strong>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import PortalActionButton from "./PortalActionButton.vue";
import { portalActions, portalView } from "../view-model";
import {
  nestedCardClass,
  panelClass,
  panelHeadingClass,
  panelLabelClass,
  sectionTextStackClass,
  sectionTitleClass,
} from "../ui";
</script>
