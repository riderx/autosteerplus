<template>
  <div class="page-shell">
    <main id="auth-shell" class="auth-shell" :hidden="portalView.authenticated">
      <section class="hero hero-auth">
        <p class="eyebrow">Tesla FSD</p>
        <h1 class="hero-title">Device Manager</h1>
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
        </form>
      </section>
    </main>

    <div id="app-shell" :hidden="!portalView.authenticated">
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

      <section id="passkey-setup-gate" class="password-gate" :hidden="!portalView.passkeySetupVisible">
        <div class="panel panel-password-gate">
          <div class="panel-heading">
            <div>
              <p class="panel-label">Admin Security</p>
              <h2>Register your admin passkey</h2>
            </div>
          </div>
          <p id="passkey-setup-note" class="muted-copy panel-note">
            {{ portalView.passkeySetupNote }}
          </p>
          <div class="password-gate-actions">
            <button
              id="admin-register-passkey-button"
              class="button button-primary"
              type="button"
              :disabled="portalView.adminRegisterPasskeyDisabled"
              @click="portalActions.registerAdminPasskey()"
            >
              Register Passkey
            </button>
            <button id="admin-passkey-logout-button" class="button button-secondary" type="button" @click="portalActions.logout()">
              Log Out
            </button>
          </div>
        </div>
      </section>

      <header class="hero">
        <p class="eyebrow">Tesla FSD</p>
        <h1 class="hero-title">Tesla FSD Device Manager</h1>
        <p class="hero-copy">
          OTA updates and device diagnostics.
        </p>
        <div class="hero-actions">
          <button id="connect-button" class="button button-primary" type="button" :disabled="portalView.connectDisabled" @click="portalActions.connect()">
            Connect Device
          </button>
          <button id="disconnect-button" class="button button-secondary" type="button" :disabled="portalView.disconnectDisabled" @click="portalActions.disconnect()">
            Disconnect
          </button>
          <button id="refresh-button" class="button button-ghost" type="button" :disabled="portalView.refreshDisabled" @click="portalActions.refreshStatus()">
            Refresh Status
          </button>
          <button
            id="change-password-button"
            class="button button-ghost"
            type="button"
            :hidden="!portalView.showChangePasswordButton"
            @click="portalActions.openPasswordDialog()"
          >
            Change Password
          </button>
          <button
            id="logout-button"
            class="button button-secondary"
            type="button"
            :hidden="!portalView.showLogoutButton"
            @click="portalActions.logout()"
          >
            Log Out
          </button>
        </div>
        <div class="hero-meta">
          <span id="connection-pill" :class="['pill', portalView.connectionOnline ? 'pill-online' : 'pill-offline']">
            {{ portalView.connectionLabel }}
          </span>
        </div>
      </header>

      <main id="dashboard" class="dashboard">
        <section class="panel panel-status">
          <div class="panel-heading">
            <div>
              <p class="panel-label">Device Snapshot</p>
              <h2>Runtime status</h2>
            </div>
            <button id="reboot-button" class="button button-ghost" type="button" :disabled="portalView.rebootDisabled" @click="portalActions.rebootDevice()">
              Reboot Device
            </button>
          </div>
          <div class="status-grid">
            <article class="metric-card">
              <span class="metric-label">Device</span>
              <strong id="device-name">{{ portalView.deviceName }}</strong>
            </article>
            <article class="metric-card">
              <span class="metric-label">Firmware</span>
              <strong id="firmware-version">{{ portalView.firmwareVersion }}</strong>
            </article>
            <article class="metric-card">
              <span class="metric-label">CAN</span>
              <strong id="can-state">{{ portalView.canState }}</strong>
            </article>
            <article class="metric-card">
              <span class="metric-label">Hooks</span>
              <strong id="hooks-state">{{ portalView.hooksState }}</strong>
            </article>
            <article class="metric-card">
              <span class="metric-label">Profile</span>
              <strong id="profile-state">{{ portalView.profileState }}</strong>
            </article>
            <article class="metric-card">
              <span class="metric-label">Speed Offset</span>
              <strong id="speed-offset-state">{{ portalView.speedOffsetState }}</strong>
            </article>
            <article class="metric-card">
              <span class="metric-label">FSD Flag</span>
              <strong id="fsd-flag-state">{{ portalView.fsdFlagState }}</strong>
            </article>
            <article class="metric-card">
              <span class="metric-label">OTA</span>
              <strong id="ota-state">{{ portalView.otaState }}</strong>
            </article>
          </div>
        </section>

        <section class="panel panel-controls">
          <div class="panel-heading">
            <div>
              <p class="panel-label">Control</p>
              <h2>CAN hook gate</h2>
            </div>
          </div>
          <label class="toggle-card" for="hooks-toggle">
            <div>
              <span class="toggle-title">Enable CAN hooks</span>
              <p class="toggle-copy">
                When disabled, the device stays online and observable but stops enabling Full Self Driving in your
                vehicle.
              </p>
            </div>
            <span class="toggle-shell">
              <input
                id="hooks-toggle"
                v-model="portalView.hooksEnabled"
                type="checkbox"
                :disabled="portalView.hooksDisabled"
                @change="portalActions.toggleHooks(portalView.hooksEnabled)"
              >
              <span class="toggle-slider" aria-hidden="true"></span>
            </span>
          </label>
          <p id="config-note" class="muted-copy">
            {{ portalView.configNote }}
          </p>
        </section>

        <section class="panel panel-ota">
          <div class="panel-heading">
            <div>
              <p class="panel-label">OTA</p>
              <h2>Install firmware</h2>
            </div>
          </div>
          <p class="muted-copy panel-note">
            Select the firmware package approved for your device, then transfer it over Web Bluetooth.
          </p>
          <div id="install-options" class="install-options">
            <button
              v-for="pkg in portalView.installPackages"
              :key="pkg.id"
              class="button button-primary install-button"
              type="button"
              :disabled="pkg.disabled"
              @click="portalActions.installPackage(pkg.id)"
            >
              {{ pkg.label }}
            </button>
          </div>
          <p id="package-note" class="muted-copy panel-note">
            {{ portalView.packageNote }}
          </p>
          <div class="ota-actions">
            <button id="ota-abort-button" class="button button-secondary" type="button" :disabled="portalView.abortOtaDisabled" @click="portalActions.abortOta()">
              Abort OTA
            </button>
          </div>
          <div class="progress-block">
            <div class="progress-meta">
              <span id="progress-label">{{ portalView.progressLabel }}</span>
              <span id="progress-percent">{{ portalView.progressPercentText }}</span>
            </div>
            <div class="progress-track">
              <div id="progress-bar" class="progress-bar" :style="{ width: `${portalView.progressPercent}%` }"></div>
            </div>
          </div>
        </section>

        <section class="panel panel-subscription">
          <div class="panel-heading">
            <div>
              <p class="panel-label">Subscription</p>
              <h2>FSD subscription manual</h2>
            </div>
          </div>
          <p class="muted-copy">
            If you have not purchased FSD outright, you can subscribe monthly through a Canadian Tesla account.
          </p>
          <div class="advisory-note advisory-note-warning">
            <strong>Software advisory</strong>
            <p>Do not update the vehicle to software version <code>2026.6.8</code> until further notice.</p>
          </div>
          <ol class="guide-list">
            <li>
              <strong>Create a Canadian Tesla account</strong>
              <ul class="guide-sublist">
                <li>Create a new Tesla account at <code>tesla.com/en_ca</code>.</li>
                <li>Set the region to Canada during signup.</li>
              </ul>
            </li>
            <li>
              <strong>Add a payment method</strong>
              <ul class="guide-sublist">
                <li>Use a payment card that supports international transactions.</li>
                <li>If Tesla requires a Canadian postal code, use <code>T4A 2G4</code>.</li>
              </ul>
            </li>
            <li>
              <strong>Transfer your vehicle</strong>
              <ul class="guide-sublist">
                <li>Open the Tesla app on your original account.</li>
                <li>Go to <code>Manage Drivers</code>.</li>
                <li>Select <code>Remove or Transfer Ownership</code>.</li>
                <li>Follow the prompts to transfer the car to the Canadian account.</li>
              </ul>
            </li>
            <li>
              <strong>Subscribe to FSD</strong>
              <ul class="guide-sublist">
                <li>Log in with the Canadian Tesla account.</li>
                <li>Start the FSD subscription for <code>$99 CAD/month</code>.</li>
              </ul>
            </li>
          </ol>
        </section>

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

        <section class="panel panel-verification">
          <div class="panel-heading">
            <div>
              <p class="panel-label">Verification</p>
              <h2>Confirm the install worked</h2>
            </div>
          </div>
          <p class="muted-copy">
            After installing the device, use Summon range in the Tesla app as the quick validation check.
          </p>
          <ol class="guide-list">
            <li>
              <strong>Open the Tesla app</strong>
            </li>
            <li>
              <strong>Go to Summon</strong>
            </li>
            <li>
              <strong>Check the blue circle around the car</strong>
              <div class="comparison-grid">
                <article class="comparison-card">
                  <span class="metric-label">Before install</span>
                  <strong>About 40 m diameter</strong>
                  <p class="muted-copy">Roughly a 20 m radius.</p>
                </article>
                <article class="comparison-card">
                  <span class="metric-label">After install</span>
                  <strong>About 200 m diameter</strong>
                  <p class="muted-copy">Roughly a 100 m radius.</p>
                </article>
              </div>
            </li>
            <li>
              <strong>If the circle expands, the installation was successful</strong>
            </li>
          </ol>
        </section>

        <section class="panel panel-log">
          <div class="panel-heading">
            <div>
              <p class="panel-label">Events</p>
              <h2>Session log</h2>
            </div>
            <button id="clear-log-button" class="button button-ghost" type="button" @click="portalActions.clearLog()">
              Clear log
            </button>
          </div>
          <pre id="event-log" class="event-log" aria-live="polite">{{ portalView.eventLogText }}</pre>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

import { portalActions, portalView } from './features/portal/view-model';

onMounted(async () => {
  const { initPortalController } = await import('./features/portal/controller');
  initPortalController();
});
</script>
