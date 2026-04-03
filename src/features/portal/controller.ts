// @ts-nocheck
// Preserves the working portal behavior while the UI is hosted by Vue.
import {
  assignPortalActions,
  defaultAuthNote,
  defaultPasskeySetupNote,
  defaultPasswordGateNote,
  portalView,
} from "./view-model";
import { watch } from "vue";
const BLE_SERVICE_UUID = "74d9d2db-4d0a-4f23-9acb-5528df6b9800";
const BLE_STATUS_UUID = "74d9d2db-4d0a-4f23-9acb-5528df6b9801";
const BLE_CONFIG_UUID = "74d9d2db-4d0a-4f23-9acb-5528df6b9802";
const BLE_COMMAND_UUID = "74d9d2db-4d0a-4f23-9acb-5528df6b9803";
const BLE_OTA_DATA_UUID = "74d9d2db-4d0a-4f23-9acb-5528df6b9804";

const DEFAULT_OTA_CHUNK_SIZE = 180;
const MIN_OTA_CHUNK_SIZE = 96;
const OTA_CHUNK_RETRY_LIMIT = 4;
const OTA_PROGRESS_STATUS_EVERY = 6;
const OTA_RETRY_BACKOFF_MS = 180;
const STATUS_POLL_INTERVAL_MS = 1500;
const OTA_FLUSH_POLL_INTERVAL_MS = 200;
const OTA_FLUSH_TIMEOUT_MS = 20000;
const OTA_FLUSH_STATUS_INTERVAL_MS = 800;
const OTA_STALLED_TAIL_GRACE_MS = 700;
const OTA_TAIL_RESEND_LIMIT = 2;
const OTA_TAIL_FLUSH_WINDOW_BYTES = DEFAULT_OTA_CHUNK_SIZE * 2;

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const PASSWORD_MIN_LENGTH = 15;
const DASHBOARD_HASH = "#/home";
const DOCS_HASH = "#/docs";
const ONBOARDING_HASH = "#/onboarding";
const FAQ_HASH = "#/faq";
const ADVANCED_MODE_STORAGE_KEY = "autosteerplus.advanced-mode";
let initialized = false;
const dom = {
  loginChallengeWidget: null,
};

const state = {
  authenticated: false,
  user: null,
  mustChangePassword: false,
  adminPasskeySetupRequired: false,
  passwordDialogOpen: false,
  packages: [],
  customers: [],
  passkeys: [],
  device: null,
  server: null,
  service: null,
  statusCharacteristic: null,
  configCharacteristic: null,
  commandCharacteristic: null,
  otaDataCharacteristic: null,
  commandWaiters: [],
  statusPollTimer: null,
  connected: false,
  updating: false,
  deletingPackageId: "",
  savingPackageGroupsId: "",
  syncingCustomers: false,
  loadingCustomers: false,
  loadingPasskeys: false,
  creatingCustomer: false,
  updatingCustomerId: 0,
  savingCustomerGroupsId: 0,
  deletingCustomerId: 0,
  deletingPasskeyId: 0,
  lastStatus: null,
  lastConfig: null,
  pendingFirmware: null,
  loginChallengeRequired: false,
  turnstileConfigured: false,
  turnstileWidgetId: "",
  turnstileToken: "",
  turnstileRenderRetryTimer: 0,
  turnstileRenderRetryCount: 0,
};

function readCsrfToken() {
  return (
    document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute("content") ?? ""
  );
}

function readTurnstileSiteKey() {
  return (
    document
      .querySelector('meta[name="turnstile-site-key"]')
      ?.getAttribute("content")
      ?.trim() ?? ""
  );
}

function clearTurnstileRenderRetry() {
  if (state.turnstileRenderRetryTimer) {
    window.clearTimeout(state.turnstileRenderRetryTimer);
    state.turnstileRenderRetryTimer = 0;
  }
}

function scheduleTurnstileRenderRetry() {
  if (
    state.turnstileRenderRetryTimer ||
    !state.turnstileConfigured ||
    !state.loginChallengeRequired ||
    state.turnstileWidgetId
  ) {
    return;
  }

  if (state.turnstileRenderRetryCount >= 40) {
    portalView.loginChallengeNote =
      "Complete the security check to continue signing in. If the widget does not appear, reload the page.";
    return;
  }

  state.turnstileRenderRetryTimer = window.setTimeout(() => {
    state.turnstileRenderRetryTimer = 0;
    state.turnstileRenderRetryCount += 1;
    updateLoginChallengeUi();
  }, 250);
}

function userHasAdminRole(user = state.user) {
  if (!user || typeof user !== "object") {
    return false;
  }

  const directFlags = [user.isAdmin, user.is_admin, user.admin];
  if (directFlags.some((value) => value === true)) {
    return true;
  }

  const roleValues = [
    user.role,
    user.userRole,
    user.accessRole,
    user.accountType,
    user.type,
  ]
    .map((value) =>
      String(value ?? "")
        .trim()
        .toLowerCase(),
    )
    .filter(Boolean);

  if (
    roleValues.some((value) => value === "admin" || value === "administrator")
  ) {
    return true;
  }

  const collections = [
    user.roles,
    user.permissions,
    user.groups,
    user.accessGroups,
  ];
  return collections.some(
    (collection) =>
      Array.isArray(collection) &&
      collection.some((value) => {
        const normalized = String(value ?? "")
          .trim()
          .toLowerCase();
        return normalized === "admin" || normalized === "administrator";
      }),
  );
}

function hasAdminPanelAccess() {
  return (
    state.authenticated &&
    (state.adminPasskeySetupRequired || userHasAdminRole())
  );
}

function passkeySetupGateVisible() {
  return state.authenticated && state.adminPasskeySetupRequired;
}

function interactionGateVisible() {
  return passwordGateVisible() || passkeySetupGateVisible();
}

function resolveCurrentPageFromLocation() {
  const hash = String(window.location.hash ?? "")
    .trim()
    .toLowerCase();
  const hashPath = hash.split("?")[0] ?? "";
  if (
    hashPath === "" ||
    hashPath === "#/" ||
    hashPath === DASHBOARD_HASH ||
    hashPath === "#home"
  ) {
    return "dashboard";
  }

  if (hashPath === ONBOARDING_HASH || hashPath === "#onboarding") {
    return "onboarding";
  }

  if (hashPath === FAQ_HASH || hashPath === "#faq") {
    return "faq";
  }

  if (hashPath === DOCS_HASH || hashPath === "#docs") {
    return "docs";
  }

  return "dashboard";
}

function updateDocumentTitle() {
  if (portalView.currentPage === "docs") {
    document.title = "autosteerplus docs";
    return;
  }

  if (portalView.currentPage === "onboarding") {
    document.title = "autosteerplus onboarding";
    return;
  }

  if (portalView.currentPage === "faq") {
    document.title = "autosteerplus faq";
    return;
  }

  document.title = "autosteerplus";
}

