<template>
  <k-app theme="ios" class="portal-konsta-app">
    <div class="page-shell">
      <PortalAuthShell />
      <PortalDashboardPage />
      <PortalDocsPage />
      <PortalOnboardingPage />
      <PortalFaqPage />
    </div>
  </k-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { kApp } from 'konsta/vue';

import PortalAuthShell from './features/portal/components/PortalAuthShell.vue';
import PortalDashboardPage from './features/portal/components/PortalDashboardPage.vue';
import PortalDocsPage from './features/portal/components/PortalDocsPage.vue';
import PortalFaqPage from './features/portal/components/PortalFaqPage.vue';
import PortalOnboardingPage from './features/portal/components/PortalOnboardingPage.vue';

onMounted(async () => {
  const { initPortalController } = await import('./features/portal/controller');
  initPortalController();
});
</script>
