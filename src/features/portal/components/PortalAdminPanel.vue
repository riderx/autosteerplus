<template>
  <section id="admin-panel" class="panel panel-admin" :hidden="!portalView.adminVisible">
    <div class="panel-heading">
      <div>
        <p class="panel-label">Admin</p>
        <h2>Customer and package controls</h2>
      </div>
      <div class="hero-actions">
        <button
          id="shopify-sync-button"
          class="button button-secondary"
          type="button"
          :disabled="portalView.shopifySyncDisabled"
          @click="portalActions.syncShopifyCustomers()"
        >
          Refresh Shopify Eligibility
        </button>
        <button
          id="reload-packages-button"
          class="button button-ghost"
          type="button"
          :disabled="portalView.reloadPackagesDisabled"
          @click="portalActions.reloadPackages()"
        >
          Reload Packages
        </button>
        <button
          id="reload-customers-button"
          class="button button-ghost"
          type="button"
          :disabled="portalView.reloadCustomersDisabled"
          @click="portalActions.reloadCustomers()"
        >
          Reload Customers
        </button>
      </div>
    </div>
    <pre id="shopify-sync-result" class="event-log event-log-compact">{{ portalView.shopifySyncResult }}</pre>
    <div class="admin-grid">
      <section class="admin-stack">
        <div class="panel-heading panel-heading-subtle">
          <div>
            <p class="panel-label">Customers</p>
            <h3>Provision customer access</h3>
          </div>
        </div>
        <form id="admin-create-user-form" class="auth-form auth-form-tight" method="post" action="./" @submit.prevent="portalActions.createCustomer()">
          <label class="field">
            <span>Email</span>
            <input
              id="admin-create-user-email"
              v-model="portalView.adminCreateUserEmail"
              type="email"
              autocomplete="email"
              :disabled="portalView.adminCreateUserDisabled"
              required
            >
          </label>
          <label class="field">
            <span>Temporary password</span>
            <input
              id="admin-create-user-password"
              v-model="portalView.adminCreateUserPassword"
              type="text"
              autocomplete="off"
              :disabled="portalView.adminCreateUserDisabled"
              required
            >
          </label>
          <label class="field">
            <span>Access groups</span>
            <input
              id="admin-create-user-groups"
              v-model="portalView.adminCreateUserGroups"
              type="text"
              autocomplete="off"
              placeholder="e.g. beta, vip"
              :disabled="portalView.adminCreateUserDisabled"
            >
          </label>
          <button class="button button-primary" type="submit" :disabled="portalView.adminCreateUserDisabled">
            Create Customer
          </button>
        </form>
        <p id="admin-create-user-result" class="muted-copy panel-note">{{ portalView.adminCreateUserResult }}</p>
        <p id="admin-user-note" class="muted-copy panel-note">{{ portalView.adminCustomersNote }}</p>
        <div id="admin-user-list" class="user-admin-list">
          <article v-for="customer in portalView.adminCustomers" :key="customer.id" class="user-admin-item">
            <div class="user-admin-copy">
              <div class="user-admin-title-row">
                <strong class="user-admin-title">{{ customer.email }}</strong>
                <span :class="['status-chip', customer.statusClass]">{{ customer.statusLabel }}</span>
              </div>
              <p class="user-admin-meta">{{ customer.primaryMeta }}</p>
              <p class="user-admin-meta">{{ customer.secondaryMeta }}</p>
              <form class="admin-inline-form" @submit.prevent="portalActions.saveCustomerGroups(customer.id)">
                <label class="admin-inline-field">
                  <span class="admin-inline-label">Access groups</span>
                  <input
                    v-model="customer.accessGroupsInput"
                    type="text"
                    class="admin-inline-input"
                    autocomplete="off"
                    placeholder="e.g. beta, vip"
                    :disabled="customer.saveGroupsDisabled"
                  >
                </label>
                <button class="button button-secondary" type="submit" :disabled="customer.saveGroupsDisabled">
                  {{ customer.saveGroupsLabel }}
                </button>
              </form>
            </div>
            <div class="user-admin-actions">
              <button
                :class="customer.toggleClass"
                type="button"
                :disabled="customer.toggleDisabled"
                @click="portalActions.toggleCustomerAccess(customer.id)"
              >
                {{ customer.toggleLabel }}
              </button>
              <button class="button button-danger" type="button" :disabled="customer.deleteDisabled" @click="portalActions.deleteCustomer(customer.id)">
                {{ customer.deleteLabel }}
              </button>
            </div>
          </article>
        </div>
      </section>

      <section class="admin-stack">
        <div class="panel-heading panel-heading-subtle">
          <div>
            <p class="panel-label">Packages</p>
            <h3>Package access groups</h3>
          </div>
        </div>
        <p id="admin-package-note" class="muted-copy panel-note">{{ portalView.adminPackagesNote }}</p>
        <div id="admin-package-list" class="user-admin-list">
          <article v-for="pkg in portalView.adminPackages" :key="pkg.id" class="package-admin-item">
            <div class="package-admin-copy">
              <strong class="package-admin-title">{{ pkg.label }}</strong>
              <p class="package-admin-meta">{{ pkg.primaryMeta }}</p>
              <p class="package-admin-meta">{{ pkg.secondaryMeta }}</p>
              <p class="package-admin-meta">{{ pkg.audienceMeta }}</p>
              <form class="admin-inline-form" @submit.prevent="portalActions.savePackageGroups(pkg.id)">
                <label class="admin-inline-field">
                  <span class="admin-inline-label">Access groups</span>
                  <input
                    v-model="pkg.accessGroupsInput"
                    type="text"
                    class="admin-inline-input"
                    autocomplete="off"
                    placeholder="Leave blank for all customers"
                    :disabled="pkg.saveGroupsDisabled"
                  >
                </label>
                <button class="button button-secondary" type="submit" :disabled="pkg.saveGroupsDisabled">
                  {{ pkg.saveGroupsLabel }}
                </button>
              </form>
            </div>
            <div class="package-admin-actions">
              <button class="button button-danger" type="button" :disabled="pkg.deleteDisabled" @click="portalActions.deletePackage(pkg.id)">
                {{ pkg.deleteLabel }}
              </button>
            </div>
          </article>
        </div>
      </section>
    </div>
  </section>
</template>

<script setup lang="ts">
import { portalActions, portalView } from '../view-model';
</script>