function syncPageFromLocation() {
  const currentHash = String(window.location.hash ?? "")
    .trim()
    .toLowerCase();
  const currentHashPath = currentHash.split("?")[0] ?? "";
  if (
    currentHashPath === "" ||
    currentHashPath === "#/" ||
    currentHashPath === "#home"
  ) {
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}${DASHBOARD_HASH}`,
    );
  }

  portalView.currentPage = resolveCurrentPageFromLocation();
  updateDocumentTitle();
}

function navigateToDocsSection(sectionId) {
  const nextHash = `${DOCS_HASH}?section=${encodeURIComponent(sectionId)}`;
  if (window.location.hash !== nextHash) {
    window.location.hash = nextHash;
    return;
  }

  syncPageFromLocation();
}

function navigateToPage(page) {
  const nextHash =
    page === "docs"
      ? DOCS_HASH
      : page === "onboarding"
        ? ONBOARDING_HASH
        : page === "faq"
          ? FAQ_HASH
          : DASHBOARD_HASH;
  if (window.location.hash !== nextHash) {
    window.location.hash = nextHash;
    return;
  }

  syncPageFromLocation();
}

function readStoredAdvancedMode() {
  try {
    return window.localStorage.getItem(ADVANCED_MODE_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function setAdvancedMode(enabled) {
  portalView.advancedMode = Boolean(enabled);

  try {
    window.localStorage.setItem(
      ADVANCED_MODE_STORAGE_KEY,
      portalView.advancedMode ? "1" : "0",
    );
  } catch {
    // Ignore storage failures and keep the in-memory state.
  }
}

function updatePortalControls() {
  const blockedByInteraction = !state.authenticated || interactionGateVisible();
  const isAdmin = hasAdminPanelAccess() && !state.adminPasskeySetupRequired;

  portalView.connectDisabled = blockedByInteraction || state.connected;
  portalView.disconnectDisabled = !state.connected || passwordGateVisible();
  portalView.refreshDisabled = !state.connected || passwordGateVisible();
  portalView.rebootDisabled =
    !state.connected || state.updating || passwordGateVisible();
  portalView.hooksDisabled =
    !state.connected || state.updating || passwordGateVisible();
  portalView.abortOtaDisabled =
    !state.connected || !state.updating || passwordGateVisible();
  portalView.connectionLabel = state.connected ? "Connected" : "Disconnected";
  portalView.connectionOnline = state.connected;
  portalView.configNote = state.connected
    ? "Changes are written to preferences immediately."
    : "Connect to the device before editing persistent settings.";
  portalView.shopifySyncDisabled = !isAdmin || state.syncingCustomers;
  portalView.reloadPackagesDisabled = !isAdmin || packageActionInProgress();
  portalView.reloadCustomersDisabled =
    !isAdmin || state.loadingCustomers || customerActionInProgress();
  portalView.reloadPasskeysDisabled =
    !state.authenticated ||
    state.loadingPasskeys ||
    state.deletingPasskeyId !== 0;
  portalView.registerPasskeyDisabled = !state.authenticated;
  portalView.adminRegisterPasskeyDisabled = !state.authenticated;
}

function updateAuthUi() {
  const authenticated = state.authenticated;
  const passwordGateShown = passwordGateVisible();
  const passwordRequiresCurrent = passwordGateRequiresCurrentPassword();
  const isAdmin = hasAdminPanelAccess() && !state.adminPasskeySetupRequired;

  portalView.authenticated = authenticated;
  portalView.showLogoutButton = authenticated;
  portalView.showChangePasswordButton = authenticated;
  portalView.passwordGateVisible = passwordGateShown;
  portalView.passwordGateRequiresCurrent = passwordRequiresCurrent;
  portalView.passkeySetupVisible = passkeySetupGateVisible();
  portalView.adminVisible = authenticated && isAdmin;
  portalView.adminCreateUserDisabled = !isAdmin || state.creatingCustomer;

  if (passwordGateShown) {
    portalView.passwordGateNote = state.mustChangePassword
      ? `Your temporary password must be replaced before you can use the portal. Use at least ${PASSWORD_MIN_LENGTH} characters.`
      : "Enter your current password, then choose a new password with at least 15 characters.";
  } else if (portalView.passwordGateNote === "") {
    portalView.passwordGateNote = defaultPasswordGateNote();
  }

  if (!isAdmin) {
    state.deletingPackageId = "";
    state.savingPackageGroupsId = "";
    state.creatingCustomer = false;
    state.updatingCustomerId = 0;
    state.savingCustomerGroupsId = 0;
    state.deletingCustomerId = 0;
  }

  updatePortalControls();
  renderPasskeys();
}

function setLoginFeedback(message = "") {
  portalView.loginFeedback = message;
}

function base64UrlToUint8Array(value) {
  const normalized = String(value ?? "")
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const padding =
    normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  const raw = window.atob(normalized + padding);
  const bytes = new Uint8Array(raw.length);
  for (let index = 0; index < raw.length; index += 1) {
    bytes[index] = raw.charCodeAt(index);
  }
  return bytes;
}

function uint8ArrayToBase64Url(bytes) {
  let value = "";
  for (const byte of bytes) {
    value += String.fromCharCode(byte);
  }
  return window
    .btoa(value)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function ensureTurnstileRendered() {
  if (!state.turnstileConfigured || !dom.loginChallengeWidget) {
    return;
  }
  if (state.turnstileWidgetId) {
    clearTurnstileRenderRetry();
    return;
  }
  if (typeof window.turnstile?.render !== "function") {
    portalView.loginChallengeNote = "Loading the security check...";
    scheduleTurnstileRenderRetry();
    return;
  }

  try {
    state.turnstileWidgetId = window.turnstile.render(
      dom.loginChallengeWidget,
      {
        sitekey: readTurnstileSiteKey(),
        callback: (token) => {
          state.turnstileToken = token;
          portalView.loginChallengeNote =
            "Complete the security check to continue signing in.";
        },
        "expired-callback": () => {
          state.turnstileToken = "";
        },
        "error-callback": () => {
          state.turnstileToken = "";
          portalView.loginChallengeNote =
            "The security check failed to load. Reload the page and try again.";
        },
      },
    );
    clearTurnstileRenderRetry();
    state.turnstileRenderRetryCount = 0;
    portalView.loginChallengeNote =
      "Complete the security check to continue signing in.";
  } catch (error) {
    portalView.loginChallengeNote = "Loading the security check...";
    scheduleTurnstileRenderRetry();
  }
}

function resetTurnstile() {
  clearTurnstileRenderRetry();
  state.turnstileRenderRetryCount = 0;
  state.turnstileToken = "";
  if (
    state.turnstileWidgetId &&
    typeof window.turnstile?.reset === "function"
  ) {
    window.turnstile.reset(state.turnstileWidgetId);
  }
}

function log(message, level = "info") {
  const stamp = new Date().toLocaleTimeString();
  const prefix = level === "error" ? "ERR" : level === "warn" ? "WRN" : "INF";
  portalView.eventLogText =
    `[${stamp}] ${prefix} ${message}\n${portalView.eventLogText}`.trim();
}

function customerActionInProgress() {
  return (
    state.creatingCustomer ||
    state.updatingCustomerId !== 0 ||
    state.savingCustomerGroupsId !== 0 ||
    state.deletingCustomerId !== 0
  );
}

function packageActionInProgress() {
  return (
    Boolean(state.deletingPackageId) ||
    Boolean(state.savingPackageGroupsId) ||
    state.updating
  );
}

function accessGroupsInputValue(groups) {
  return Array.isArray(groups) ? groups.join(", ") : "";
}

function accessGroupsSummary(groups, emptyLabel) {
  return Array.isArray(groups) && groups.length > 0
    ? groups.join(", ")
    : emptyLabel;
}

function passwordGateVisible() {
  return (
    state.authenticated &&
    (state.mustChangePassword || state.passwordDialogOpen)
  );
}

function passwordGateRequiresCurrentPassword() {
  return passwordGateVisible() && !state.mustChangePassword;
}

function passwordValidationMessage(password, email = "") {
  const value = String(password ?? "");
  const normalizedEmail = String(email ?? "")
    .trim()
    .toLowerCase();

  if (value.length === 0) {
    return `Use at least ${PASSWORD_MIN_LENGTH} characters. A passphrase with several unrelated words is fine.`;
  }

  if (/^\d{4}$/.test(value)) {
    return "Too weak: a 4-digit code is only a temporary password. Use a longer passphrase.";
  }

  if (value.length < PASSWORD_MIN_LENGTH) {
    return `Too weak: ${value.length}/${PASSWORD_MIN_LENGTH} characters. Make it longer.`;
  }

  if (/^(.)\1{7,}$/s.test(value)) {
    return "Too weak: do not use the same character repeated.";
  }

  const localPart = normalizedEmail.split("@")[0] || "";
  if (localPart.length >= 3 && value.toLowerCase().includes(localPart)) {
    return "Too weak: do not include your email address in the password.";
  }

  return "";
}

function updatePasswordGateValidation() {
  const currentPassword = portalView.passwordCurrent;
  const password = portalView.passwordNew;
  const confirmPassword = portalView.passwordConfirm;
  const validationMessage = passwordValidationMessage(
    password,
    state.user?.email ?? "",
  );

  if (passwordGateRequiresCurrentPassword() && currentPassword.length === 0) {
    portalView.passwordGateNote =
      "Enter your current password, then choose a new password with at least 15 characters.";
    return false;
  }

  if (validationMessage !== "") {
    portalView.passwordGateNote = validationMessage;
    return false;
  }

  if (confirmPassword !== "" && password !== confirmPassword) {
    portalView.passwordGateNote = "The new password entries do not match yet.";
    return false;
  }

  portalView.passwordGateNote = passwordGateRequiresCurrentPassword()
    ? "Password looks strong enough. Submit to change it."
    : "Password looks strong enough. Submit to continue.";
  return true;
}

function openPasswordDialog() {
  state.passwordDialogOpen = true;
  portalView.passwordCurrent = "";
  portalView.passwordNew = "";
  portalView.passwordConfirm = "";
  portalView.passwordGateNote = defaultPasswordGateNote();
  updateAuthUi();
}

function closePasswordDialog() {
  if (state.mustChangePassword) {
    return;
  }

  state.passwordDialogOpen = false;
  portalView.passwordCurrent = "";
  portalView.passwordNew = "";
  portalView.passwordConfirm = "";
  portalView.passwordGateNote = defaultPasswordGateNote();
  updateAuthUi();
}

function deviceRequiresSecureOta(status = state.lastStatus) {
  return Boolean(
    status?.otaSecureMode ||
    status?.otaMetadataRequired ||
    status?.otaMetadataLoaded ||
    status?.otaEncryptedRequired,
  );
}

function visiblePackagesForCurrentDevice() {
  if (!state.connected) {
    return state.packages;
  }

  if (!state.lastStatus) {
    return [];
  }

  const secureDevice = deviceRequiresSecureOta();
  return state.packages.filter((pkg) =>
    secureDevice ? pkg.secureOta : !pkg.secureOta,
  );
}

function formatBytes(byteCount) {
  if (!Number.isFinite(byteCount) || byteCount < 0) {
    return "-";
  }

  if (byteCount < 1024) {
    return `${byteCount} B`;
  }

  const units = ["KB", "MB", "GB"];
  let value = byteCount / 1024;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(value >= 100 ? 0 : 1)} ${units[unitIndex]}`;
}

function formatTimestamp(timestamp) {
  const value = new Date(timestamp);
  if (Number.isNaN(value.getTime())) {
    return timestamp || "-";
  }

  return value.toLocaleString();
}

function renderPackages() {
  updatePortalControls();
  portalView.installPackages = [];

  if (!state.authenticated) {
    portalView.packageNote = "Sign in to view your approved firmware packages.";
    return;
  }

  if (state.mustChangePassword) {
    portalView.packageNote =
      "Update your temporary password before using device controls or installing firmware.";
    return;
  }

  if (state.adminPasskeySetupRequired) {
    portalView.packageNote =
      "Register your admin passkey before using device controls or installing firmware.";
    return;
  }

  if (!state.connected) {
    portalView.packageNote =
      "Connect to your device to load compatible firmware packages.";
    return;
  }

  if (state.packages.length === 0) {
    portalView.packageNote =
      "No firmware packages are available for this account right now.";
    return;
  }

  const visiblePackages = visiblePackagesForCurrentDevice();
  if (visiblePackages.length === 0) {
    if (state.connected) {
      portalView.packageNote = state.lastStatus
        ? deviceRequiresSecureOta()
          ? "No secure firmware packages are available for this device right now."
          : "No bootstrap firmware packages are available for this device right now."
        : "Reading device compatibility before showing available firmware.";
    }
    return;
  }

  portalView.packageNote =
    "Showing firmware packages compatible with the connected device.";
  portalView.installPackages = visiblePackages.map((pkg) => ({
    id: pkg.id,
    label: pkg.label,
    disabled: !state.connected || state.updating,
  }));
}

