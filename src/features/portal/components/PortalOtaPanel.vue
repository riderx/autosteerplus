<template>
  <section class="panel panel-ota">
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
      <button
        v-for="pkg in portalView.installPackages"
        :key="pkg.id"
        class="button button-primary install-button"
        type="button"
        :disabled="pkg.disabled"
        @click="portalActions.installPackage(pkg.id)"
      >
        {{ pkg.label }}
      </button>
    </div>
    <p id="package-note" class="muted-copy panel-note">
      {{ portalView.packageNote }}
    </p>
    <div class="ota-actions">
      <button id="ota-abort-button" class="button button-secondary" type="button" :disabled="portalView.abortOtaDisabled" @click="portalActions.abortOta()">
        Abort OTA
      </button>
    </div>
    <div class="progress-block">
      <div class="progress-meta">
        <span id="progress-label">{{ portalView.progressLabel }}</span>
        <span id="progress-percent">{{ portalView.progressPercentText }}</span>
      </div>
      <div class="progress-track">
        <div id="progress-bar" class="progress-bar" :style="{ width: `${portalView.progressPercent}%` }"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { portalActions, portalView } from '../view-model';
</script>
