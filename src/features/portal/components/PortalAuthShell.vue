<template>
  <k-page id="auth-shell" class="auth-page" :hidden="portalView.authenticated || portalView.currentPage !== 'dashboard'">
    <div class="auth-shell">
      <k-navbar large transparent title="Autosteerplus" class="portal-navbar" />
      <k-block strong-ios inset-ios class="hero hero-auth portal-hero-card">
        <h1 class="hero-title">Device Portal</h1>
        <p class="hero-copy">
          Sign in to access firmware installs, device controls, and update guidance for your approved hardware.
        </p>
        <p v-if="!isNativeApp" class="muted-copy auth-web-note">
          You are using the web fork of `fsd.teslaandroid.com`. Bluetooth control only works in Web Bluetooth
          compatible browsers. On iPhone or iPad, use the autosteerplus app or
          <a :href="bluefyUrl" target="_blank" rel="noreferrer">Bluefy</a>.
        </p>
        <div class="hero-actions auth-secondary-links">
          <PortalActionButton variant="ghost" @click="portalActions.openOnboarding()">
            Start Onboarding
          </PortalActionButton>
          <PortalActionButton variant="ghost" @click="portalActions.openDocs()">
            View Docs
          </PortalActionButton>
          <PortalActionButton variant="ghost" @click="portalActions.openFaq()">
            FAQ
          </PortalActionButton>
        </div>
      </k-block>

      <k-card id="login-panel" class="panel panel-auth">
        <div class="panel-heading">
          <div>
            <p class="panel-label">Portal Access</p>
            <h2>Sign in</h2>
          </div>
        </div>
        <p id="auth-note" class="muted-copy">
          {{ portalView.authNote }}
        </p>
        <p id="login-feedback" class="auth-warning" :hidden="portalView.loginFeedback === ''">
          {{ portalView.loginFeedback }}
        </p>
        <form id="login-form" class="auth-form" method="post" action="./" @submit.prevent="portalActions.login()">
          <label class="field">
            <span>Email</span>
            <input
              id="login-email"
              v-model="portalView.loginEmail"
              name="email"
              type="email"
              autocomplete="username"
              required
            >
          </label>
          <label class="field">
            <span>Password</span>
            <input
              id="login-password"
              v-model="portalView.loginPassword"
              name="password"
              type="password"
              autocomplete="current-password"
              required
            >
          </label>
          <div id="login-challenge-shell" class="challenge-shell" :hidden="!portalView.loginChallengeVisible">
            <div id="login-challenge-widget"></div>
          </div>
          <p id="login-challenge-note" class="muted-copy panel-note" :hidden="!portalView.loginChallengeVisible">
          {{ portalView.loginChallengeNote }}
        </p>
        <PortalActionButton id="login-submit" type="submit">
          Sign In
        </PortalActionButton>
        <PortalActionButton id="login-passkey-button" variant="secondary" @click="portalActions.signInWithPasskey()">
          Use Passkey
        </PortalActionButton>
      </form>
    </k-card>
  </div>
  </k-page>
</template>

<script setup lang="ts">
import { Capacitor } from '@capacitor/core';
import { kBlock, kCard, kNavbar, kPage } from 'konsta/vue';

import PortalActionButton from './PortalActionButton.vue';
import { portalActions, portalView } from '../view-model';

const isNativeApp = Capacitor.isNativePlatform();
const bluefyUrl = 'https://apps.apple.com/app/id1492822055';
</script>
