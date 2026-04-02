import { BleClient, type RequestBleDeviceOptions } from '@capacitor-community/bluetooth-le';
import { Capacitor } from '@capacitor/core';

type CharacteristicChangedEvent = {
  type: 'characteristicvaluechanged';
  target: WebBluetoothCharacteristicShim;
};

type GattDisconnectEvent = {
  type: 'gattserverdisconnected';
  target: WebBluetoothDeviceShim;
};

type Listener<TEvent> = (event: TEvent) => void;

let bleReady = false;

type PortalBluetoothFilter = {
  services?: string[];
  name?: string;
  namePrefix?: string;
};

type PortalRequestDeviceOptions = {
  filters?: PortalBluetoothFilter[];
  optionalServices?: string[];
};

class ListenerRegistry<TEvent extends { type: string }> {
  #listeners = new Map<string, Set<Listener<TEvent>>>();

  addEventListener(type: TEvent['type'], listener: Listener<TEvent>): void {
    const listeners = this.#listeners.get(type) ?? new Set<Listener<TEvent>>();
    listeners.add(listener);
    this.#listeners.set(type, listeners);
  }

  removeEventListener(type: TEvent['type'], listener: Listener<TEvent>): void {
    this.#listeners.get(type)?.delete(listener);
  }

  protected emit(event: TEvent): void {
    this.#listeners.get(event.type)?.forEach((listener) => listener(event));
  }
}

function cloneDataView(view: DataView): DataView {
  const copy = view.buffer.slice(view.byteOffset, view.byteOffset + view.byteLength);
  return new DataView(copy);
}

function toDataView(value: BufferSource): DataView {
  if (value instanceof DataView) {
    return cloneDataView(value);
  }

  if (value instanceof ArrayBuffer) {
    return new DataView(value.slice(0));
  }

  return new DataView(value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength));
}

async function ensureBleReady(): Promise<void> {
  if (bleReady) {
    return;
  }

  await BleClient.initialize({ androidNeverForLocation: true });
  bleReady = true;
}

function mergeRequestOptions(options?: PortalRequestDeviceOptions): RequestBleDeviceOptions {
  const filters = options?.filters ?? [];
  const optionalServices = options?.optionalServices ?? [];
  const services = new Set<string>();
  let name: string | undefined;
  let namePrefix: string | undefined;

  for (const filter of filters) {
    filter.services?.forEach((service: string) => services.add(service));
    if (!name && filter.name) {
      name = filter.name;
    }
    if (!namePrefix && filter.namePrefix) {
      namePrefix = filter.namePrefix;
    }
  }

  return {
    services: services.size > 0 ? [...services] : undefined,
    optionalServices: optionalServices.length > 0 ? [...optionalServices] : undefined,
    name,
    namePrefix,
    displayMode: 'list',
  };
}

class WebBluetoothCharacteristicShim extends ListenerRegistry<CharacteristicChangedEvent> {
  value: DataView | null = null;
  #notifying = false;
  deviceId: string;
  serviceUuid: string;
  uuid: string;

  constructor(deviceId: string, serviceUuid: string, uuid: string) {
    super();
    this.deviceId = deviceId;
    this.serviceUuid = serviceUuid;
    this.uuid = uuid;
  }

  async readValue(): Promise<DataView> {
    const value = await BleClient.read(this.deviceId, this.serviceUuid, this.uuid);
    this.value = cloneDataView(value);
    return this.value;
  }

  async writeValue(value: BufferSource): Promise<void> {
    await BleClient.write(this.deviceId, this.serviceUuid, this.uuid, toDataView(value));
  }

  async writeValueWithResponse(value: BufferSource): Promise<void> {
    await this.writeValue(value);
  }

  async writeValueWithoutResponse(value: BufferSource): Promise<void> {
    await BleClient.writeWithoutResponse(this.deviceId, this.serviceUuid, this.uuid, toDataView(value));
  }

