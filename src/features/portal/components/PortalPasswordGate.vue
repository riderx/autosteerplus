<template>
  <section id="password-gate" class="password-gate" :hidden="!portalView.passwordGateVisible">
    <div class="panel panel-password-gate">
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
          <button
            id="password-gate-cancel"
            class="button button-secondary"
            type="button"
            :hidden="!portalView.passwordGateRequiresCurrent"
            @click="portalActions.closePasswordDialog()"
          >
            Cancel
          </button>
          <button class="button button-primary" type="submit">Update Password</button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { portalActions, portalView } from '../view-model';
</script>
