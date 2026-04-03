<template>
  <section class="panel panel-passkeys">
    <div class="panel-heading">
      <div>
        <p class="panel-label">Security</p>
        <h2>Passkeys</h2>
      </div>
      <div class="hero-actions">
        <PortalActionButton
          id="reload-passkeys-button"
          variant="ghost"
          :disabled="portalView.reloadPasskeysDisabled"
          @click="portalActions.reloadPasskeys()"
        >
          Reload Passkeys
        </PortalActionButton>
        <PortalActionButton
          id="register-passkey-button"
          :disabled="portalView.registerPasskeyDisabled"
          @click="portalActions.registerPasskey()"
        >
          Add Passkey
        </PortalActionButton>
      </div>
    </div>
    <p id="passkey-note" class="muted-copy panel-note">
      {{ portalView.passkeyNote }}
    </p>
    <div id="passkey-list" class="user-admin-list">
      <article v-for="passkey in portalView.passkeys" :key="passkey.id" class="user-admin-item">
        <div class="user-admin-copy">
          <strong class="user-admin-title">{{ passkey.title }}</strong>
          <p class="user-admin-meta">{{ passkey.primaryMeta }}</p>
          <p class="user-admin-meta">{{ passkey.secondaryMeta }}</p>
        </div>
        <div class="user-admin-actions">
          <PortalActionButton variant="danger" :disabled="passkey.deleteDisabled" @click="portalActions.removePasskey(passkey.id)">
            {{ passkey.deleteLabel }}
          </PortalActionButton>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import PortalActionButton from './PortalActionButton.vue';
import { portalActions, portalView } from '../view-model';
</script>