  async startNotifications(): Promise<this> {
    if (this.#notifying) {
      return this;
    }

    await BleClient.startNotifications(this.deviceId, this.serviceUuid, this.uuid, (value) => {
      this.value = cloneDataView(value);
      this.emit({
        type: 'characteristicvaluechanged',
        target: this,
      });
    });
    this.#notifying = true;
    return this;
  }

  async stopNotifications(): Promise<this> {
    if (!this.#notifying) {
      return this;
    }

    await BleClient.stopNotifications(this.deviceId, this.serviceUuid, this.uuid);
    this.#notifying = false;
    return this;
  }
}

class WebBluetoothServiceShim {
  #characteristics = new Map<string, WebBluetoothCharacteristicShim>();
  deviceId: string;
  uuid: string;

  constructor(deviceId: string, uuid: string) {
    this.deviceId = deviceId;
    this.uuid = uuid;
  }

  async getCharacteristic(uuid: string): Promise<WebBluetoothCharacteristicShim> {
    const normalizedUuid = uuid.toLowerCase();
    let characteristic = this.#characteristics.get(normalizedUuid);

    if (!characteristic) {
      characteristic = new WebBluetoothCharacteristicShim(this.deviceId, this.uuid, normalizedUuid);
      this.#characteristics.set(normalizedUuid, characteristic);
    }

    return characteristic;
  }
}

class WebBluetoothGattServerShim {
  connected = false;
  #services = new Map<string, WebBluetoothServiceShim>();
  device: WebBluetoothDeviceShim;

  constructor(device: WebBluetoothDeviceShim) {
    this.device = device;
  }

  async connect(): Promise<this> {
    await ensureBleReady();
    await BleClient.disconnect(this.device.id).catch(() => undefined);
    await BleClient.connect(
      this.device.id,
      () => {
        this.handleDisconnect();
      },
      { skipDescriptorDiscovery: true },
    );
    this.connected = true;
    return this;
  }

  disconnect(): void {
    if (!this.connected) {
      return;
    }

    this.connected = false;
    void BleClient.disconnect(this.device.id).catch(() => undefined);
    this.device.emitDisconnected();
  }

  async getPrimaryService(uuid: string): Promise<WebBluetoothServiceShim> {
    const normalizedUuid = uuid.toLowerCase();
    let service = this.#services.get(normalizedUuid);

    if (!service) {
      service = new WebBluetoothServiceShim(this.device.id, normalizedUuid);
      this.#services.set(normalizedUuid, service);
    }

    return service;
  }

  private handleDisconnect(): void {
    if (!this.connected) {
      return;
    }

    this.connected = false;
    this.device.emitDisconnected();
  }
}

class WebBluetoothDeviceShim extends ListenerRegistry<GattDisconnectEvent> {
  readonly gatt: WebBluetoothGattServerShim;
  id: string;
  name: string | null;

  constructor(id: string, name: string | null) {
    super();
    this.id = id;
    this.name = name;
    this.gatt = new WebBluetoothGattServerShim(this);
  }

  emitDisconnected(): void {
    this.emit({
      type: 'gattserverdisconnected',
      target: this,
    });
  }
}

class WebBluetoothNavigatorShim {
  async requestDevice(options?: PortalRequestDeviceOptions): Promise<WebBluetoothDeviceShim> {
    await ensureBleReady();
    const device = await BleClient.requestDevice(mergeRequestOptions(options));
    return new WebBluetoothDeviceShim(device.deviceId, device.name ?? null);
  }
}

type NavigatorWithBluetooth = Navigator & {
  bluetooth?: WebBluetoothNavigatorShim;
};

export function installWebBluetoothShim(): void {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  const nativeNavigator = navigator as NavigatorWithBluetooth;
  if (nativeNavigator.bluetooth) {
    return;
  }

  Object.defineProperty(nativeNavigator, 'bluetooth', {
    configurable: true,
    value: new WebBluetoothNavigatorShim(),
  });
}
