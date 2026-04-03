<template>
  <div id="app-shell" :hidden="!portalView.authenticated || portalView.currentPage !== 'dashboard'">
    <PortalPasswordGate />
    <PortalPasskeySetupGate />
    <PortalHeader />

    <main id="dashboard" class="dashboard">
      <PortalStatusPanel />
      <PortalControlsPanel />
      <PortalOtaPanel />
      <section v-if="!portalView.advancedMode" class="panel panel-advanced-hint">
        <div class="panel-heading">
          <div>
            <p class="panel-label">Mode</p>
            <h2>Basic mode is active</h2>
          </div>
        </div>
        <p class="muted-copy panel-note">
          Switch to advanced mode if you need passkeys, admin controls, or the live session log.
        </p>
      </section>
      <PortalAdminPanel v-if="portalView.advancedMode" />
      <PortalPasskeysPanel v-if="portalView.advancedMode" />
      <PortalSessionLogPanel v-if="portalView.advancedMode" />
    </main>
  </div>
</template>

<script setup lang="ts">
import PortalAdminPanel from './PortalAdminPanel.vue';
import PortalControlsPanel from './PortalControlsPanel.vue';
import PortalHeader from './PortalHeader.vue';
import PortalOtaPanel from './PortalOtaPanel.vue';
import PortalPasskeysPanel from './PortalPasskeysPanel.vue';
import PortalPasskeySetupGate from './PortalPasskeySetupGate.vue';
import PortalPasswordGate from './PortalPasswordGate.vue';
import PortalSessionLogPanel from './PortalSessionLogPanel.vue';
import PortalStatusPanel from './PortalStatusPanel.vue';
import { portalView } from '../view-model';
</script>
