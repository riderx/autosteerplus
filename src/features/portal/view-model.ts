import { reactive } from 'vue';

export type PortalLogLevel = 'info' | 'warn' | 'error';

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
  statusClass: string;
  primaryMeta: string;
  secondaryMeta: string;
  accessGroupsInput: string;
  saveGroupsLabel: string;
  saveGroupsDisabled: boolean;
  toggleLabel: string;
  toggleClass: string;
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

export interface PortalActions {
  login: () => Promise<void>;
  signInWithPasskey: () => Promise<void>;
  logout: () => Promise<void>;
  openPasswordDialog: () => void;
  closePasswordDialog: () => void;
  changePassword: () => Promise<void>;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  refreshStatus: () => Promise<void>;
  rebootDevice: () => Promise<void>;
  toggleHooks: (enabled: boolean) => Promise<void>;
  abortOta: () => Promise<void>;
  installPackage: (packageId: string) => Promise<void>;
  syncShopifyCustomers: () => Promise<void>;
  reloadPackages: () => Promise<void>;
  reloadCustomers: () => Promise<void>;
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
  logout: noopAsync,
  openPasswordDialog: noopVoid,
  closePasswordDialog: noopVoid,
  changePassword: noopAsync,
  connect: noopAsync,
  disconnect: noopAsync,
  refreshStatus: noopAsync,
  rebootDevice: noopAsync,
  toggleHooks: noopAsync,
  abortOta: noopAsync,
  installPackage: noopAsync,
  syncShopifyCustomers: noopAsync,
  reloadPackages: noopAsync,
  reloadCustomers: noopAsync,
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
  return 'If your account was imported from Shopify, your default username is the email address used on your order and your default password is your Shopify order number. If you placed multiple orders, use the first order number. If you already registered a passkey, you can use it instead of your password.';
}

export function defaultPasskeySetupNote() {
  return 'Admin accounts now require a passkey before the administration panel can be used.';
}

export function defaultPasswordGateNote() {
  return 'Your temporary password must be replaced before you can use the portal.';
}

export const portalView = reactive({
  authenticated: false,
  authNote: defaultAuthNote(),
  loginEmail: '',
  loginPassword: '',
  loginFeedback: '',
  loginChallengeVisible: false,
  loginChallengeNote: 'Complete the security check to continue signing in.',
  showLogoutButton: false,
  showChangePasswordButton: false,
  passwordGateVisible: false,
  passwordGateRequiresCurrent: false,
  passwordGateNote: defaultPasswordGateNote(),
  passwordCurrent: '',
  passwordNew: '',
  passwordConfirm: '',
  passkeySetupVisible: false,
  passkeySetupNote: defaultPasskeySetupNote(),
  adminVisible: false,
  adminCreateUserEmail: '',
  adminCreateUserPassword: '',
  adminCreateUserGroups: '',
  adminCreateUserResult: '',
  adminCreateUserDisabled: true,
  adminCustomersNote: '',
  adminCustomers: [] as PortalAdminCustomerView[],
  adminPackagesNote: '',
  adminPackages: [] as PortalAdminPackageView[],
  shopifySyncDisabled: true,
  shopifySyncResult: '',
  reloadPackagesDisabled: true,
  reloadCustomersDisabled: true,
  reloadPasskeysDisabled: true,
  registerPasskeyDisabled: true,
  adminRegisterPasskeyDisabled: true,
  connectDisabled: true,
  disconnectDisabled: true,
  refreshDisabled: true,
  rebootDisabled: true,
  hooksDisabled: true,
  hooksEnabled: false,
  abortOtaDisabled: true,
  connectionLabel: 'Disconnected',
  connectionOnline: false,
  configNote: 'Connect to the device before editing persistent settings.',
  installPackages: [] as PortalInstallPackageView[],
  packageNote: 'No packages loaded yet.',
  progressLabel: 'No transfer started',
  progressPercent: 0,
  progressPercentText: '0%',
  deviceName: 'Not connected',
  firmwareVersion: '-',
  canState: '-',
  hooksState: '-',
  profileState: '-',
  speedOffsetState: '-',
  fsdFlagState: '-',
  otaState: 'Idle',
  passkeyNote: 'Passkeys let you sign in without reusing a password. Admin accounts require at least one registered passkey.',
  passkeys: [] as PortalPasskeyView[],
  eventLogText: '',
});
