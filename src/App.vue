<template>
  <k-app
    theme="ios"
    safe-areas
    class="min-h-screen overscroll-y-none bg-[#f2f2f7] text-[#111111]"
  >
    <div
      class="mx-auto w-full max-w-260 px-safe-4 pb-safe-6 pt-safe-4 sm:px-safe-5 sm:pb-safe-8 sm:pt-safe-5"
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
import { onMounted } from "vue";
import { kApp } from "konsta/vue";

import PortalAuthShell from "./features/portal/components/PortalAuthShell.vue";
import PortalDashboardPage from "./features/portal/components/PortalDashboardPage.vue";
import PortalDocsPage from "./features/portal/components/PortalDocsPage.vue";
import PortalFaqPage from "./features/portal/components/PortalFaqPage.vue";
import PortalOnboardingPage from "./features/portal/components/PortalOnboardingPage.vue";

onMounted(async () => {
  const { initPortalController } = await import("./features/portal/controller");
  initPortalController();
});
</script>
