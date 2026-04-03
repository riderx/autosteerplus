<template>
  <section class="panel panel-passkeys">
    <div class="panel-heading">
      <div>
        <p class="panel-label">Security</p>
        <h2>Passkeys</h2>
      </div>
      <div class="hero-actions">
        <button
          id="reload-passkeys-button"
          class="button button-ghost"
          type="button"
          :disabled="portalView.reloadPasskeysDisabled"
          @click="portalActions.reloadPasskeys()"
        >
          Reload Passkeys
        </button>
        <button
          id="register-passkey-button"
          class="button button-primary"
          type="button"
          :disabled="portalView.registerPasskeyDisabled"
          @click="portalActions.registerPasskey()"
        >
          Add Passkey
        </button>
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
          <button class="button button-danger" type="button" :disabled="passkey.deleteDisabled" @click="portalActions.removePasskey(passkey.id)">
            {{ passkey.deleteLabel }}
          </button>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { portalActions, portalView } from '../view-model';
</script>