function renderAdminPackages() {
  updatePortalControls();
  const isAdmin = hasAdminPanelAccess();
  if (!isAdmin) {
    portalView.adminPackagesNote = "";
    portalView.adminPackages = [];
    return;
  }

  if (state.packages.length === 0) {
    portalView.adminPackagesNote =
      "No firmware packages are currently imported.";
    portalView.adminPackages = [];
    return;
  }

  const totalPackages = state.packages.length;
  const securePackages = state.packages.filter((pkg) => pkg.secureOta).length;
  const bootstrapPackages = totalPackages - securePackages;
  const restrictedPackages = state.packages.filter(
    (pkg) => Array.isArray(pkg.accessGroups) && pkg.accessGroups.length > 0,
  ).length;
  portalView.adminPackagesNote =
    `${totalPackages} package${totalPackages === 1 ? "" : "s"} loaded. ` +
    `${securePackages} secure, ${bootstrapPackages} bootstrap, ${restrictedPackages} restricted by group.`;

  portalView.adminPackages = state.packages.map((pkg) => {
    const currentView = portalView.adminPackages.find(
      (entry) => entry.id === pkg.id,
    );
    const savingGroups = state.savingPackageGroupsId === pkg.id;
    return {
      id: pkg.id,
      label: pkg.label,
      primaryMeta: `${pkg.id} • ${pkg.firmwareVersion} • ${pkg.secureOta ? "Secure OTA" : "Bootstrap OTA"}`,
      secondaryMeta: `${formatBytes(pkg.size)} • Added ${formatTimestamp(pkg.createdAt)}`,
      audienceMeta: `Access groups: ${accessGroupsSummary(pkg.accessGroups, "All customers")}`,
      accessGroupsInput:
        currentView?.accessGroupsInput ??
        accessGroupsInputValue(pkg.accessGroups),
      saveGroupsLabel: savingGroups ? "Saving..." : "Save Groups",
      saveGroupsDisabled: packageActionInProgress(),
      deleteLabel:
        state.deletingPackageId === pkg.id ? "Deleting..." : "Delete",
      deleteDisabled: packageActionInProgress(),
    };
  });
}

function customerSourceLabel(customer) {
  return customer.provisionSource === "shopify" ? "Shopify" : "Manual";
}

function customerStatusLabel(customer) {
  switch (customer.accessState) {
    case "locked":
      return "Locked";
    case "disabled":
      return "Disabled";
    default:
      return "Active";
  }
}

function customerStatusTone(customer) {
  switch (customer.accessState) {
    case "locked":
      return "locked";
    case "disabled":
      return "disabled";
    default:
      return "active";
  }
}

function renderAdminUsers() {
  updatePortalControls();
  const isAdmin = hasAdminPanelAccess();
  if (!isAdmin) {
    portalView.adminCustomersNote = "";
    portalView.adminCustomers = [];
    return;
  }

  if (state.loadingCustomers && state.customers.length === 0) {
    portalView.adminCustomersNote = "Loading customer accounts...";
    portalView.adminCustomers = [];
    return;
  }

  if (state.customers.length === 0) {
    portalView.adminCustomersNote =
      "No customer accounts are currently provisioned.";
    portalView.adminCustomers = [];
    return;
  }

  const activeCount = state.customers.filter(
    (customer) => customer.accessState === "active",
  ).length;
  const lockedCount = state.customers.filter(
    (customer) => customer.accessState === "locked",
  ).length;
  const disabledCount = state.customers.filter(
    (customer) => customer.accessState === "disabled",
  ).length;
  portalView.adminCustomersNote =
    `${state.customers.length} customer account${state.customers.length === 1 ? "" : "s"} loaded. ` +
    `${activeCount} active, ${lockedCount} locked, ${disabledCount} disabled.`;

  portalView.adminCustomers = state.customers.map((customer) => {
    const currentView = portalView.adminCustomers.find(
      (entry) => entry.id === customer.id,
    );
    const detailParts = [];
    const enabling = customer.accessState !== "active";
    detailParts.push(
      `Access groups: ${accessGroupsSummary(customer.accessGroups, "None")}`,
    );
    if (customer.mustChangePassword) {
      detailParts.push("Password change required");
    }
    if (customer.sourceOrderName) {
      detailParts.push(customer.sourceOrderName);
    }
    if (customer.sourceSyncedAt) {
      detailParts.push(`Synced ${formatTimestamp(customer.sourceSyncedAt)}`);
    } else if (customer.createdAt) {
      detailParts.push(`Created ${formatTimestamp(customer.createdAt)}`);
    }
    const orderLabel = customer.sourceOrderNumber
      ? ` • Order ${customer.sourceOrderNumber}`
      : "";
    return {
      id: customer.id,
      email: customer.email,
      statusLabel: customerStatusLabel(customer),
      statusTone: customerStatusTone(customer),
      primaryMeta: `${customerSourceLabel(customer)}${orderLabel}`,
      secondaryMeta:
        detailParts.length > 0
          ? detailParts.join(" • ")
          : "No Shopify order metadata",
      accessGroupsInput:
        currentView?.accessGroupsInput ??
        accessGroupsInputValue(customer.accessGroups),
      saveGroupsLabel:
        state.savingCustomerGroupsId === customer.id
          ? "Saving..."
          : "Save Groups",
      saveGroupsDisabled: customerActionInProgress(),
      toggleLabel:
        state.updatingCustomerId === customer.id
          ? enabling
            ? "Enabling..."
            : "Disabling..."
          : enabling
            ? "Enable"
            : "Disable",
      toggleVariant: enabling ? "secondary" : "danger",
      toggleDisabled: customerActionInProgress(),
      deleteLabel:
        state.deletingCustomerId === customer.id ? "Deleting..." : "Delete",
      deleteDisabled: customerActionInProgress(),
    };
  });
}

function renderPasskeys() {
  updatePortalControls();
  if (!state.authenticated) {
    portalView.passkeyNote = "Sign in to manage passkeys.";
    portalView.passkeys = [];
    return;
  }

  if (state.loadingPasskeys) {
    portalView.passkeyNote = "Loading passkeys...";
    portalView.passkeys = [];
    return;
  }

  if (state.passkeys.length === 0) {
    portalView.passkeyNote = state.adminPasskeySetupRequired
      ? "Register your first admin passkey to continue."
      : "No passkeys are registered on this account yet.";
    portalView.passkeys = [];
    return;
  }

  portalView.passkeyNote = `${state.passkeys.length} passkey${state.passkeys.length === 1 ? "" : "s"} registered on this account.`;

  portalView.passkeys = state.passkeys.map((passkey) => ({
    id: passkey.id,
    title: passkey.label || "Passkey",
    primaryMeta:
      passkey.transports?.length > 0
        ? passkey.transports.join(" • ")
        : "Platform or roaming authenticator",
    secondaryMeta: passkey.lastUsedAt
      ? `Last used ${formatTimestamp(passkey.lastUsedAt)}`
      : `Registered ${formatTimestamp(passkey.createdAt)}`,
    deleteLabel:
      state.deletingPasskeyId === passkey.id ? "Removing..." : "Remove",
    deleteDisabled: state.deletingPasskeyId !== 0,
  }));
}

function renderPackageViews() {
  renderPackages();
  renderAdminUsers();
  renderAdminPackages();
  renderPasskeys();
}

function setConnectionState(connected) {
  state.connected = connected;
  updatePortalControls();
  renderPackageViews();
}

function setUpdatingState(updating) {
  state.updating = updating;
  if (!updating) {
    state.pendingFirmware = null;
  }
  updatePortalControls();

  if (updating) {
    stopStatusPolling();
  } else if (state.connected) {
    startStatusPolling();
  }

  renderPackageViews();
}

function setProgress(current, total, label) {
  const safeTotal = total > 0 ? total : 1;
  const percent = Math.min(100, Math.max(0, (current / safeTotal) * 100));
  portalView.progressPercent = Number(percent.toFixed(1));
  portalView.progressPercentText = `${percent.toFixed(1)}%`;
  portalView.progressLabel = label;
}

function resetStatusDisplay() {
  state.lastStatus = null;
  state.lastConfig = null;
  portalView.deviceName = "Not connected";
  portalView.firmwareVersion = "-";
  portalView.canState = "-";
  portalView.hooksState = "-";
  portalView.profileState = "-";
  portalView.speedOffsetState = "-";
  portalView.fsdFlagState = "-";
  portalView.otaState = "Idle";
  portalView.hooksEnabled = false;
}

function updateStatusUi(status) {
  if (!status) {
    return;
  }

  const previousSecureMode =
    state.lastStatus === null ? null : deviceRequiresSecureOta();
  state.lastStatus = status;
  portalView.deviceName = status.deviceName ?? "Unknown";
  portalView.firmwareVersion = status.firmwareVersion ?? "-";
  portalView.canState = status.canOnline
    ? `Online • ${status.canRxAgeMs ?? 0} ms ago`
    : "No recent frames";
  portalView.hooksState = status.canHooksEnabled ? "Enabled" : "Disabled";
  portalView.profileState = status.profile ?? "-";
  portalView.speedOffsetState = `${status.speedOffsetPercent ?? 0}%`;
  portalView.fsdFlagState = status.fsdFlag ? "Set" : "Clear";

  let otaState = "Idle";
  if (status.otaInProgress) {
    otaState = `Receiving ${status.otaBytesWritten ?? 0}/${status.otaExpectedSize ?? 0} bytes`;
  } else if (status.otaLastError) {
    otaState = `Idle • ${status.otaLastError}`;
  }

  if (status.otaSecureMode) {
    otaState += status.otaMetadataLoaded
      ? " • secure metadata ready"
      : " • secure OTA";
  }

  portalView.otaState = otaState;

  if (!state.updating) {
    portalView.hooksEnabled = Boolean(status.canHooksEnabled);
  }

  const currentSecureMode = deviceRequiresSecureOta();
  if (previousSecureMode === null || previousSecureMode !== currentSecureMode) {
    renderPackageViews();
  }
}

