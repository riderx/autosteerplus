<template>
  <k-card class="panel panel-controls">
    <div class="panel-heading">
      <div>
        <p class="panel-label">Control</p>
        <h2>CAN hook gate</h2>
      </div>
    </div>
    <k-list strong-ios inset-ios class="portal-inline-list">
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
    <p id="config-note" class="muted-copy">
      {{ portalView.configNote }}
    </p>
  </k-card>
</template>

<script setup lang="ts">
import { kCard, kList, kListItem, kToggle } from 'konsta/vue';

import { portalActions, portalView } from '../view-model';
</script>
