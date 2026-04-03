<template>
  <main id="auth-shell" class="auth-shell" :hidden="portalView.authenticated || portalView.currentPage !== 'dashboard'">
    <section class="hero hero-auth">
      <p class="eyebrow">Tesla FSD</p>
      <h1 class="hero-title">autosteerplus</h1>
      <p class="hero-copy">
        Sign in to access firmware installs, device controls, and update guidance for your approved hardware.
      </p>
    </section>

    <section id="login-panel" class="panel panel-auth">
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
        <button id="login-submit" class="button button-primary" type="submit">Sign In</button>
        <button id="login-passkey-button" class="button button-secondary" type="button" @click="portalActions.signInWithPasskey()">
          Use Passkey
        </button>
        <button class="button button-ghost" type="button" @click="portalActions.openOnboarding()">
          Start Onboarding
        </button>
        <button class="button button-ghost" type="button" @click="portalActions.openDocs()">
          View Docs
        </button>
        <button class="button button-ghost" type="button" @click="portalActions.openFaq()">
          FAQ
        </button>
      </form>
    </section>
  </main>
</template>

<script setup lang="ts">
import { portalActions, portalView } from '../view-model';
</script>
