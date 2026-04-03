<template>
  <section id="passkey-setup-gate" class="password-gate" :hidden="!portalView.passkeySetupVisible">
    <k-card class="panel panel-password-gate">
      <div class="panel-heading">
        <div>
          <p class="panel-label">Admin Security</p>
          <h2>Register your admin passkey</h2>
        </div>
      </div>
      <p id="passkey-setup-note" class="muted-copy panel-note">
        {{ portalView.passkeySetupNote }}
      </p>
      <div class="password-gate-actions">
        <PortalActionButton
          id="admin-register-passkey-button"
          :disabled="portalView.adminRegisterPasskeyDisabled"
          @click="portalActions.registerAdminPasskey()"
        >
          Register Passkey
        </PortalActionButton>
        <PortalActionButton id="admin-passkey-logout-button" variant="secondary" @click="portalActions.logout()">
          Log Out
        </PortalActionButton>
      </div>
    </k-card>
  </section>
</template>

<script setup lang="ts">
import { kCard } from 'konsta/vue';

import PortalActionButton from './PortalActionButton.vue';
import { portalActions, portalView } from '../view-model';
</script>