function updateConfigUi(config) {
  if (!config) {
    return;
  }

  state.lastConfig = config;
  if (!state.updating) {
    portalView.hooksEnabled = Boolean(config.canHooksEnabled);
  }
}

async function parseApiError(response) {
  try {
    const text = await response.text();
    const payload = JSON.parse(text);
    return payload.message || payload.error || `HTTP ${response.status}`;
  } catch {
    return `HTTP ${response.status}`;
  }
}

async function apiFetch(path, options = {}) {
  const {
    method = "GET",
    body = null,
    headers = {},
    requireCsrf = false,
  } = options;

  const requestHeaders = new Headers(headers);

  if (requireCsrf) {
    const csrfToken = readCsrfToken();
    if (!csrfToken) {
      throw new Error(
        "CSRF token is unavailable. Reload the page and try again.",
      );
    }
    requestHeaders.set("X-CSRF-Token", csrfToken);
  }

  const response = await fetch(path, {
    method,
    body,
    headers: requestHeaders,
    credentials: "same-origin",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response;
}

async function apiJson(path, options = {}) {
  const response = await apiFetch(path, options);
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    const snippet = text.trim().replace(/\s+/g, " ").slice(0, 240);
    throw new Error(
      snippet
        ? `Server returned invalid JSON: ${snippet}`
        : "Server returned invalid JSON",
    );
  }
}

async function loadSession() {
  const session = await apiJson("./api/session.php");
  state.authenticated = Boolean(session.authenticated);
  state.user = session.user ?? null;
  state.mustChangePassword = Boolean(session.mustChangePassword);
  state.adminPasskeySetupRequired = Boolean(session.adminPasskeySetupRequired);
  state.turnstileConfigured = Boolean(
    session.turnstileConfigured || readTurnstileSiteKey(),
  );
  state.loginChallengeRequired = false;
  state.passwordDialogOpen = false;
  portalView.passkeySetupNote = defaultPasskeySetupNote();
  updateAuthUi();

  if (!session.hasUsers) {
    portalView.authNote =
      "Access is not available at the moment. Please contact support.";
  } else {
    portalView.authNote = defaultAuthNote();
  }
  setLoginFeedback("");
  updateLoginChallengeUi();

  if (state.authenticated) {
    if (hasAdminPanelAccess() && !state.adminPasskeySetupRequired) {
      await Promise.all([loadPackages(), loadAdminUsers()]);
    } else {
      state.customers = [];
      state.packages = [];
      renderPackageViews();
    }
    await loadPasskeys().catch(() => null);
  } else {
    state.packages = [];
    state.customers = [];
    state.passkeys = [];
    renderPackageViews();
    if (state.connected) {
      await disconnect();
    }
  }
}

function updateLoginChallengeUi() {
  const visible = state.turnstileConfigured && state.loginChallengeRequired;
  portalView.loginChallengeVisible = visible;
  if (visible) {
    portalView.loginChallengeNote =
      "Complete the security check to continue signing in.";
    ensureTurnstileRendered();
    return;
  }

  resetTurnstile();
}

async function login(email, password) {
  const response = await fetch("./api/login.php", {
    method: "POST",
    credentials: "same-origin",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": readCsrfToken(),
    },
    body: JSON.stringify({
      email,
      password,
      botToken: state.turnstileToken,
    }),
  });
  const text = await response.text();
  let payload = {};
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("Server returned invalid login response.");
  }
  state.loginChallengeRequired = Boolean(payload.challengeRequired);
  updateLoginChallengeUi();

  if (!response.ok) {
    const error = new Error(
      payload.message || payload.error || `HTTP ${response.status}`,
    );
    error.payload = payload;
    error.status = response.status;
    throw error;
  }

  portalView.loginEmail = "";
  portalView.loginPassword = "";
  setLoginFeedback("");
  resetTurnstile();
  if (payload.passkeyRequired) {
    await signInWithPasskey(email, true);
    return;
  }
  if (payload.authenticated) {
    window.location.replace("./");
    return;
  }
}

async function logout() {
  if (state.connected) {
    await disconnect();
  }

  await apiJson("./api/logout.php", {
    method: "POST",
    requireCsrf: true,
  });

  resetTurnstile();
  window.location.replace("./");
}

async function loadPackages() {
  if (!state.authenticated) {
    state.packages = [];
    renderPackageViews();
    return;
  }

  if (!hasAdminPanelAccess() && !state.connected) {
    state.packages = [];
    renderPackageViews();
    return;
  }

  const payload = await apiJson("./api/packages.php");
  state.packages = Array.isArray(payload.packages) ? payload.packages : [];
  renderPackageViews();
}

function normalizePublicKeyCreationOptions(options) {
  return {
    ...options,
    challenge: base64UrlToUint8Array(options.challenge),
    user: {
      ...options.user,
      id: base64UrlToUint8Array(options.user.id),
    },
    excludeCredentials: Array.isArray(options.excludeCredentials)
      ? options.excludeCredentials.map((credential) => ({
          ...credential,
          id: base64UrlToUint8Array(credential.id),
        }))
      : [],
  };
}

function normalizePublicKeyRequestOptions(options) {
  return {
    ...options,
    challenge: base64UrlToUint8Array(options.challenge),
    allowCredentials: Array.isArray(options.allowCredentials)
      ? options.allowCredentials.map((credential) => ({
          ...credential,
          id: base64UrlToUint8Array(credential.id),
        }))
      : [],
  };
}

function serializePublicKeyCredential(credential) {
  const response = credential.response;
  const payload = {
    id: credential.id,
    type: credential.type,
    response: {
      clientDataJSON: uint8ArrayToBase64Url(
        new Uint8Array(response.clientDataJSON),
      ),
    },
  };

  if (response.attestationObject) {
    payload.response.attestationObject = uint8ArrayToBase64Url(
      new Uint8Array(response.attestationObject),
    );
  }
  if (response.authenticatorData) {
    payload.response.authenticatorData = uint8ArrayToBase64Url(
      new Uint8Array(response.authenticatorData),
    );
  }
  if (response.signature) {
    payload.response.signature = uint8ArrayToBase64Url(
      new Uint8Array(response.signature),
    );
  }
  if (response.userHandle) {
    payload.response.userHandle = uint8ArrayToBase64Url(
      new Uint8Array(response.userHandle),
    );
  }
  if (typeof response.getTransports === "function") {
    payload.response.transports = response.getTransports();
  }

  return payload;
}

async function loadPasskeys() {
  if (!state.authenticated) {
    state.passkeys = [];
    renderPasskeys();
    return;
  }

  state.loadingPasskeys = true;
  renderPasskeys();

  try {
    const payload = await apiJson("./api/passkeys.php");
    state.passkeys = Array.isArray(payload.passkeys) ? payload.passkeys : [];
    state.adminPasskeySetupRequired = Boolean(
      payload.adminPasskeySetupRequired,
    );
    return payload;
  } finally {
    state.loadingPasskeys = false;
    renderPasskeys();
    updateAuthUi();
  }
}

async function registerPasskey() {
  if (!state.authenticated) {
    throw new Error("Sign in before registering a passkey");
  }
  if (!window.PublicKeyCredential || !navigator.credentials?.create) {
    throw new Error("Passkeys are not available in this browser.");
  }

  const { options } = await apiJson("./api/passkey-register-options.php", {
    method: "POST",
    requireCsrf: true,
  });
  const credential = await navigator.credentials.create({
    publicKey: normalizePublicKeyCreationOptions(options),
  });
  if (!credential) {
    throw new Error("Passkey registration was cancelled.");
  }

  const payload = await apiJson("./api/passkey-register-verify.php", {
    method: "POST",
    body: JSON.stringify({
      ...serializePublicKeyCredential(credential),
      label: window.navigator.platform
        ? `${window.navigator.platform} Passkey`
        : "Passkey",
    }),
    headers: { "Content-Type": "application/json" },
    requireCsrf: true,
  });

  const requiredBefore = state.adminPasskeySetupRequired;
  state.adminPasskeySetupRequired = Boolean(payload.adminPasskeySetupRequired);
  await loadPasskeys();
  log("Passkey registered");
  if (requiredBefore && !state.adminPasskeySetupRequired) {
    window.location.replace("./");
  }
}

async function deletePasskey(passkey) {
  if (!window.confirm(`Remove passkey "${passkey.label || "Passkey"}"?`)) {
    return;
  }

  state.deletingPasskeyId = passkey.id;
  renderPasskeys();

  try {
    const payload = await apiJson("./api/passkey-delete.php", {
      method: "POST",
      body: JSON.stringify({ passkeyId: passkey.id }),
      headers: { "Content-Type": "application/json" },
      requireCsrf: true,
    });
    state.passkeys = Array.isArray(payload.passkeys) ? payload.passkeys : [];
    log(`Removed passkey ${passkey.label || "Passkey"}`);
  } finally {
    state.deletingPasskeyId = 0;
    renderPasskeys();
  }
}

async function signInWithPasskey(email = "", promptedByLogin = false) {
  if (!window.PublicKeyCredential || !navigator.credentials?.get) {
    throw new Error("Passkeys are not available in this browser.");
  }

  const normalizedEmail = String(email ?? "").trim();
  if (!promptedByLogin && normalizedEmail === "") {
    throw new Error("Enter your account email before using a passkey.");
  }

  const optionsPayload = await apiJson("./api/passkey-auth-options.php", {
    method: "POST",
    body: JSON.stringify(
      normalizedEmail === "" ? {} : { email: normalizedEmail },
    ),
    headers: { "Content-Type": "application/json" },
    requireCsrf: true,
  });
  const credential = await navigator.credentials.get({
    publicKey: normalizePublicKeyRequestOptions(optionsPayload.options),
  });
  if (!credential) {
    throw new Error("Passkey sign-in was cancelled.");
  }

  const verificationPayload = await apiJson("./api/passkey-auth-verify.php", {
    method: "POST",
    body: JSON.stringify(serializePublicKeyCredential(credential)),
    headers: { "Content-Type": "application/json" },
    requireCsrf: true,
  });

  if (verificationPayload.authenticated) {
    window.location.replace("./");
  }
}

