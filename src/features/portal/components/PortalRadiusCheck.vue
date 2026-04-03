<template>
  <div class="grid gap-5">
    <div class="grid gap-5">
      <div
        class="grid gap-3 rounded-[22px] border border-[rgba(10,96,255,0.16)] bg-[rgba(10,96,255,0.05)] px-5 py-5"
      >
        <div class="grid gap-1">
          <span :class="panelLabelClass">Expected result</span>
          <strong>Target about 200 m diameter</strong>
        </div>
        <p :class="mutedTextClass">
          Before install, the circle can be tiny in some regions, around 5 m to
          40 m diameter. After install, the target is the much larger circle.
        </p>
      </div>
      <div class="grid gap-4 lg:grid-cols-2">
        <article :class="nestedCardClass">
          <div class="grid gap-1">
            <span :class="panelLabelClass">Before install</span>
            <strong>Small Summon circle</strong>
          </div>
          <PortalZoomableImage
            class="mx-auto w-full max-w-lg"
            :src="tinyRadiusImage"
            alt="Summon map showing a smaller blue range circle before install, which may be around 5 to 40 meter diameter depending on region"
            preview-aspect-class="aspect-[3/4]"
            preview-image-class="object-cover"
            preview-object-position="center 78%"
          />
          <div class="flex flex-wrap gap-3">
            <span
              class="inline-flex rounded-full border border-[rgba(60,60,67,0.14)] bg-[rgba(255,255,255,0.92)] px-4 py-2 text-[0.88rem] leading-[1.35] text-[#1f2937]"
            >
              Before can be about 5 m to 40 m diameter
            </span>
          </div>
          <p :class="mutedTextClass">
            In Europe and other restricted regions, this smaller circle can
            vary. If it still stays in this small range after install, the
            hardware change did not take effect.
          </p>
        </article>
        <article :class="nestedCardClass">
          <div class="grid gap-1">
            <span :class="panelLabelClass">After install</span>
            <strong>Large Summon circle</strong>
          </div>
          <PortalZoomableImage
            class="mx-auto w-full max-w-lg"
            :src="bigRadiusImage"
            alt="Summon map showing about 200 meter blue range diameter after install"
            preview-aspect-class="aspect-[3/4]"
            preview-image-class="object-cover"
            preview-object-position="center 80%"
          />
          <div class="flex flex-wrap gap-3">
            <span
              class="inline-flex rounded-full border border-[rgba(20,140,70,0.16)] bg-[rgba(20,140,70,0.08)] px-4 py-2 text-[0.88rem] leading-[1.35] text-[#136c37]"
            >
              About 200 m diameter
            </span>
          </div>
          <p :class="mutedTextClass">
            This much larger circle is the success signal. If it expands to this
            size, the install worked.
          </p>
        </article>
      </div>
    </div>
    <p
      class="m-0 text-[0.95rem] font-medium leading-[1.5] text-[rgba(60,60,67,0.82)]"
    >
      What matters is the visual jump. Small circle means no effect. Large
      circle means the install took.
    </p>
    <ol v-if="showChecklist" :class="orderedListClass">
      <li v-for="item in verificationChecklist" :key="item.title">
        <strong>{{ item.title }}</strong>
        <p :class="mutedTextClass">{{ item.body }}</p>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
import bigRadiusImage from "../../../../summon_after.PNG";
import tinyRadiusImage from "../../../../summon_before.PNG";
import PortalZoomableImage from "./PortalZoomableImage.vue";
import {
  mutedTextClass,
  nestedCardClass,
  orderedListClass,
  panelLabelClass,
} from "../ui";

withDefaults(
  defineProps<{
    showChecklist?: boolean;
  }>(),
  {
    showChecklist: true,
  },
);

const verificationChecklist = [
  {
    title: "Open the Tesla app and enter Summon",
    body: "Do not overcomplicate the first check. Go straight to Summon after the install.",
  },
  {
    title: "Compare the blue-circle size",
    body: "Before install it may be anywhere from about 5 m to 40 m diameter depending on region. After install it should expand to roughly 200 m diameter.",
  },
  {
    title: "Treat the larger circle as the pass condition",
    body: "If the circle expands, the install worked. If it does not, stop there and troubleshoot before changing anything else.",
  },
];
</script>
