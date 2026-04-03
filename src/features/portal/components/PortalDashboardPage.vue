<template>
  <k-page id="app-shell" class="portal-page" :hidden="!portalView.authenticated || portalView.currentPage !== 'dashboard'">
    <PortalPasswordGate />
    <PortalPasskeySetupGate />
    <div class="portal-content-shell">
      <PortalHeader />

      <main id="dashboard" class="dashboard">
        <k-card v-if="!portalView.connectionOnline" class="panel panel-connect-first">
          <div class="panel-heading">
            <div>
              <p class="panel-label">Next step</p>
              <h2>Connect your device first</h2>
            </div>
          </div>
          <p class="muted-copy panel-note">
            Runtime status, CAN controls, OTA installs, and the advanced tools only make sense once the device is
            connected over Bluetooth.
          </p>
          <div class="hero-actions">
            <PortalActionButton id="connect-first-button" :disabled="portalView.connectDisabled" @click="portalActions.connect()">
              Connect Device
            </PortalActionButton>
            <PortalActionButton variant="ghost" @click="portalActions.openDocs()">
              View Docs
            </PortalActionButton>
          </div>
        </k-card>

        <template v-else>
          <PortalStatusPanel />
          <PortalControlsPanel />
          <PortalOtaPanel />
        </template>
        <k-card v-if="portalView.connectionOnline && !portalView.advancedMode" class="panel panel-advanced-hint">
        <div class="panel-heading">
          <div>
            <p class="panel-label">Mode</p>
            <h2>Basic mode is active</h2>
          </div>
        </div>
        <p class="muted-copy panel-note">
          Switch to advanced mode if you need passkeys, admin controls, or the live session log.
        </p>
        </k-card>
        <PortalAdminPanel v-if="portalView.connectionOnline && portalView.advancedMode" />
        <PortalPasskeysPanel v-if="portalView.connectionOnline && portalView.advancedMode" />
        <PortalSessionLogPanel v-if="portalView.connectionOnline && portalView.advancedMode" />
      </main>
    </div>
  </k-page>
</template>

<script setup lang="ts">
import { kCard, kPage } from 'konsta/vue';

import PortalActionButton from './PortalActionButton.vue';
import PortalAdminPanel from './PortalAdminPanel.vue';
import PortalControlsPanel from './PortalControlsPanel.vue';
import PortalHeader from './PortalHeader.vue';
import PortalOtaPanel from './PortalOtaPanel.vue';
import PortalPasskeysPanel from './PortalPasskeysPanel.vue';
import PortalPasskeySetupGate from './PortalPasskeySetupGate.vue';
import PortalPasswordGate from './PortalPasswordGate.vue';
import PortalSessionLogPanel from './PortalSessionLogPanel.vue';
import PortalStatusPanel from './PortalStatusPanel.vue';
import { portalActions, portalView } from '../view-model';
</script>
