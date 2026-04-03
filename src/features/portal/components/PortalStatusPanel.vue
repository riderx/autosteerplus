<template>
  <section class="panel panel-status">
    <div class="panel-heading">
      <div>
        <p class="panel-label">Device Snapshot</p>
        <h2>Runtime status</h2>
      </div>
      <button id="reboot-button" class="button button-ghost" type="button" :disabled="portalView.rebootDisabled" @click="portalActions.rebootDevice()">
        Reboot Device
      </button>
    </div>
    <div class="status-grid">
      <article class="metric-card">
        <span class="metric-label">Device</span>
        <strong id="device-name">{{ portalView.deviceName }}</strong>
      </article>
      <article class="metric-card">
        <span class="metric-label">Firmware</span>
        <strong id="firmware-version">{{ portalView.firmwareVersion }}</strong>
      </article>
      <article class="metric-card">
        <span class="metric-label">CAN</span>
        <strong id="can-state">{{ portalView.canState }}</strong>
      </article>
      <article class="metric-card">
        <span class="metric-label">Hooks</span>
        <strong id="hooks-state">{{ portalView.hooksState }}</strong>
      </article>
      <article class="metric-card">
        <span class="metric-label">Profile</span>
        <strong id="profile-state">{{ portalView.profileState }}</strong>
      </article>
      <article class="metric-card">
        <span class="metric-label">Speed Offset</span>
        <strong id="speed-offset-state">{{ portalView.speedOffsetState }}</strong>
      </article>
      <article class="metric-card">
        <span class="metric-label">FSD Flag</span>
        <strong id="fsd-flag-state">{{ portalView.fsdFlagState }}</strong>
      </article>
      <article class="metric-card">
        <span class="metric-label">OTA</span>
        <strong id="ota-state">{{ portalView.otaState }}</strong>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { portalActions, portalView } from '../view-model';
</script>
