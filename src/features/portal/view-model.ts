import { reactive } from "vue";

export type PortalLogLevel = "info" | "warn" | "error";

export interface PortalInstallPackageView {
  id: string;
  label: string;
  disabled: boolean;
}

export interface PortalAdminPackageView {
  id: string;
  label: string;
  primaryMeta: string;
  secondaryMeta: string;
  audienceMeta: string;
  accessGroupsInput: string;
  saveGroupsLabel: string;
  saveGroupsDisabled: boolean;
  deleteLabel: string;
  deleteDisabled: boolean;
}

export interface PortalAdminCustomerView {
  id: number;
  email: string;
  statusLabel: string;
  statusTone: string;
  primaryMeta: string;
  secondaryMeta: string;
  accessGroupsInput: string;
  saveGroupsLabel: string;
  saveGroupsDisabled: boolean;
  toggleLabel: string;
  toggleVariant: "secondary" | "danger";
  toggleDisabled: boolean;
  deleteLabel: string;
  deleteDisabled: boolean;
}

export interface PortalPasskeyView {
  id: number;
  title: string;
  primaryMeta: string;
  secondaryMeta: string;
  deleteLabel: string;
  deleteDisabled: boolean;
}

export interface PortalManagementModeOptionView {
  id: string;
  label: string;
  summary: string;
}

export interface PortalManagementPayloadView {
  id: string;
  label: string;
  summary: string;
  enabled: boolean;
  disabled: boolean;
}

export interface PortalManagementChoiceOptionView {
  id: string;
  label: string;
}

export interface PortalManagementChoiceView {
  id: string;
  label: string;
  summary: string;
  value: string;
  control: "select" | "range";
  disabled: boolean;
  options: PortalManagementChoiceOptionView[];
  min: number;
  max: number;
  step: number;
  suffix: string;
  showValue: boolean;
}

export interface PortalActions {
  login: () => Promise<void>;
  signInWithPasskey: () => Promise<void>;
  openDocs: () => void;
  openDocsSection: (sectionId: string) => void;
  openOnboarding: () => void;
  openIdentifyCar: () => void;
  openFaq: () => void;
  openDashboard: () => void;
  toggleAdvancedMode: () => void;
  logout: () => Promise<void>;
  openPasswordDialog: () => void;
  closePasswordDialog: () => void;
  changePassword: () => Promise<void>;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  refreshStatus: () => Promise<void>;
  rebootDevice: () => Promise<void>;
  toggleHooks: (enabled: boolean) => Promise<void>;
  setOperationMode: (modeId: string) => Promise<void>;
  setManagementPayloadEnabled: (
    payloadId: string,
    enabled: boolean,
  ) => Promise<void>;
  setManagementChoiceValue: (
    choiceId: string,
    value: string | number,
  ) => Promise<void>;
  abortOta: () => Promise<void>;
  installPackage: (packageId: string) => Promise<void>;
  syncShopifyCustomers: () => Promise<void>;
  reloadPackages: () => Promise<void>;
  reloadCustomers: () => Promise<void>;
  saveDeviceManagementLock: () => Promise<void>;
  createCustomer: () => Promise<void>;
  saveCustomerGroups: (customerId: number) => Promise<void>;
  toggleCustomerAccess: (customerId: number) => Promise<void>;
  deleteCustomer: (customerId: number) => Promise<void>;
  reloadPasskeys: () => Promise<void>;
  registerPasskey: () => Promise<void>;
  registerAdminPasskey: () => Promise<void>;
  savePackageGroups: (packageId: string) => Promise<void>;
  deletePackage: (packageId: string) => Promise<void>;
  removePasskey: (passkeyId: number) => Promise<void>;
  clearLog: () => void;
}

const noopAsync = async () => {};
const noopVoid = () => {};

export const portalActions: PortalActions = {
  login: noopAsync,
  signInWithPasskey: noopAsync,
  openDocs: noopVoid,
  openDocsSection: noopVoid,
  openOnboarding: noopVoid,
  openIdentifyCar: noopVoid,
  openFaq: noopVoid,
  openDashboard: noopVoid,
  toggleAdvancedMode: noopVoid,
  logout: noopAsync,
  openPasswordDialog: noopVoid,
  closePasswordDialog: noopVoid,
  changePassword: noopAsync,
  connect: noopAsync,
  disconnect: noopAsync,
  refreshStatus: noopAsync,
  rebootDevice: noopAsync,
  toggleHooks: noopAsync,
  setOperationMode: noopAsync,
  setManagementPayloadEnabled: noopAsync,
  setManagementChoiceValue: noopAsync,
  abortOta: noopAsync,
  installPackage: noopAsync,
  syncShopifyCustomers: noopAsync,
  reloadPackages: noopAsync,
  reloadCustomers: noopAsync,
  saveDeviceManagementLock: noopAsync,
  createCustomer: noopAsync,
  saveCustomerGroups: noopAsync,
  toggleCustomerAccess: noopAsync,
  deleteCustomer: noopAsync,
  reloadPasskeys: noopAsync,
  registerPasskey: noopAsync,
  registerAdminPasskey: noopAsync,
  savePackageGroups: noopAsync,
  deletePackage: noopAsync,
  removePasskey: noopAsync,
  clearLog: noopVoid,
};

