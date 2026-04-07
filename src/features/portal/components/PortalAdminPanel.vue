<template>
  <section
    id="admin-panel"
    :class="['col-span-12', panelClass]"
    :hidden="!portalView.adminVisible"
  >
    <div :class="panelHeadingClass">
      <div :class="sectionTextStackClass">
        <p :class="panelLabelClass">Admin</p>
        <h2 :class="sectionTitleClass">Customer and package controls</h2>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <PortalActionButton
          id="shopify-sync-button"
          variant="secondary"
          :disabled="portalView.shopifySyncDisabled"
          @click="portalActions.syncShopifyCustomers()"
        >
          Refresh Shopify Eligibility
        </PortalActionButton>
        <PortalActionButton
          id="reload-packages-button"
          variant="ghost"
          :disabled="portalView.reloadPackagesDisabled"
          @click="portalActions.reloadPackages()"
        >
          Reload Packages
        </PortalActionButton>
        <PortalActionButton
          id="reload-customers-button"
          variant="ghost"
          :disabled="portalView.reloadCustomersDisabled"
          @click="portalActions.reloadCustomers()"
        >
          Reload Customers
        </PortalActionButton>
      </div>
    </div>
    <pre
      id="shopify-sync-result"
      class="mt-5 max-h-56 overflow-auto rounded-[22px] border border-[rgba(60,60,67,0.14)] bg-[#111827] px-4 py-4 text-[0.84rem] leading-[1.55] text-[#dbe4ff]"
      >{{ portalView.shopifySyncResult }}</pre
    >
    <section class="mt-5 grid gap-4 rounded-[22px] border border-[rgba(60,60,67,0.14)] bg-[rgba(255,255,255,0.94)] px-5 py-5">
      <div :class="sectionTextStackClass">
        <p :class="panelLabelClass">Rollout</p>
        <h3
          class="m-0 text-[1.2rem] font-semibold leading-[1.12] text-[#111111]"
        >
          Device Manager firmware gate
        </h3>
      </div>
      <p :class="mutedTextClass">
        {{ portalView.adminDeviceManagementNote }}
      </p>
      <form
        class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
        @submit.prevent="portalActions.saveDeviceManagementLock()"
      >
        <label :class="inputLabelClass">
          <span>Required firmware version</span>
          <input
            id="admin-device-management-version"
            v-model="portalView.adminDeviceManagementVersion"
            type="text"
            :class="inputClass"
            autocomplete="off"
            placeholder="e.g. 2.0.0"
            :disabled="portalView.adminDeviceManagementDisabled"
          />
        </label>
        <label :class="inputLabelClass">
          <span>Customer access groups</span>
          <input
            id="admin-device-management-groups"
            v-model="portalView.adminDeviceManagementGroups"
            type="text"
            :class="inputClass"
            autocomplete="off"
            placeholder="Leave blank for admins only"
            :disabled="portalView.adminDeviceManagementDisabled"
          />
        </label>
        <div class="flex items-end">
          <PortalActionButton
            type="submit"
            :disabled="portalView.adminDeviceManagementDisabled"
          >
            Save Rollout
          </PortalActionButton>
        </div>
      </form>
      <p id="admin-device-management-result" :class="mutedTextClass">
        {{ portalView.adminDeviceManagementResult }}
      </p>
    </section>
    <div class="mt-5 grid gap-5 xl:grid-cols-2">
      <section class="grid gap-4">
        <div :class="panelHeadingClass">
          <div :class="sectionTextStackClass">
            <p :class="panelLabelClass">Customers</p>
            <h3
              class="m-0 text-[1.2rem] font-semibold leading-[1.12] text-[#111111]"
            >
              Provision customer access
            </h3>
          </div>
        </div>
        <form
          id="admin-create-user-form"
          class="grid gap-4"
          method="post"
          action="./"
          @submit.prevent="portalActions.createCustomer()"
        >
          <label :class="inputLabelClass">
            <span>Email</span>
            <input
              id="admin-create-user-email"
              v-model="portalView.adminCreateUserEmail"
              type="email"
              autocomplete="email"
              :class="inputClass"
              :disabled="portalView.adminCreateUserDisabled"
              required
            />
          </label>
          <label :class="inputLabelClass">
            <span>Temporary password</span>
            <input
              id="admin-create-user-password"
              v-model="portalView.adminCreateUserPassword"
              type="text"
              autocomplete="off"
              :class="inputClass"
              :disabled="portalView.adminCreateUserDisabled"
              required
            />
          </label>
          <label :class="inputLabelClass">
            <span>Access groups</span>
            <input
              id="admin-create-user-groups"
              v-model="portalView.adminCreateUserGroups"
              type="text"
              autocomplete="off"
              placeholder="e.g. beta, vip"
              :class="inputClass"
              :disabled="portalView.adminCreateUserDisabled"
            />
          </label>
          <PortalActionButton
            type="submit"
            :disabled="portalView.adminCreateUserDisabled"
          >
            Create Customer
          </PortalActionButton>
        </form>
        <p id="admin-create-user-result" :class="mutedTextClass">
          {{ portalView.adminCreateUserResult }}
        </p>
        <p id="admin-user-note" :class="mutedTextClass">
          {{ portalView.adminCustomersNote }}
        </p>
        <div id="admin-user-list" class="grid gap-4">
          <article
            v-for="customer in portalView.adminCustomers"
            :key="customer.id"
            class="flex flex-wrap items-start justify-between gap-4 rounded-[22px] border border-[rgba(60,60,67,0.14)] bg-[rgba(255,255,255,0.94)] px-5 py-5"
          >
            <div class="grid min-w-0 flex-1 gap-3">
              <div class="flex flex-wrap items-center gap-3">
                <strong class="text-[1.02rem] text-[#111111]">{{
                  customer.email
                }}</strong>
                <span :class="statusChipClass(customer.statusTone)">{{
                  customer.statusLabel
                }}</span>
              </div>
              <p :class="mutedTextClass">{{ customer.primaryMeta }}</p>
              <p :class="mutedTextClass">{{ customer.secondaryMeta }}</p>
              <form
                class="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]"
                @submit.prevent="portalActions.saveCustomerGroups(customer.id)"
              >
                <label :class="inputLabelClass">
                  <span>Access groups</span>
                  <input
                    v-model="customer.accessGroupsInput"
                    type="text"
                    :class="inputClass"
                    autocomplete="off"
                    placeholder="e.g. beta, vip"
                    :disabled="customer.saveGroupsDisabled"
                  />
                </label>
                <PortalActionButton
                  type="submit"
                  variant="secondary"
                  :disabled="customer.saveGroupsDisabled"
                >
                  {{ customer.saveGroupsLabel }}
                </PortalActionButton>
              </form>
            </div>
            <div class="flex shrink-0 flex-wrap items-center gap-3">
              <PortalActionButton
                :variant="customer.toggleVariant"
                :disabled="customer.toggleDisabled"
                @click="portalActions.toggleCustomerAccess(customer.id)"
              >
                {{ customer.toggleLabel }}
              </PortalActionButton>
              <PortalActionButton
                variant="danger"
                :disabled="customer.deleteDisabled"
                @click="portalActions.deleteCustomer(customer.id)"
              >
                {{ customer.deleteLabel }}
              </PortalActionButton>
            </div>
          </article>
        </div>
      </section>

      <section class="grid gap-4">
        <div :class="panelHeadingClass">
          <div :class="sectionTextStackClass">
            <p :class="panelLabelClass">Packages</p>
            <h3
              class="m-0 text-[1.2rem] font-semibold leading-[1.12] text-[#111111]"
            >
              Package access groups
            </h3>
          </div>
        </div>
        <p id="admin-package-note" :class="mutedTextClass">
          {{ portalView.adminPackagesNote }}
        </p>
        <div id="admin-package-list" class="grid gap-4">
          <article
            v-for="pkg in portalView.adminPackages"
            :key="pkg.id"
            class="flex flex-wrap items-start justify-between gap-4 rounded-[22px] border border-[rgba(60,60,67,0.14)] bg-[rgba(255,255,255,0.94)] px-5 py-5"
          >
            <div class="grid min-w-0 flex-1 gap-3">
              <strong class="text-[1.02rem] text-[#111111]">{{
                pkg.label
              }}</strong>
              <p :class="mutedTextClass">{{ pkg.primaryMeta }}</p>
              <p :class="mutedTextClass">{{ pkg.secondaryMeta }}</p>
              <p :class="mutedTextClass">{{ pkg.audienceMeta }}</p>
              <form
                class="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]"
                @submit.prevent="portalActions.savePackageGroups(pkg.id)"
              >
                <label :class="inputLabelClass">
                  <span>Access groups</span>
                  <input
                    v-model="pkg.accessGroupsInput"
                    type="text"
                    :class="inputClass"
                    autocomplete="off"
                    placeholder="Leave blank for all customers"
                    :disabled="pkg.saveGroupsDisabled"
                  />
                </label>
                <PortalActionButton
                  type="submit"
                  variant="secondary"
                  :disabled="pkg.saveGroupsDisabled"
                >
                  {{ pkg.saveGroupsLabel }}
                </PortalActionButton>
              </form>
            </div>
            <div class="flex shrink-0 items-center gap-3">
              <PortalActionButton
                variant="danger"
                :disabled="pkg.deleteDisabled"
                @click="portalActions.deletePackage(pkg.id)"
              >
                {{ pkg.deleteLabel }}
              </PortalActionButton>
            </div>
          </article>
        </div>
      </section>
    </div>
  </section>
</template>

<script setup lang="ts">
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

function statusChipClass(statusTone: string) {
  const baseClass =
    "inline-flex rounded-full border px-3 py-1 text-[0.82rem] font-semibold";

  if (statusTone === "locked") {
    return `${baseClass} border-[rgba(255,149,0,0.18)] bg-[rgba(255,149,0,0.10)] text-[#9a3412]`;
  }

  if (statusTone === "disabled") {
    return `${baseClass} border-[rgba(255,59,48,0.18)] bg-[rgba(255,59,48,0.08)] text-[#b42318]`;
  }

  return `${baseClass} border-[rgba(20,140,70,0.16)] bg-[rgba(20,140,70,0.08)] text-[#136c37]`;
}
</script>
