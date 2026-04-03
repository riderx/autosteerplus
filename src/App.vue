<template>
  <div class="page-shell">
    <PortalAuthShell />

    <div id="app-shell" :hidden="!portalView.authenticated">
      <PortalPasswordGate />
      <PortalPasskeySetupGate />
      <PortalHeader />

      <main id="dashboard" class="dashboard">
        <PortalStatusPanel />
        <PortalControlsPanel />
        <PortalOtaPanel />
        <PortalSubscriptionPanel />
        <PortalAdminPanel />
        <PortalPasskeysPanel />
        <PortalVerificationPanel />
        <PortalSessionLogPanel />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

import PortalAdminPanel from './features/portal/components/PortalAdminPanel.vue';
import PortalAuthShell from './features/portal/components/PortalAuthShell.vue';
import PortalControlsPanel from './features/portal/components/PortalControlsPanel.vue';
import PortalHeader from './features/portal/components/PortalHeader.vue';
import PortalOtaPanel from './features/portal/components/PortalOtaPanel.vue';
import PortalPasskeysPanel from './features/portal/components/PortalPasskeysPanel.vue';
import PortalPasskeySetupGate from './features/portal/components/PortalPasskeySetupGate.vue';
import PortalPasswordGate from './features/portal/components/PortalPasswordGate.vue';
import PortalSessionLogPanel from './features/portal/components/PortalSessionLogPanel.vue';
import PortalStatusPanel from './features/portal/components/PortalStatusPanel.vue';
import PortalSubscriptionPanel from './features/portal/components/PortalSubscriptionPanel.vue';
import PortalVerificationPanel from './features/portal/components/PortalVerificationPanel.vue';
import { portalView } from './features/portal/view-model';

onMounted(async () => {
  const { initPortalController } = await import('./features/portal/controller');
  initPortalController();
});
</script>
