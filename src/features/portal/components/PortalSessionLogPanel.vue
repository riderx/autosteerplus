<template>
  <section :class="['col-span-12', panelClass]">
    <div :class="panelHeadingClass">
      <div :class="sectionTextStackClass">
        <p :class="panelLabelClass">Events</p>
        <h2 :class="sectionTitleClass">Session log</h2>
      </div>
      <PortalActionButton
        id="clear-log-button"
        variant="ghost"
        @click="portalActions.clearLog()"
      >
        Clear log
      </PortalActionButton>
    </div>
    <pre
      id="event-log"
      class="mt-5 max-h-[32rem] overflow-auto rounded-[22px] border border-[rgba(60,60,67,0.14)] bg-[#111827] px-4 py-4 text-[0.84rem] leading-[1.55] text-[#dbe4ff]"
      aria-live="polite"
      >{{ portalView.eventLogText }}</pre
    >
  </section>
</template>

<script setup lang="ts">
import PortalActionButton from "./PortalActionButton.vue";
import { portalActions, portalView } from "../view-model";
import {
  panelClass,
  panelHeadingClass,
  panelLabelClass,
  sectionTextStackClass,
  sectionTitleClass,
} from "../ui";
</script>
