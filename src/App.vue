<template>
  <div class="page-shell">
    <main id="auth-shell" class="auth-shell">
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
          If your account was imported from Shopify, your default username is the email address used on your order
          and your default password is your Shopify order number. If you placed multiple orders, use the first order
          number. If you already registered a passkey, you can use it instead of your password.
        </p>
        <p id="login-feedback" class="auth-warning" hidden></p>
        <form id="login-form" class="auth-form" method="post" action="./">
          <label class="field">
            <span>Email</span>
            <input id="login-email" name="email" type="email" autocomplete="username" required>
          </label>
          <label class="field">
            <span>Password</span>
            <input id="login-password" name="password" type="password" autocomplete="current-password" required>
          </label>
          <div id="login-challenge-shell" class="challenge-shell" hidden>
            <div id="login-challenge-widget"></div>
          </div>
          <p id="login-challenge-note" class="muted-copy panel-note" hidden>
            Complete the security check to continue signing in.
          </p>
          <button id="login-submit" class="button button-primary" type="submit">Sign In</button>
          <button id="login-passkey-button" class="button button-secondary" type="button">Use Passkey</button>
        </form>
      </section>
    </main>

    <div id="app-shell" hidden>
      <section id="password-gate" class="password-gate" hidden>
        <div class="panel panel-password-gate">
          <div class="panel-heading">
            <div>
              <p class="panel-label">Security</p>
              <h2>Change your password</h2>
            </div>
          </div>
          <p id="password-gate-note" class="muted-copy panel-note">
            Your temporary password must be replaced before you can use the portal.
          </p>
          <p class="muted-copy panel-note">
            Secure here means at least 15 characters. A long passphrase is fine. Do not reuse your email address,
            a 4-digit code, or one repeated character.
          </p>
          <form id="password-gate-form" class="auth-form" method="post" action="./">
            <label id="password-gate-current-wrap" class="field" hidden>
              <span>Current password</span>
              <input id="password-gate-current-password" type="password" autocomplete="current-password">
            </label>
            <label class="field">
              <span>New password</span>
              <input id="password-gate-new-password" type="password" autocomplete="new-password" required>
            </label>
            <label class="field">
              <span>Confirm new password</span>
              <input id="password-gate-confirm-password" type="password" autocomplete="new-password" required>
            </label>
            <div class="password-gate-actions">
              <button id="password-gate-cancel" class="button button-secondary" type="button" hidden>Cancel</button>
              <button class="button button-primary" type="submit">Update Password</button>
            </div>
          </form>
        </div>
      </section>

      <section id="passkey-setup-gate" class="password-gate" hidden>
        <div class="panel panel-password-gate">
          <div class="panel-heading">
            <div>
              <p class="panel-label">Admin Security</p>
              <h2>Register your admin passkey</h2>
            </div>
          </div>
          <p id="passkey-setup-note" class="muted-copy panel-note">
            Admin accounts now require a passkey before the administration panel can be used.
          </p>
          <div class="password-gate-actions">
            <button id="admin-register-passkey-button" class="button button-primary" type="button">
              Register Passkey
            </button>
            <button id="admin-passkey-logout-button" class="button button-secondary" type="button">Log Out</button>
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
          <button id="connect-button" class="button button-primary" type="button" disabled>Connect Device</button>
          <button id="disconnect-button" class="button button-secondary" type="button" disabled>Disconnect</button>
          <button id="refresh-button" class="button button-ghost" type="button" disabled>Refresh Status</button>
          <button id="change-password-button" class="button button-ghost" type="button" hidden>Change Password</button>
          <button id="logout-button" class="button button-secondary" type="button" hidden>Log Out</button>
        </div>
        <div class="hero-meta">
          <span id="connection-pill" class="pill pill-offline">Disconnected</span>
        </div>
      </header>

      <main id="dashboard" class="dashboard">
        <section class="panel panel-status">
          <div class="panel-heading">
            <div>
              <p class="panel-label">Device Snapshot</p>
              <h2>Runtime status</h2>
            </div>
            <button id="reboot-button" class="button button-ghost" type="button" disabled>Reboot Device</button>
          </div>
          <div class="status-grid">
            <article class="metric-card">
              <span class="metric-label">Device</span>
              <strong id="device-name">Not connected</strong>
            </article>
            <article class="metric-card">
              <span class="metric-label">Firmware</span>
              <strong id="firmware-version">-</strong>
            </article>
            <article class="metric-card">
              <span class="metric-label">CAN</span>
              <strong id="can-state">-</strong>
            </article>
            <article class="metric-card">
              <span class="metric-label">Hooks</span>
              <strong id="hooks-state">-</strong>
            </article>
            <article class="metric-card">
              <span class="metric-label">Profile</span>
              <strong id="profile-state">-</strong>
            </article>
            <article class="metric-card">
              <span class="metric-label">Speed Offset</span>
              <strong id="speed-offset-state">-</strong>
            </article>
            <article class="metric-card">
              <span class="metric-label">FSD Flag</span>
              <strong id="fsd-flag-state">-</strong>
            </article>
            <article class="metric-card">
              <span class="metric-label">OTA</span>
              <strong id="ota-state">Idle</strong>
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
              <input id="hooks-toggle" type="checkbox" disabled>
              <span class="toggle-slider" aria-hidden="true"></span>
            </span>
          </label>
          <p id="config-note" class="muted-copy">
            Connect to the device before editing persistent settings.
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
          <div id="install-options" class="install-options"></div>
          <p id="package-note" class="muted-copy panel-note">
            No packages loaded yet.
          </p>
          <div class="ota-actions">
            <button id="ota-abort-button" class="button button-secondary" type="button" disabled>Abort OTA</button>
          </div>
          <div class="progress-block">
            <div class="progress-meta">
              <span id="progress-label">No transfer started</span>
              <span id="progress-percent">0%</span>
            </div>
            <div class="progress-track">
              <div id="progress-bar" class="progress-bar"></div>
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

        <section id="admin-panel" class="panel panel-admin" hidden>
          <div class="panel-heading">
            <div>
              <p class="panel-label">Admin</p>
              <h2>Customer and package controls</h2>
            </div>
            <div class="hero-actions">
              <button id="shopify-sync-button" class="button button-secondary" type="button">
                Refresh Shopify Eligibility
              </button>
              <button id="reload-packages-button" class="button button-ghost" type="button">Reload Packages</button>
              <button id="reload-customers-button" class="button button-ghost" type="button">Reload Customers</button>
            </div>
          </div>
          <pre id="shopify-sync-result" class="event-log event-log-compact"></pre>
          <div class="admin-grid">
            <section class="admin-stack">
              <div class="panel-heading panel-heading-subtle">
                <div>
                  <p class="panel-label">Customers</p>
                  <h3>Provision customer access</h3>
                </div>
              </div>
              <form id="admin-create-user-form" class="auth-form auth-form-tight" method="post" action="./">
                <label class="field">
                  <span>Email</span>
                  <input id="admin-create-user-email" type="email" autocomplete="email" required>
                </label>
                <label class="field">
                  <span>Temporary password</span>
                  <input id="admin-create-user-password" type="text" autocomplete="off" required>
                </label>
                <label class="field">
                  <span>Access groups</span>
                  <input id="admin-create-user-groups" type="text" autocomplete="off" placeholder="e.g. beta, vip">
                </label>
                <button class="button button-primary" type="submit">Create Customer</button>
              </form>
              <p id="admin-create-user-result" class="muted-copy panel-note"></p>
              <p id="admin-user-note" class="muted-copy panel-note"></p>
              <div id="admin-user-list" class="user-admin-list"></div>
            </section>

            <section class="admin-stack">
              <div class="panel-heading panel-heading-subtle">
                <div>
                  <p class="panel-label">Packages</p>
                  <h3>Package access groups</h3>
                </div>
              </div>
              <p id="admin-package-note" class="muted-copy panel-note"></p>
              <div id="admin-package-list" class="user-admin-list"></div>
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
              <button id="reload-passkeys-button" class="button button-ghost" type="button">Reload Passkeys</button>
              <button id="register-passkey-button" class="button button-primary" type="button">Add Passkey</button>
            </div>
          </div>
          <p id="passkey-note" class="muted-copy panel-note">
            Passkeys let you sign in without reusing a password. Admin accounts require at least one registered
            passkey.
          </p>
          <div id="passkey-list" class="user-admin-list"></div>
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
            <button id="clear-log-button" class="button button-ghost" type="button">Clear log</button>
          </div>
          <pre id="event-log" class="event-log" aria-live="polite"></pre>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(async () => {
  const { initPortalController } = await import('./features/portal/controller');
  initPortalController();
});
</script>
