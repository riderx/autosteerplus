<template>
  <k-card class="panel panel-ota">
    <div class="panel-heading">
      <div>
        <p class="panel-label">OTA</p>
        <h2>Install firmware</h2>
      </div>
    </div>
    <p class="muted-copy panel-note">
      Select the firmware package approved for your device, then transfer it over Web Bluetooth.
    </p>
    <div id="install-options" class="install-options">
      <PortalActionButton
        v-for="pkg in portalView.installPackages"
        :key="pkg.id"
        class="install-button"
        :disabled="pkg.disabled"
        @click="portalActions.installPackage(pkg.id)"
      >
        {{ pkg.label }}
      </PortalActionButton>
    </div>
    <p id="package-note" class="muted-copy panel-note">
      {{ portalView.packageNote }}
    </p>
    <div class="ota-actions">
      <PortalActionButton id="ota-abort-button" variant="secondary" :disabled="portalView.abortOtaDisabled" @click="portalActions.abortOta()">
        Abort OTA
      </PortalActionButton>
    </div>
    <div class="progress-block">
      <div class="progress-meta">
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
