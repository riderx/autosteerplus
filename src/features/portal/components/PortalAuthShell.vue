<template>
  <k-page id="auth-shell" class="block bg-transparent" :hidden="portalView.authenticated || portalView.currentPage !== 'dashboard'">
    <div class="mx-auto grid min-h-full w-full max-w-180 content-center gap-4 px-0 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] pt-[calc(1rem+env(safe-area-inset-top,0px))] max-[640px]:w-[calc(100%-1rem)]">
      <k-block
        strong-ios
        inset-ios
        class="relative mb-4 overflow-hidden rounded-[22px] border border-[rgba(60,60,67,0.14)] bg-[rgba(255,255,255,0.98)] px-[1.4rem] pb-[1.45rem] pt-[1.35rem] shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_28px_rgba(15,23,42,0.05)]"
      >
        <h1 class="m-0 whitespace-nowrap text-[clamp(2.1rem,5vw,3.25rem)] leading-[0.96] tracking-[-0.03em] text-[#111111]">Device Portal</h1>
        <p class="mt-3 max-w-[42rem] text-[1rem] leading-[1.55] text-[rgba(60,60,67,0.82)]">
          Sign in to access firmware installs, device controls, and update guidance for your approved hardware.
        </p>
      </k-block>

      <k-card
        id="login-panel"
        class="relative overflow-hidden rounded-[22px] border border-[rgba(60,60,67,0.14)] bg-[rgba(255,255,255,0.98)] p-[1.15rem] shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_28px_rgba(15,23,42,0.05)]"
      >
        <div class="mb-4 flex items-center justify-end">
          <button
            type="button"
            class="text-[0.95rem] font-semibold text-[#0a60ff]"
            @click="showLoginHelp = !showLoginHelp"
          >
            {{ showLoginHelp ? 'Hide sign-in help' : 'Need sign-in help?' }}
          </button>
        </div>
        <div
          v-if="showLoginHelp"
          class="mb-4 rounded-[18px] border border-[rgba(10,96,255,0.12)] bg-[rgba(10,96,255,0.04)] px-4 py-3"
        >
          <p id="auth-note" class="m-0 text-[0.98rem] leading-[1.55] text-[rgba(60,60,67,0.82)]">
            {{ portalView.authNote }}
          </p>
        </div>
        <p id="login-feedback" class="auth-warning" :hidden="portalView.loginFeedback === ''">
          {{ portalView.loginFeedback }}
        </p>
        <form id="login-form" class="mt-4 grid gap-4" method="post" action="./" @submit.prevent="portalActions.login()">
          <label class="grid gap-2 text-[0.95rem] font-medium text-[#111111]">
            <span>Email</span>
            <input
              id="login-email"
              v-model="portalView.loginEmail"
              name="email"
              type="email"
              autocomplete="username"
              class="min-h-12 rounded-[18px] border border-[rgba(60,60,67,0.14)] bg-white px-4 text-[1rem] text-[#111111] outline-none transition focus:border-[rgba(10,96,255,0.35)] focus:ring-2 focus:ring-[rgba(10,96,255,0.14)]"
              required
            >
          </label>
          <label class="grid gap-2 text-[0.95rem] font-medium text-[#111111]">
            <span>Password</span>
            <input
              id="login-password"
              v-model="portalView.loginPassword"
              name="password"
              type="password"
              autocomplete="current-password"
              class="min-h-12 rounded-[18px] border border-[rgba(60,60,67,0.14)] bg-white px-4 text-[1rem] text-[#111111] outline-none transition focus:border-[rgba(10,96,255,0.35)] focus:ring-2 focus:ring-[rgba(10,96,255,0.14)]"
              required
            >
          </label>
          <div id="login-challenge-shell" class="min-h-[4.25rem]" :hidden="!portalView.loginChallengeVisible">
            <div id="login-challenge-widget"></div>
          </div>
          <p id="login-challenge-note" class="text-[0.98rem] leading-[1.55] text-[rgba(60,60,67,0.82)]" :hidden="!portalView.loginChallengeVisible">
            {{ portalView.loginChallengeNote }}
          </p>
          <PortalActionButton id="login-submit" type="submit">
            Sign In
          </PortalActionButton>
          <PortalActionButton id="login-passkey-button" variant="secondary" @click="portalActions.signInWithPasskey()">
            Use Passkey
          </PortalActionButton>
        </form>
        <div v-if="!isNativeApp" class="mt-5 grid gap-3 rounded-[18px] border border-[rgba(10,96,255,0.12)] bg-[rgba(10,96,255,0.04)] px-4 py-3">
          <p class="m-0 text-[0.95rem] leading-[1.5] text-[rgba(60,60,67,0.82)]">
            You are using the web fork of `fsd.teslaandroid.com`. Bluetooth control only works in Web Bluetooth compatible browsers. On iPhone or iPad, use the autosteerplus app or Bluefy.
          </p>
          <div class="flex flex-wrap items-center gap-3">
            <PortalActionButton variant="ghost" :href="bluefyUrl" target="_blank" rel="noreferrer">
              Open Bluefy
            </PortalActionButton>
          </div>
        </div>
      </k-card>
      <div class="flex flex-wrap items-center gap-3 px-1">
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
    </div>
  </k-page>
</template>

<script setup lang="ts">
import { Capacitor } from '@capacitor/core';
import { ref } from 'vue';
import { kBlock, kCard, kPage } from 'konsta/vue';

import PortalActionButton from './PortalActionButton.vue';
import { portalActions, portalView } from '../view-model';

const isNativeApp = Capacitor.isNativePlatform();
const bluefyUrl = 'https://apps.apple.com/app/id1492822055';
const showLoginHelp = ref(false);
</script>