export function assignPortalActions(actions: Partial<PortalActions>) {
  Object.assign(portalActions, actions);
}

export function defaultAuthNote() {
  return "If your account was imported from Shopify, your default username is the email address used on your order and your default password is your Shopify order number. If you placed multiple orders, use the first order number. If you already registered a passkey, you can use it instead of your password.";
}

export function defaultPasskeySetupNote() {
  return "Admin accounts now require a passkey before the administration panel can be used.";
}

export function defaultPasswordGateNote() {
  return "Your temporary password must be replaced before you can use the portal.";
}

export const portalView = reactive({
  currentPage: "dashboard" as
    | "dashboard"
    | "docs"
    | "onboarding"
    | "faq"
    | "identify",
  advancedMode: false,
  authenticated: false,
  authNote: defaultAuthNote(),
  loginEmail: "",
  loginPassword: "",
  loginFeedback: "",
  loginChallengeVisible: false,
  loginChallengeNote: "Complete the security check to continue signing in.",
  showLogoutButton: false,
  showChangePasswordButton: false,
  passwordGateVisible: false,
  passwordGateRequiresCurrent: false,
  passwordGateNote: defaultPasswordGateNote(),
  passwordCurrent: "",
  passwordNew: "",
  passwordConfirm: "",
  passkeySetupVisible: false,
  passkeySetupNote: defaultPasskeySetupNote(),
  adminVisible: false,
  adminCreateUserEmail: "",
  adminCreateUserPassword: "",
  adminCreateUserGroups: "",
  adminCreateUserResult: "",
  adminCreateUserDisabled: true,
  adminDeviceManagementVersion: "",
  adminDeviceManagementGroups: "",
  adminDeviceManagementResult: "",
  adminDeviceManagementDisabled: true,
  adminDeviceManagementNote: "",
  adminCustomersNote: "",
  adminCustomers: [] as PortalAdminCustomerView[],
  adminPackagesNote: "",
  adminPackages: [] as PortalAdminPackageView[],
  shopifySyncDisabled: true,
  shopifySyncResult: "",
  reloadPackagesDisabled: true,
  reloadCustomersDisabled: true,
  reloadPasskeysDisabled: true,
  registerPasskeyDisabled: true,
  adminRegisterPasskeyDisabled: true,
  passkeysEnabled: true,
  connectDisabled: true,
  disconnectDisabled: true,
  refreshDisabled: true,
  rebootDisabled: true,
  hooksDisabled: true,
  deviceConfigDisabled: true,
  hooksEnabled: false,
  abortOtaDisabled: true,
  connectionLabel: "Disconnected",
  connectionOnline: false,
  configNote: "Connect to the device before editing persistent settings.",
  managementUpgradeVisible: false,
  managementUpgradeNote: "",
  alternateManagementVisible: false,
  alternateManagementNote: "",
  managementModeState: "-",
  managementModeSummary:
    "Choose the feature bundle that matches the vehicle hardware and package on the car.",
  managementSelectedModeId: "",
  managementModeOptions: [] as PortalManagementModeOptionView[],
  managementPayloads: [] as PortalManagementPayloadView[],
  managementChoices: [] as PortalManagementChoiceView[],
  payloadResetAfterOta: false,
  installPackages: [] as PortalInstallPackageView[],
  packageNote: "No packages loaded yet.",
  otaActivityVisible: false,
  progressLabel: "No transfer started",
  progressPercent: 0,
  progressPercentText: "0%",
  deviceName: "Not connected",
  firmwareVersion: "-",
  canState: "-",
  hooksState: "-",
  profileState: "-",
  speedOffsetState: "-",
  fsdFlagState: "-",
  otaState: "Idle",
  passkeyNote:
    "Passkeys let you sign in without reusing a password. Admin accounts require at least one registered passkey.",
  passkeys: [] as PortalPasskeyView[],
  eventLogText: "",
});
