<template>
  <div>
    <div class="docs-range-schema">
      <div class="docs-range-jump">
        <div class="docs-range-heading">
          <span class="metric-label">Expected result</span>
          <strong>Target about 200 m diameter</strong>
        </div>
        <p class="muted-copy">Before install, the circle can be tiny in some regions, around 5 m to 40 m diameter. After install, the target is the much larger circle.</p>
      </div>
      <div class="docs-range-compare">
        <article class="docs-range-card docs-range-card-before">
          <div class="docs-range-heading">
            <span class="metric-label">Before install</span>
            <strong>Small Summon circle</strong>
          </div>
          <figure class="docs-range-media">
            <img
              class="docs-range-image"
              :src="tinyRadiusImage"
              alt="Summon map showing a smaller blue range circle before install, which may be around 5 to 40 meter diameter depending on region"
            >
          </figure>
          <div class="docs-range-metrics">
            <span class="docs-range-pill">Before can be about 5 m to 40 m diameter</span>
          </div>
          <p class="muted-copy">In Europe and other restricted regions, this smaller circle can vary. If it still stays in this small range after install, the hardware change did not take effect.</p>
        </article>
        <article class="docs-range-card docs-range-card-after">
          <div class="docs-range-heading">
            <span class="metric-label">After install</span>
            <strong>Large Summon circle</strong>
          </div>
          <figure class="docs-range-media">
            <img
              class="docs-range-image"
              :src="bigRadiusImage"
              alt="Summon map showing about 200 meter blue range diameter after install"
            >
          </figure>
          <div class="docs-range-metrics">
            <span class="docs-range-pill docs-range-pill-success">About 200 m diameter</span>
          </div>
          <p class="muted-copy">This much larger circle is the success signal. If it expands to this size, the install worked.</p>
        </article>
      </div>
    </div>
    <p class="docs-range-caption">What matters is the visual jump. Small circle means no effect. Large circle means the install took.</p>
    <ol v-if="showChecklist" class="docs-checklist">
      <li v-for="item in verificationChecklist" :key="item.title">
        <strong>{{ item.title }}</strong>
        <p class="muted-copy">{{ item.body }}</p>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
import bigRadiusImage from '../../../../big_raduis.png';
import tinyRadiusImage from '../../../../tiny_radius.png';

withDefaults(defineProps<{
  showChecklist?: boolean;
}>(), {
  showChecklist: true,
});

const verificationChecklist = [
  {
    title: 'Open the Tesla app and enter Summon',
    body: 'Do not overcomplicate the first check. Go straight to Summon after the install.',
  },
  {
    title: 'Compare the blue-circle size',
    body: 'Before install it may be anywhere from about 5 m to 40 m diameter depending on region. After install it should expand to roughly 200 m diameter.',
  },
  {
    title: 'Treat the larger circle as the pass condition',
    body: 'If the circle expands, the install worked. If it does not, stop there and troubleshoot before changing anything else.',
  },
];
</script>
