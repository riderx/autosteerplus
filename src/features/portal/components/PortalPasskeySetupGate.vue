<template>
  <section
    id="passkey-setup-gate"
    class="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(17,17,17,0.28)] p-4 backdrop-blur-sm"
    :hidden="!portalView.passkeySetupVisible"
  >
    <k-card :class="['w-full max-w-2xl', panelClass]">
      <div :class="panelHeadingClass">
        <div :class="sectionTextStackClass">
          <p :class="panelLabelClass">Admin Security</p>
          <h2 :class="sectionTitleClass">Register your admin passkey</h2>
        </div>
      </div>
      <p id="passkey-setup-note" :class="['mt-4', mutedTextClass]">
        {{ portalView.passkeySetupNote }}
      </p>
      <div class="mt-5 flex flex-wrap justify-end gap-3">
        <PortalActionButton
          id="admin-register-passkey-button"
          :disabled="portalView.adminRegisterPasskeyDisabled"
          @click="portalActions.registerAdminPasskey()"
        >
          Register Passkey
        </PortalActionButton>
        <PortalActionButton
          id="admin-passkey-logout-button"
          variant="secondary"
          @click="portalActions.logout()"
        >
          Log Out
        </PortalActionButton>
      </div>
    </k-card>
  </section>
</template>

<script setup lang="ts">
import { kCard } from "konsta/vue";

import PortalActionButton from "./PortalActionButton.vue";
import { portalActions, portalView } from "../view-model";
import {
  mutedTextClass,
  panelClass,
  panelHeadingClass,
  panelLabelClass,
  sectionTextStackClass,
  sectionTitleClass,
} from "../ui";
</script>
