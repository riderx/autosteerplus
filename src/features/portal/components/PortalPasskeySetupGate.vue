<template>
  <section id="passkey-setup-gate" class="password-gate" :hidden="!portalView.passkeySetupVisible">
    <div class="panel panel-password-gate">
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
        <button
          id="admin-register-passkey-button"
          class="button button-primary"
          type="button"
          :disabled="portalView.adminRegisterPasskeyDisabled"
          @click="portalActions.registerAdminPasskey()"
        >
          Register Passkey
        </button>
        <button id="admin-passkey-logout-button" class="button button-secondary" type="button" @click="portalActions.logout()">
          Log Out
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { portalActions, portalView } from '../view-model';
</script>
