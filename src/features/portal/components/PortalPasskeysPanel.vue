<template>
  <section :class="['col-span-12', panelClass]">
    <div :class="panelHeadingClass">
      <div :class="sectionTextStackClass">
        <p :class="panelLabelClass">Security</p>
        <h2 :class="sectionTitleClass">Passkeys</h2>
      </div>
      <div :class="actionRowClass">
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
    <p id="passkey-note" :class="['mt-4', mutedTextClass]">
      {{ portalView.passkeyNote }}
    </p>
    <div id="passkey-list" class="mt-5 grid gap-4">
      <article
        v-for="passkey in portalView.passkeys"
        :key="passkey.id"
        class="flex flex-wrap items-start justify-between gap-4 rounded-[22px] border border-[rgba(60,60,67,0.14)] bg-[rgba(255,255,255,0.94)] px-5 py-5"
      >
        <div class="grid min-w-0 gap-2">
          <strong class="text-[1.02rem] text-[#111111]">{{
            passkey.title
          }}</strong>
          <p :class="mutedTextClass">{{ passkey.primaryMeta }}</p>
          <p :class="mutedTextClass">{{ passkey.secondaryMeta }}</p>
        </div>
        <div class="flex shrink-0 items-center gap-3">
          <PortalActionButton
            variant="danger"
            :disabled="passkey.deleteDisabled"
            @click="portalActions.removePasskey(passkey.id)"
          >
            {{ passkey.deleteLabel }}
          </PortalActionButton>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import PortalActionButton from "./PortalActionButton.vue";
import { portalActions, portalView } from "../view-model";
import {
  actionRowClass,
  mutedTextClass,
  panelClass,
  panelHeadingClass,
  panelLabelClass,
  sectionTextStackClass,
  sectionTitleClass,
} from "../ui";
</script>