async function loadAdminUsers() {
  if (!hasAdminPanelAccess()) {
    state.customers = [];
    portalView.adminCreateUserResult = "";
    renderPackageViews();
    return;
  }

  state.loadingCustomers = true;
  renderAdminUsers();

  try {
    const payload = await apiJson("./api/admin-users.php");
    state.customers = Array.isArray(payload.users) ? payload.users : [];
    return payload;
  } finally {
    state.loadingCustomers = false;
    renderPackageViews();
  }
}

async function syncShopifyCustomers() {
  if (!hasAdminPanelAccess()) {
    throw new Error("Admin access is required");
  }

  state.syncingCustomers = true;
  portalView.shopifySyncResult = "Refreshing Shopify customer eligibility...";
  updatePortalControls();

  try {
    const payload = await apiJson("./api/admin-sync-shopify-customers.php", {
      method: "POST",
      requireCsrf: true,
    });

    const summary = [
      `Orders scanned: ${payload.ordersScanned ?? 0}`,
      `Orders skipped: ${payload.ordersSkipped ?? 0}`,
      `Eligible customers: ${payload.eligible ?? 0}`,
      `Inserted: ${payload.inserted ?? 0}`,
      `Skipped existing: ${payload.skippedExisting ?? 0}`,
      `Skipped blocked: ${payload.skippedBlocked ?? 0}`,
      `Invalid: ${payload.invalid ?? 0}`,
      `Duplicate orders merged: ${payload.duplicatesMerged ?? 0}`,
    ];

    const details = Array.isArray(payload.details)
      ? payload.details.slice(0, 40).map((detail) => {
          const orderNumber = detail.orderNumber
            ? `order ${detail.orderNumber}`
            : "no order";
          const criteria =
            Array.isArray(detail.criteria) && detail.criteria.length > 0
              ? ` • ${detail.criteria.join(", ")}`
              : "";
          return `${detail.status}: ${detail.email ?? ""} • ${orderNumber}${criteria}`.trim();
        })
      : [];

    portalView.shopifySyncResult = [...summary, ...details].join("\n");

    await loadAdminUsers();
    return payload;
  } catch (error) {
    portalView.shopifySyncResult = `Refresh failed: ${error.message}`;
    throw error;
  } finally {
    state.syncingCustomers = false;
    updatePortalControls();
  }
}

async function setCustomerActive(customer, isActive) {
  if (!hasAdminPanelAccess()) {
    throw new Error("Admin access is required");
  }

  const confirmed = window.confirm(
    `${isActive ? "Enable" : "Disable"} customer account "${customer.email}"?\n\n` +
      `${isActive ? "This will allow the customer to sign in again." : "This will block sign-in and keep the account excluded from Shopify re-imports."}`,
  );
  if (!confirmed) {
    return;
  }

  state.updatingCustomerId = customer.id;
  renderAdminUsers();

  try {
    const payload = await apiJson("./api/admin-set-user-active.php", {
      method: "POST",
      body: JSON.stringify({ userId: customer.id, isActive }),
      headers: { "Content-Type": "application/json" },
      requireCsrf: true,
    });

    const updatedCustomer = payload.user ?? null;
    if (updatedCustomer && typeof updatedCustomer.id === "number") {
      state.customers = state.customers.map((entry) =>
        entry.id === updatedCustomer.id ? updatedCustomer : entry,
      );
    }

    log(
      `${isActive ? "Enabled" : "Disabled"} customer account ${customer.email}`,
    );
  } finally {
    state.updatingCustomerId = 0;
    renderAdminUsers();
  }
}

async function saveCustomerGroups(customer, accessGroups) {
  if (!hasAdminPanelAccess()) {
    throw new Error("Admin access is required");
  }

  state.savingCustomerGroupsId = customer.id;
  renderAdminUsers();

  try {
    const payload = await apiJson("./api/admin-set-user-groups.php", {
      method: "POST",
      body: JSON.stringify({ userId: customer.id, accessGroups }),
      headers: { "Content-Type": "application/json" },
      requireCsrf: true,
    });

    const updatedCustomer = payload.user ?? null;
    if (updatedCustomer && typeof updatedCustomer.id === "number") {
      state.customers = state.customers.map((entry) =>
        entry.id === updatedCustomer.id ? updatedCustomer : entry,
      );
    }

    log(
      `Saved access groups for ${customer.email}: ${accessGroupsSummary(updatedCustomer?.accessGroups, "none")}`,
    );
    return payload;
  } finally {
    state.savingCustomerGroupsId = 0;
    renderAdminUsers();
  }
}

async function createCustomer(email, password, accessGroups) {
  if (!hasAdminPanelAccess()) {
    throw new Error("Admin access is required");
  }

  state.creatingCustomer = true;
  updateAuthUi();
  portalView.adminCreateUserResult = "Creating customer account...";

  try {
    const payload = await apiJson("./api/admin-create-user.php", {
      method: "POST",
      body: JSON.stringify({ email, password, accessGroups }),
      headers: { "Content-Type": "application/json" },
      requireCsrf: true,
    });

    const createdCustomer = payload.user ?? null;
    if (createdCustomer && typeof createdCustomer.id === "number") {
      state.customers = [createdCustomer, ...state.customers].sort(
        (left, right) =>
          String(left.email ?? "").localeCompare(
            String(right.email ?? ""),
            undefined,
            { sensitivity: "base" },
          ),
      );
    }

    portalView.adminCreateUserEmail = "";
    portalView.adminCreateUserPassword = "";
    portalView.adminCreateUserGroups = "";
    portalView.adminCreateUserResult = createdCustomer?.mustChangePassword
      ? "Customer created with a temporary 4-digit password. They will be forced to change it after login."
      : "Customer account created.";

    renderAdminUsers();
    return payload;
  } catch (error) {
    portalView.adminCreateUserResult = `Create failed: ${error.message}`;
    throw error;
  } finally {
    state.creatingCustomer = false;
    updateAuthUi();
  }
}

async function deleteCustomer(customer) {
  if (!hasAdminPanelAccess()) {
    throw new Error("Admin access is required");
  }

  const confirmed = window.confirm(
    `Delete customer account "${customer.email}"?\n\nThis removes the account completely. Eligible Shopify customers can be recreated by a future refresh.`,
  );
  if (!confirmed) {
    return;
  }

  state.deletingCustomerId = customer.id;
  renderAdminUsers();

  try {
    await apiJson("./api/admin-delete-user.php", {
      method: "POST",
      body: JSON.stringify({ userId: customer.id }),
      headers: { "Content-Type": "application/json" },
      requireCsrf: true,
    });

    state.customers = state.customers.filter(
      (entry) => entry.id !== customer.id,
    );
    log(`Deleted customer account ${customer.email}`);
  } finally {
    state.deletingCustomerId = 0;
    renderAdminUsers();
  }
}

async function savePackageGroups(pkg, accessGroups) {
  if (!hasAdminPanelAccess()) {
    throw new Error("Admin access is required");
  }

  state.savingPackageGroupsId = pkg.id;
  renderAdminPackages();

  try {
    const payload = await apiJson("./api/admin-set-package-groups.php", {
      method: "POST",
      body: JSON.stringify({ packageId: pkg.id, accessGroups }),
      headers: { "Content-Type": "application/json" },
      requireCsrf: true,
    });

    const updatedPackage = payload.package ?? null;
    if (updatedPackage && typeof updatedPackage.id === "string") {
      state.packages = state.packages.map((entry) =>
        entry.id === updatedPackage.id ? updatedPackage : entry,
      );
    }

    log(
      `Saved package groups for ${pkg.label}: ${accessGroupsSummary(updatedPackage?.accessGroups, "all-customers")}`,
    );
    return payload;
  } finally {
    state.savingPackageGroupsId = "";
    renderPackageViews();
  }
}

async function changePassword(newPassword) {
  const currentPassword = portalView.passwordCurrent;
  const payload = await apiJson("./api/change-password.php", {
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword }),
    headers: { "Content-Type": "application/json" },
    requireCsrf: true,
  });

  state.mustChangePassword = Boolean(payload.mustChangePassword);
  state.passwordDialogOpen = false;
  portalView.passwordCurrent = "";
  portalView.passwordNew = "";
  portalView.passwordConfirm = "";
  portalView.passwordGateNote = defaultPasswordGateNote();
  updateAuthUi();
  renderPackageViews();
  return payload;
}

async function deletePackage(pkg) {
  if (!hasAdminPanelAccess()) {
    throw new Error("Admin access is required");
  }

  const confirmed = window.confirm(
    `Delete firmware package "${pkg.label}"?\n\nThis removes it from the OTA portal.`,
  );
  if (!confirmed) {
    return;
  }

  state.deletingPackageId = pkg.id;
  renderAdminPackages();

  try {
    const payload = await apiJson("./api/admin-delete-package.php", {
      method: "POST",
      body: JSON.stringify({ packageId: pkg.id }),
      headers: { "Content-Type": "application/json" },
      requireCsrf: true,
    });

    state.packages = state.packages.filter((item) => item.id !== pkg.id);

    const warnings = Array.isArray(payload.warnings) ? payload.warnings : [];
    log(`Deleted package ${pkg.id}`);
    if (warnings.length > 0) {
      log(`Delete warnings for ${pkg.id}: ${warnings.join(", ")}`, "warn");
    }
  } finally {
    state.deletingPackageId = "";
    renderPackageViews();
  }
}

