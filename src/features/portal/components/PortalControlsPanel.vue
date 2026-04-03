<template>
  <section class="panel panel-controls">
    <div class="panel-heading">
      <div>
        <p class="panel-label">Control</p>
        <h2>CAN hook gate</h2>
      </div>
    </div>
    <label class="toggle-card" for="hooks-toggle">
      <div>
        <span class="toggle-title">Enable CAN hooks</span>
        <p class="toggle-copy">
          When disabled, the device stays online and observable but stops enabling Full Self Driving in your
          vehicle.
        </p>
      </div>
      <span class="toggle-shell">
        <input
          id="hooks-toggle"
          v-model="portalView.hooksEnabled"
          type="checkbox"
          :disabled="portalView.hooksDisabled"
          @change="portalActions.toggleHooks(portalView.hooksEnabled)"
        >
        <span class="toggle-slider" aria-hidden="true"></span>
      </span>
    </label>
    <p id="config-note" class="muted-copy">
      {{ portalView.configNote }}
    </p>
  </section>
</template>

<script setup lang="ts">
import { portalActions, portalView } from '../view-model';
</script>
