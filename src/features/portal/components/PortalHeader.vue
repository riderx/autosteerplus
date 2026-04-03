<template>
  <header class="hero">
    <p class="eyebrow">Tesla FSD</p>
    <h1 class="hero-title">Tesla FSD Device Manager</h1>
    <p class="hero-copy">
      OTA updates and device diagnostics.
    </p>
    <div class="hero-actions">
      <button id="connect-button" class="button button-primary" type="button" :disabled="portalView.connectDisabled" @click="portalActions.connect()">
        Connect Device
      </button>
      <button id="disconnect-button" class="button button-secondary" type="button" :disabled="portalView.disconnectDisabled" @click="portalActions.disconnect()">
        Disconnect
      </button>
      <button id="refresh-button" class="button button-ghost" type="button" :disabled="portalView.refreshDisabled" @click="portalActions.refreshStatus()">
        Refresh Status
      </button>
      <button
        id="change-password-button"
        class="button button-ghost"
        type="button"
        :hidden="!portalView.showChangePasswordButton"
        @click="portalActions.openPasswordDialog()"
      >
        Change Password
      </button>
      <button
        id="logout-button"
        class="button button-secondary"
        type="button"
        :hidden="!portalView.showLogoutButton"
        @click="portalActions.logout()"
      >
        Log Out
      </button>
    </div>
    <div class="hero-meta">
      <span id="connection-pill" :class="['pill', portalView.connectionOnline ? 'pill-online' : 'pill-offline']">
        {{ portalView.connectionLabel }}
      </span>
    </div>
  </header>
</template>

<script setup lang="ts">
import { portalActions, portalView } from '../view-model';
</script>