function parseJsonPayload(event, label) {
  try {
    return JSON.parse(decoder.decode(event.target.value));
  } catch (error) {
    log(`Failed to parse ${label}: ${error.message}`, "error");
    return null;
  }
}

function handleCommandValue(value) {
  for (const waiter of [...state.commandWaiters]) {
    if (waiter.matcher(value)) {
      clearTimeout(waiter.timeoutId);
      state.commandWaiters = state.commandWaiters.filter(
        (item) => item !== waiter,
      );
      waiter.resolve(value);
    }
  }
}

async function waitForCommand(matcher, timeoutMs = 6000) {
  return new Promise((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      state.commandWaiters = state.commandWaiters.filter(
        (item) => item.timeoutId !== timeoutId,
      );
      reject(new Error("Timed out waiting for device response"));
    }, timeoutMs);

    state.commandWaiters.push({ matcher, resolve, reject, timeoutId });
  });
}

function clearPendingCommandWaiters() {
  for (const waiter of state.commandWaiters) {
    clearTimeout(waiter.timeoutId);
    waiter.reject(new Error("Connection closed"));
  }
  state.commandWaiters = [];
}

async function readTextCharacteristic(characteristic) {
  const value = await characteristic.readValue();
  return decoder.decode(value);
}

async function writeTextCharacteristic(
  characteristic,
  text,
  withoutResponse = false,
) {
  const payload = encoder.encode(text);
  if (
    withoutResponse &&
    typeof characteristic.writeValueWithoutResponse === "function"
  ) {
    await characteristic.writeValueWithoutResponse(payload);
    return;
  }

  if (
    !withoutResponse &&
    typeof characteristic.writeValueWithResponse === "function"
  ) {
    await characteristic.writeValueWithResponse(payload);
    return;
  }

  await characteristic.writeValue(payload);
}

async function writeBinaryCharacteristic(
  characteristic,
  bytes,
  requireResponse = false,
) {
  if (
    requireResponse &&
    typeof characteristic.writeValueWithResponse === "function"
  ) {
    await characteristic.writeValueWithResponse(bytes);
    return;
  }

  if (
    !requireResponse &&
    typeof characteristic.writeValueWithoutResponse === "function"
  ) {
    await characteristic.writeValueWithoutResponse(bytes);
    return;
  }

  if (typeof characteristic.writeValueWithResponse === "function") {
    await characteristic.writeValueWithResponse(bytes);
    return;
  }

  await characteristic.writeValue(bytes);
}

function delay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function readStatusSnapshot() {
  if (!state.statusCharacteristic) {
    throw new Error("Status characteristic is not available");
  }

  const statusText = await readTextCharacteristic(state.statusCharacteristic);
  const status = JSON.parse(statusText);
  updateStatusUi(status);
  return status;
}

async function refreshStatus(syncDeviceContext = false) {
  if (!state.statusCharacteristic || !state.configCharacteristic) {
    return;
  }

  const statusText = await readTextCharacteristic(state.statusCharacteristic);
  const configText = await readTextCharacteristic(state.configCharacteristic);

  const status = JSON.parse(statusText);
  const config = JSON.parse(configText);
  updateStatusUi(status);
  updateConfigUi(config);
  if (syncDeviceContext) {
    await syncDeviceContextForSession(status);
  }
}

function startStatusPolling() {
  stopStatusPolling();
  state.statusPollTimer = window.setInterval(() => {
    if (!state.connected) {
      return;
    }

    refreshStatus().catch((error) => {
      log(`Status refresh failed: ${error.message}`, "warn");
    });
  }, STATUS_POLL_INTERVAL_MS);
}

function stopStatusPolling() {
  if (state.statusPollTimer !== null) {
    window.clearInterval(state.statusPollTimer);
    state.statusPollTimer = null;
  }
}

function handleDisconnect() {
  stopStatusPolling();
  clearPendingCommandWaiters();

  state.device = null;
  state.server = null;
  state.service = null;
  state.statusCharacteristic = null;
  state.configCharacteristic = null;
  state.commandCharacteristic = null;
  state.otaDataCharacteristic = null;
  if (!hasAdminPanelAccess()) {
    state.packages = [];
  }
  if (state.authenticated) {
    apiJson("./api/device-context.php", {
      method: "POST",
      body: JSON.stringify({ connected: false }),
      headers: { "Content-Type": "application/json" },
      requireCsrf: true,
    }).catch(() => null);
  }

  setUpdatingState(false);
  setConnectionState(false);
  resetStatusDisplay();
  log("Device disconnected", "warn");
}

async function syncDeviceContextForSession(status = state.lastStatus) {
  if (!state.authenticated) {
    return;
  }

  if (!state.connected || !status) {
    await apiJson("./api/device-context.php", {
      method: "POST",
      body: JSON.stringify({ connected: false }),
      headers: { "Content-Type": "application/json" },
      requireCsrf: true,
    });
    return;
  }

  await apiJson("./api/device-context.php", {
    method: "POST",
    body: JSON.stringify({
      connected: true,
      deviceName: String(status.deviceName ?? "").trim(),
      firmwareVersion: String(status.firmwareVersion ?? "-").trim() || "-",
      otaSecureMode: Boolean(status.otaSecureMode),
      otaMetadataRequired: Boolean(status.otaMetadataRequired),
      otaMetadataLoaded: Boolean(status.otaMetadataLoaded),
      otaEncryptedRequired: Boolean(status.otaEncryptedRequired),
    }),
    headers: { "Content-Type": "application/json" },
    requireCsrf: true,
  });
}

async function connect() {
  if (!state.authenticated) {
    throw new Error("Sign in before connecting to a device");
  }

  if (!navigator.bluetooth) {
    throw new Error(
      "Web Bluetooth is not available in this browser. Use the autosteerplus app, or on iPhone and iPad open the web fork with Bluefy: https://apps.apple.com/app/id1492822055",
    );
  }

  const device = await navigator.bluetooth.requestDevice({
    filters: [
      { namePrefix: "TeslaFSD-" },
      { namePrefix: "TeslaFSD-Activator" },
    ],
    optionalServices: [BLE_SERVICE_UUID],
  });

  device.addEventListener("gattserverdisconnected", handleDisconnect);
  state.device = device;
  state.server = await device.gatt.connect();
  state.service = await state.server.getPrimaryService(BLE_SERVICE_UUID);

  // Android BLE stacks are prone to GATT failures when multiple characteristic
  // lookups are started at the same time, so resolve them one-by-one.
  const statusCharacteristic =
    await state.service.getCharacteristic(BLE_STATUS_UUID);
  const configCharacteristic =
    await state.service.getCharacteristic(BLE_CONFIG_UUID);
  const commandCharacteristic =
    await state.service.getCharacteristic(BLE_COMMAND_UUID);
  const otaDataCharacteristic =
    await state.service.getCharacteristic(BLE_OTA_DATA_UUID);

  state.statusCharacteristic = statusCharacteristic;
  state.configCharacteristic = configCharacteristic;
  state.commandCharacteristic = commandCharacteristic;
  state.otaDataCharacteristic = otaDataCharacteristic;

  await state.commandCharacteristic.startNotifications();
  state.commandCharacteristic.addEventListener(
    "characteristicvaluechanged",
    (event) => {
      const response = decoder.decode(event.target.value);
      log(`Device: ${response}`);
      handleCommandValue(response);
    },
  );

  try {
    await state.statusCharacteristic.startNotifications();
    state.statusCharacteristic.addEventListener(
      "characteristicvaluechanged",
      (event) => {
        const status = parseJsonPayload(event, "status");
        if (status) {
          updateStatusUi(status);
        }
      },
    );
  } catch (error) {
    log(`Status notifications unavailable: ${error.message}`, "warn");
  }

  try {
    await state.configCharacteristic.startNotifications();
    state.configCharacteristic.addEventListener(
      "characteristicvaluechanged",
      (event) => {
        const config = parseJsonPayload(event, "config");
        if (config) {
          updateConfigUi(config);
        }
      },
    );
  } catch (error) {
    log(`Config notifications unavailable: ${error.message}`, "warn");
  }

  setConnectionState(true);
  startStatusPolling();
  await refreshStatus(true);
  await loadPackages();
  log(`Connected to ${device.name ?? "ESP32 device"}`);
}

async function disconnect() {
  if (state.device?.gatt?.connected) {
    state.device.gatt.disconnect();
  } else {
    handleDisconnect();
  }
}

async function sendCommand(text, matcher, timeoutMs, options = {}) {
  const { tolerateWriteErrorAfterResponse = false } = options;
  let responseMatched = false;
  const wrappedMatcher = matcher
    ? (value) => {
        const matched = matcher(value);
        if (matched) {
          responseMatched = true;
        }
        return matched;
      }
    : null;
  const waiter = wrappedMatcher
    ? waitForCommand(wrappedMatcher, timeoutMs)
    : null;
  const writePromise = writeTextCharacteristic(
    state.commandCharacteristic,
    text,
  ).catch((error) => {
    if (tolerateWriteErrorAfterResponse && responseMatched) {
      log(
        `Ignoring command write error after device response: ${error.message}`,
        "warn",
      );
      return null;
    }
    throw error;
  });

  if (waiter === null) {
    await writePromise;
    return null;
  }

  const firstCompleted = await Promise.race([
    waiter.then((value) => ({ type: "response", value })),
    writePromise.then(() => ({ type: "write" })),
  ]);

  if (firstCompleted.type === "response") {
    return firstCompleted.value;
  }

  return await waiter;
}

async function setHooksEnabled(enabled) {
  await writeTextCharacteristic(
    state.configCharacteristic,
    `hooks=${enabled ? 1 : 0}`,
  );
  await refreshStatus();
  log(`CAN hooks ${enabled ? "enabled" : "disabled"}`);
}

