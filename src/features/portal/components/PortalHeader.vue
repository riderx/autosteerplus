<template>
  <k-block strong-ios inset-ios class="hero portal-dashboard-hero">
    <p class="eyebrow">Tesla FSD</p>
    <h1 class="hero-title">Autosteerplus</h1>
    <p class="hero-copy">
      OTA updates and device diagnostics.
    </p>
    <div class="hero-actions">
      <PortalActionButton
        v-if="portalView.connectionOnline"
        id="disconnect-button"
        variant="secondary"
        :disabled="portalView.disconnectDisabled"
        @click="portalActions.disconnect()"
      >
        Disconnect
      </PortalActionButton>
      <PortalActionButton
        v-if="portalView.connectionOnline"
        id="refresh-button"
        variant="ghost"
        :disabled="portalView.refreshDisabled"
        @click="portalActions.refreshStatus()"
      >
        Refresh Status
      </PortalActionButton>
      <PortalActionButton variant="ghost" @click="portalActions.openOnboarding()">
        Onboarding
      </PortalActionButton>
      <PortalActionButton variant="ghost" @click="portalActions.openDocs()">
        Docs
      </PortalActionButton>
      <PortalActionButton v-if="portalView.connectionOnline" variant="ghost" @click="portalActions.toggleAdvancedMode()">
        {{ portalView.advancedMode ? 'Basic Mode' : 'Advanced Mode' }}
      </PortalActionButton>
      <PortalActionButton
        id="change-password-button"
        variant="ghost"
        :hidden="!portalView.showChangePasswordButton"
        @click="portalActions.openPasswordDialog()"
      >
        Change Password
      </PortalActionButton>
      <PortalActionButton
        id="logout-button"
        variant="secondary"
        :hidden="!portalView.showLogoutButton"
        @click="portalActions.logout()"
      >
        Log Out
      </PortalActionButton>
    </div>
    <div class="hero-meta">
      <k-chip
        id="connection-pill"
        class="portal-connection-chip"
        :class="[portalView.connectionOnline ? 'portal-connection-chip-online' : 'portal-connection-chip-offline']"
      >
        {{ portalView.connectionLabel }}
      </k-chip>
    </div>
  </k-block>
</template>

<script setup lang="ts">
import { kBlock, kChip } from 'konsta/vue';

import PortalActionButton from './PortalActionButton.vue';
import { portalActions, portalView } from '../view-model';
</script>
