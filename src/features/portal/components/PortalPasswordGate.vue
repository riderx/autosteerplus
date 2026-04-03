<template>
  <section id="password-gate" class="password-gate" :hidden="!portalView.passwordGateVisible">
    <k-card class="panel panel-password-gate">
      <div class="panel-heading">
        <div>
          <p class="panel-label">Security</p>
          <h2>Change your password</h2>
        </div>
      </div>
      <p id="password-gate-note" class="muted-copy panel-note">
        {{ portalView.passwordGateNote }}
      </p>
      <p class="muted-copy panel-note">
        Secure here means at least 15 characters. A long passphrase is fine. Do not reuse your email address,
        a 4-digit code, or one repeated character.
      </p>
      <form id="password-gate-form" class="auth-form" method="post" action="./" @submit.prevent="portalActions.changePassword()">
        <label id="password-gate-current-wrap" class="field" :hidden="!portalView.passwordGateRequiresCurrent">
          <span>Current password</span>
          <input
            id="password-gate-current-password"
            v-model="portalView.passwordCurrent"
            type="password"
            autocomplete="current-password"
            :required="portalView.passwordGateRequiresCurrent"
          >
        </label>
        <label class="field">
          <span>New password</span>
          <input
            id="password-gate-new-password"
            v-model="portalView.passwordNew"
            type="password"
            autocomplete="new-password"
            required
          >
        </label>
        <label class="field">
          <span>Confirm new password</span>
          <input
            id="password-gate-confirm-password"
            v-model="portalView.passwordConfirm"
            type="password"
            autocomplete="new-password"
            required
          >
        </label>
        <div class="password-gate-actions">
          <PortalActionButton
            id="password-gate-cancel"
            variant="secondary"
            :hidden="!portalView.passwordGateRequiresCurrent"
            @click="portalActions.closePasswordDialog()"
          >
            Cancel
          </PortalActionButton>
          <PortalActionButton type="submit">Update Password</PortalActionButton>
        </div>
      </form>
    </k-card>
  </section>
</template>

<script setup lang="ts">
import { kCard } from 'konsta/vue';

import PortalActionButton from './PortalActionButton.vue';
import { portalActions, portalView } from '../view-model';
</script>