async function rebootDevice() {
  await sendCommand("reboot", (value) => value.startsWith("restarting"), 4000, {
    tolerateWriteErrorAfterResponse: true,
  });
  log("Device restart requested");
}

async function fetchFirmwarePackage(pkg) {
  log(`Fetching package ${pkg.id}`);
  const response = await apiFetch("./api/package-download.php", {
    method: "POST",
    body: JSON.stringify({ packageId: pkg.id }),
    headers: { "Content-Type": "application/json" },
    requireCsrf: true,
  });

  const buffer = await response.arrayBuffer();
  return new Uint8Array(buffer);
}

async function maybeYield(index) {
  if (index % (DEFAULT_OTA_CHUNK_SIZE * 8) === 0) {
    await delay(0);
  }
}

async function waitForOtaBytes(expectedSize) {
  const deadline = Date.now() + OTA_FLUSH_TIMEOUT_MS;
  let lastStatus = null;
  let lastWritten = -1;
  let lastAdvanceAt = Date.now();
  let lastStatusCommandAt = 0;
  let tailResendCount = 0;

  while (Date.now() < deadline) {
    lastStatus = await readStatusSnapshot();
    if (!lastStatus.otaInProgress && lastStatus.otaLastError) {
      throw new Error(lastStatus.otaLastError);
    }

    const written = lastStatus.otaBytesWritten ?? 0;
    if (written !== lastWritten) {
      lastWritten = written;
      lastAdvanceAt = Date.now();
    }

    if (written >= expectedSize) {
      return lastStatus;
    }

    const remaining = expectedSize - written;
    const shouldRequestStatus =
      lastStatusCommandAt === 0 ||
      remaining <= OTA_TAIL_FLUSH_WINDOW_BYTES ||
      Date.now() - lastStatusCommandAt >= OTA_FLUSH_STATUS_INTERVAL_MS;

    if (shouldRequestStatus) {
      lastStatusCommandAt = Date.now();
      const statusResponse = await sendCommand(
        "status",
        (value) => value === "status_ok" || value.startsWith("ota_error:"),
        4000,
      ).catch(() => null);

      if (
        typeof statusResponse === "string" &&
        statusResponse.startsWith("ota_error:")
      ) {
        throw new Error(statusResponse);
      }

      lastStatus = await readStatusSnapshot().catch(() => lastStatus);
      const refreshedWritten = lastStatus?.otaBytesWritten ?? written;
      if (refreshedWritten !== lastWritten) {
        lastWritten = refreshedWritten;
        lastAdvanceAt = Date.now();
      }

      if (refreshedWritten >= expectedSize) {
        return lastStatus;
      }

      const stalled = Date.now() - lastAdvanceAt >= OTA_STALLED_TAIL_GRACE_MS;
      if (
        remaining <= OTA_TAIL_FLUSH_WINDOW_BYTES &&
        stalled &&
        tailResendCount < OTA_TAIL_RESEND_LIMIT &&
        state.pendingFirmware
      ) {
        log(
          `Re-sending trailing ${expectedSize - refreshedWritten} OTA bytes from ${refreshedWritten}`,
          "warn",
        );
        const result = await writeChunkWithRetry(
          state.pendingFirmware,
          refreshedWritten,
          DEFAULT_OTA_CHUNK_SIZE,
        );
        lastWritten = result.offset;
        lastAdvanceAt = Date.now();
        tailResendCount += 1;
      }
    }

    await delay(OTA_FLUSH_POLL_INTERVAL_MS);
  }

  const written = lastStatus?.otaBytesWritten ?? 0;
  throw new Error(
    `Device only received ${written}/${expectedSize} bytes before finalize`,
  );
}

