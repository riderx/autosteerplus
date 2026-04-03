<template>
  <k-app theme="ios" class="min-h-screen bg-transparent">
    <div
      class="mx-auto w-full max-w-260 px-[calc(0.85rem+env(safe-area-inset-right,0px))] pb-[calc(2rem+env(safe-area-inset-bottom,0px))] pl-[calc(0.85rem+env(safe-area-inset-left,0px))] pt-[calc(1rem+env(safe-area-inset-top,0px))] max-[640px]:w-full max-[640px]:px-[calc(0.5rem+env(safe-area-inset-right,0px))] max-[640px]:pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] max-[640px]:pl-[calc(0.5rem+env(safe-area-inset-left,0px))]"
    >
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
