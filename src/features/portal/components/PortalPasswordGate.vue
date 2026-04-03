<template>
  <section
    id="password-gate"
    class="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(17,17,17,0.28)] p-4 backdrop-blur-sm"
    :hidden="!portalView.passwordGateVisible"
  >
    <k-card :class="['w-full max-w-2xl', panelClass]">
      <div :class="panelHeadingClass">
        <div :class="sectionTextStackClass">
          <p :class="panelLabelClass">Security</p>
          <h2 :class="sectionTitleClass">Change your password</h2>
        </div>
      </div>
      <p id="password-gate-note" :class="['mt-4', mutedTextClass]">
        {{ portalView.passwordGateNote }}
      </p>
      <p :class="['mt-3', mutedTextClass]">
        Secure here means at least 15 characters. A long passphrase is fine. Do
        not reuse your email address, a 4-digit code, or one repeated character.
      </p>
      <form
        id="password-gate-form"
        class="mt-5 grid gap-4"
        method="post"
        action="./"
        @submit.prevent="portalActions.changePassword()"
      >
        <label
          id="password-gate-current-wrap"
          :class="inputLabelClass"
          :hidden="!portalView.passwordGateRequiresCurrent"
        >
          <span>Current password</span>
          <input
            id="password-gate-current-password"
            v-model="portalView.passwordCurrent"
            type="password"
            autocomplete="current-password"
            :class="inputClass"
            :required="portalView.passwordGateRequiresCurrent"
          />
        </label>
        <label :class="inputLabelClass">
          <span>New password</span>
          <input
            id="password-gate-new-password"
            v-model="portalView.passwordNew"
            type="password"
            autocomplete="new-password"
            :class="inputClass"
            required
          />
        </label>
        <label :class="inputLabelClass">
          <span>Confirm new password</span>
          <input
            id="password-gate-confirm-password"
            v-model="portalView.passwordConfirm"
            type="password"
            autocomplete="new-password"
            :class="inputClass"
            required
          />
        </label>
        <div class="flex flex-wrap justify-end gap-3">
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
import { kCard } from "konsta/vue";

import PortalActionButton from "./PortalActionButton.vue";
import { portalActions, portalView } from "../view-model";
import {
  inputClass,
  inputLabelClass,
  mutedTextClass,
  panelClass,
  panelHeadingClass,
  panelLabelClass,
  sectionTextStackClass,
  sectionTitleClass,
} from "../ui";
</script>