async function writeChunkWithRetry(firmware, offset, chunkSize) {
  const initialEnd = Math.min(offset + chunkSize, firmware.byteLength);
  let currentChunkSize = chunkSize;
  let lastError = new Error("Unknown OTA chunk failure");

  for (let attempt = 1; attempt <= OTA_CHUNK_RETRY_LIMIT; attempt += 1) {
    const end = Math.min(offset + currentChunkSize, firmware.byteLength);
    const chunk = firmware.slice(offset, end);

    try {
      await writeBinaryCharacteristic(state.otaDataCharacteristic, chunk, true);
      return {
        offset: end,
        chunkSize: currentChunkSize,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      log(
        `Chunk write failed at ${offset} (attempt ${attempt}/${OTA_CHUNK_RETRY_LIMIT}): ${lastError.message}`,
        "warn",
      );

      const status = await readStatusSnapshot().catch(() => null);
      const deviceOffset = status?.otaBytesWritten ?? null;
      if (typeof deviceOffset === "number" && deviceOffset > offset) {
        return {
          offset: Math.min(deviceOffset, firmware.byteLength),
          chunkSize: Math.max(MIN_OTA_CHUNK_SIZE, currentChunkSize - 16),
        };
      }

      currentChunkSize = Math.max(MIN_OTA_CHUNK_SIZE, currentChunkSize - 24);
      await delay(OTA_RETRY_BACKOFF_MS * attempt);
    }
  }

  throw new Error(
    `Chunk upload stalled near ${offset}-${initialEnd}: ${lastError.message}`,
  );
}

async function uploadFirmwareChunks(firmware) {
  let offset = 0;
  let chunkSize = DEFAULT_OTA_CHUNK_SIZE;
  let chunkCount = 0;

  while (offset < firmware.byteLength) {
    const result = await writeChunkWithRetry(firmware, offset, chunkSize);
    offset = result.offset;
    chunkSize = result.chunkSize;
    chunkCount += 1;

    setProgress(
      offset,
      firmware.byteLength,
      `Uploading ${offset} / ${firmware.byteLength} bytes`,
    );

    if (chunkCount % OTA_PROGRESS_STATUS_EVERY === 0) {
      await readStatusSnapshot().catch(() => null);
    }

    await maybeYield(offset);
  }
}

async function ensureSecureMetadataReady(pkg, firmware) {
  const secureDevice = deviceRequiresSecureOta();

  if (!secureDevice && !pkg.secureOta) {
    return;
  }

  if (secureDevice && !pkg.secureOta) {
    throw new Error("This device now requires encrypted OTA packages");
  }

  if (!secureDevice && pkg.secureOta) {
    throw new Error(
      "Selected package requires the secure OTA firmware on the device",
    );
  }

  if (!pkg.sha256 || !pkg.signatureHex || !pkg.deliveryIvHex) {
    throw new Error("Package metadata is incomplete");
  }

  const response = await sendCommand(
    `ota_meta:${pkg.size}:${pkg.sha256}:${pkg.signatureHex}:${pkg.deliveryIvHex}`,
    (value) =>
      value.startsWith("ota_meta_ok:") || value.startsWith("ota_error:"),
    8000,
  );

  if (!response.startsWith("ota_meta_ok:")) {
    throw new Error(response);
  }
}

function sanitizeInstallPackage(pkg) {
  const safeId = String(pkg?.id ?? "").trim();
  if (!/^[A-Za-z0-9._-]{1,120}$/.test(safeId)) {
    throw new Error("Package identifier is invalid");
  }

  const safeSize = Number(pkg?.size ?? 0);
  if (
    !Number.isInteger(safeSize) ||
    safeSize <= 0 ||
    safeSize > 16 * 1024 * 1024
  ) {
    throw new Error("Package size is invalid");
  }

  const safePackage = {
    ...pkg,
    id: safeId,
    size: safeSize,
    secureOta: Boolean(pkg?.secureOta),
    sha256: String(pkg?.sha256 ?? "")
      .trim()
      .toLowerCase(),
    signatureHex: String(pkg?.signatureHex ?? "")
      .trim()
      .toLowerCase(),
    deliveryIvHex: String(pkg?.deliveryIvHex ?? "")
      .trim()
      .toLowerCase(),
  };

  if (safePackage.secureOta) {
    if (!/^[a-f0-9]{64}$/.test(safePackage.sha256)) {
      throw new Error("Package SHA-256 metadata is invalid");
    }

    if (!/^[a-f0-9]{32}$/.test(safePackage.deliveryIvHex)) {
      throw new Error("Package delivery IV metadata is invalid");
    }

    if (
      !/^[a-f0-9]{2,160}$/.test(safePackage.signatureHex) ||
      safePackage.signatureHex.length % 2 !== 0
    ) {
      throw new Error("Package signature metadata is invalid");
    }
  }

  return safePackage;
}

async function installFirmware(pkg) {
  if (!state.connected) {
    throw new Error("Connect to the ESP32 first");
  }

  const installPackage = sanitizeInstallPackage(pkg);

  setUpdatingState(true);
  log(`Starting OTA install: ${installPackage.label}`);
  setProgress(0, 1, `Downloading ${installPackage.label}`);

  const firmware = await fetchFirmwarePackage(installPackage);
  if (firmware.byteLength === 0) {
    throw new Error("Downloaded firmware is empty");
  }

  if (installPackage.size && firmware.byteLength !== installPackage.size) {
    throw new Error(
      `Package size mismatch: expected ${installPackage.size}, received ${firmware.byteLength}`,
    );
  }

  state.pendingFirmware = firmware;

  await ensureSecureMetadataReady(installPackage, firmware);

  setProgress(
    0,
    firmware.byteLength,
    `Starting OTA for ${installPackage.label}`,
  );
  const readyResponse = await sendCommand(
    `ota_begin:${firmware.byteLength}`,
    (value) => value.startsWith("ota_ready:") || value.startsWith("ota_error:"),
    8000,
  );

  if (!readyResponse.startsWith("ota_ready:")) {
    throw new Error(readyResponse);
  }

  await uploadFirmwareChunks(firmware);

  setProgress(
    firmware.byteLength,
    firmware.byteLength,
    "Waiting for device to confirm all bytes",
  );
  await waitForOtaBytes(firmware.byteLength);

  setProgress(firmware.byteLength, firmware.byteLength, "Finalizing OTA");
  const finishResponse = await sendCommand(
    "ota_finish",
    (value) => value.startsWith("ota_done:") || value.startsWith("ota_error:"),
    15000,
    { tolerateWriteErrorAfterResponse: true },
  );

  if (!finishResponse.startsWith("ota_done:")) {
    throw new Error(finishResponse);
  }

  setProgress(
    firmware.byteLength,
    firmware.byteLength,
    "OTA complete, device restarting",
  );
  log("OTA finished successfully");
  return { deviceWillRestart: true };
}

async function abortOta() {
  const response = await sendCommand(
    "ota_abort",
    (value) =>
      value.startsWith("ota_aborted") || value.startsWith("ota_error:"),
    4000,
  );
  log(`Abort response: ${response}`);
  setProgress(0, 1, "OTA aborted");
}

export function initPortalController() {
  if (initialized) {
    return;
  }

  initialized = true;
  dom.loginChallengeWidget = document.querySelector("#login-challenge-widget");
  portalView.advancedMode = readStoredAdvancedMode();

  assignPortalActions({
    login: async () => {
      try {
        await login(portalView.loginEmail, portalView.loginPassword);
        portalView.loginPassword = "";
        log("Signed in");
      } catch (error) {
        setLoginFeedback(error.message);
        log(`Login failed: ${error.message}`, "error");
      }
    },
    signInWithPasskey: async () => {
      try {
        await signInWithPasskey(portalView.loginEmail);
      } catch (error) {
        setLoginFeedback(error.message);
        log(`Passkey sign-in failed: ${error.message}`, "error");
      }
    },
    openDocs: () => {
      navigateToPage("docs");
    },
    openDocsSection: (sectionId: string) => {
      navigateToDocsSection(sectionId);
    },
    openOnboarding: () => {
      navigateToPage("onboarding");
    },
    openFaq: () => {
      navigateToPage("faq");
    },
    openDashboard: () => {
      navigateToPage("dashboard");
    },
    toggleAdvancedMode: () => {
      setAdvancedMode(!portalView.advancedMode);
    },
    logout: async () => {
      try {
        await logout();
        log("Signed out");
      } catch (error) {
        log(`Logout failed: ${error.message}`, "error");
      }
    },
    openPasswordDialog: () => {
      openPasswordDialog();
    },
    closePasswordDialog: () => {
      closePasswordDialog();
    },
    changePassword: async () => {
      const currentPassword = portalView.passwordCurrent;
      const newPassword = portalView.passwordNew;
      const confirmPassword = portalView.passwordConfirm;
      if (passwordGateRequiresCurrentPassword() && currentPassword === "") {
        portalView.passwordGateNote = "Current password is required.";
        return;
      }
      const validationMessage = passwordValidationMessage(
        newPassword,
        state.user?.email ?? "",
      );
      if (validationMessage !== "") {
        portalView.passwordGateNote = validationMessage;
        return;
      }
      if (newPassword !== confirmPassword) {
        portalView.passwordGateNote = "The new password entries do not match.";
        return;
      }

      try {
        await changePassword(newPassword);
        log("Account password updated");
      } catch (error) {
        portalView.passwordGateNote = error.message;
        log(`Password update failed: ${error.message}`, "error");
      }
    },
    connect: async () => {
      try {
        await connect();
      } catch (error) {
        log(`Connect failed: ${error.message}`, "error");
        handleDisconnect();
      }
    },
    disconnect: async () => {
      await disconnect();
    },
    refreshStatus: async () => {
      try {
        await refreshStatus(true);
        await loadPackages();
        log("Status refreshed");
      } catch (error) {
        log(`Refresh failed: ${error.message}`, "error");
      }
    },
    rebootDevice: async () => {
      try {
        await rebootDevice();
      } catch (error) {
        log(`Reboot failed: ${error.message}`, "error");
      }
    },
    toggleHooks: async (enabled) => {
      try {
        await setHooksEnabled(enabled);
      } catch (error) {
        log(`Config update failed: ${error.message}`, "error");
        if (state.lastConfig) {
          portalView.hooksEnabled = Boolean(state.lastConfig.canHooksEnabled);
        }
      }
    },
    abortOta: async () => {
      try {
        await abortOta();
      } catch (error) {
        log(`Abort failed: ${error.message}`, "error");
      } finally {
        setUpdatingState(false);
        try {
          if (state.connected) {
            await refreshStatus();
          }
        } catch (refreshError) {
          log(`Refresh after abort failed: ${refreshError.message}`, "warn");
        }
      }
    },
    installPackage: async (packageId) => {
      const pkg = state.packages.find((entry) => entry.id === packageId);
      if (!pkg) {
        log(`Install failed: package ${packageId} is unavailable`, "error");
        return;
      }

      let deviceWillRestart = false;

      try {
        const result = await installFirmware(pkg);
        deviceWillRestart = Boolean(result?.deviceWillRestart);
      } catch (error) {
        log(`OTA failed for ${pkg.label}: ${error.message}`, "error");
        setProgress(0, 1, `OTA failed: ${error.message}`);
      } finally {
        if (!deviceWillRestart) {
          setUpdatingState(false);
          try {
            if (state.connected) {
              await refreshStatus();
            }
          } catch (refreshError) {
            log(`Post-OTA refresh failed: ${refreshError.message}`, "warn");
          }
          renderPackageViews();
        }
      }
    },
    syncShopifyCustomers: async () => {
      try {
        await syncShopifyCustomers();
        log("Shopify customer refresh finished");
      } catch (error) {
        log(`Shopify customer refresh failed: ${error.message}`, "error");
      }
    },
    reloadPackages: async () => {
      try {
        await loadPackages();
        log("Package list refreshed");
      } catch (error) {
        log(`Package refresh failed: ${error.message}`, "error");
      }
    },
    reloadCustomers: async () => {
      try {
        await loadAdminUsers();
        log("Customer list refreshed");
      } catch (error) {
        log(`Customer list refresh failed: ${error.message}`, "error");
      }
    },
    createCustomer: async () => {
      try {
        await createCustomer(
          portalView.adminCreateUserEmail,
          portalView.adminCreateUserPassword,
          portalView.adminCreateUserGroups,
        );
        log("Customer account created");
      } catch (error) {
        log(`Customer create failed: ${error.message}`, "error");
      }
    },
    saveCustomerGroups: async (customerId) => {
      const customer = state.customers.find((entry) => entry.id === customerId);
      const customerView = portalView.adminCustomers.find(
        (entry) => entry.id === customerId,
      );
      if (!customer || !customerView) {
        return;
      }

      try {
        await saveCustomerGroups(customer, customerView.accessGroupsInput);
      } catch (error) {
        log(
          `Customer group update failed for ${customer.email}: ${error.message}`,
          "error",
        );
      }
    },
    toggleCustomerAccess: async (customerId) => {
      const customer = state.customers.find((entry) => entry.id === customerId);
      if (!customer) {
        return;
      }

      try {
        await setCustomerActive(customer, customer.accessState !== "active");
      } catch (error) {
        log(
          `Customer access update failed for ${customer.email}: ${error.message}`,
          "error",
        );
      }
    },
    deleteCustomer: async (customerId) => {
      const customer = state.customers.find((entry) => entry.id === customerId);
      if (!customer) {
        return;
      }

      try {
        await deleteCustomer(customer);
      } catch (error) {
        log(
          `Customer delete failed for ${customer.email}: ${error.message}`,
          "error",
        );
      }
    },
    reloadPasskeys: async () => {
      try {
        await loadPasskeys();
        log("Passkey list refreshed");
      } catch (error) {
        log(`Passkey refresh failed: ${error.message}`, "error");
      }
    },
    registerPasskey: async () => {
      try {
        await registerPasskey();
      } catch (error) {
        log(`Passkey registration failed: ${error.message}`, "error");
      }
    },
    registerAdminPasskey: async () => {
      try {
        await registerPasskey();
      } catch (error) {
        portalView.passkeySetupNote = error.message;
        log(`Admin passkey setup failed: ${error.message}`, "error");
      }
    },
    savePackageGroups: async (packageId) => {
      const pkg = state.packages.find((entry) => entry.id === packageId);
      const packageView = portalView.adminPackages.find(
        (entry) => entry.id === packageId,
      );
      if (!pkg || !packageView) {
        return;
      }

      try {
        await savePackageGroups(pkg, packageView.accessGroupsInput);
      } catch (error) {
        log(
          `Package group update failed for ${pkg.label}: ${error.message}`,
          "error",
        );
      }
    },
    deletePackage: async (packageId) => {
      const pkg = state.packages.find((entry) => entry.id === packageId);
      if (!pkg) {
        return;
      }

      try {
        await deletePackage(pkg);
      } catch (error) {
        log(`Delete failed for ${pkg.label}: ${error.message}`, "error");
      }
    },
    removePasskey: async (passkeyId) => {
      const passkey = state.passkeys.find((entry) => entry.id === passkeyId);
      if (!passkey) {
        return;
      }

      try {
        await deletePasskey(passkey);
      } catch (error) {
        log(`Passkey removal failed: ${error.message}`, "error");
      }
    },
    clearLog: () => {
      portalView.eventLogText = "";
    },
  });

  watch(
    () => [
      portalView.passwordCurrent,
      portalView.passwordNew,
      portalView.passwordConfirm,
      state.mustChangePassword,
      state.passwordDialogOpen,
    ],
    () => {
      if (portalView.passwordGateVisible) {
        updatePasswordGateValidation();
      }
    },
  );

  window.addEventListener("hashchange", syncPageFromLocation);
  syncPageFromLocation();

  setConnectionState(false);
  setUpdatingState(false);
  setProgress(0, 1, "No transfer started");
  resetStatusDisplay();
  updateAuthUi();
  renderPackageViews();
  log("Page ready");

  loadSession().catch((error) => {
    log(`Session bootstrap failed: ${error.message}`, "error");
  });
}
