# AutoSteer Plus

This project wraps the published `https://fsd.teslaandroid.com` portal in a Capacitor iOS app and bridges the portal's Web Bluetooth calls to native BLE through `@capacitor-community/bluetooth-le`.

## What is included

- A local mirror of the portal HTML, CSS, and JavaScript under `src/portal/`
- A native runtime fetch bridge that keeps the portal talking to the live `fsd.teslaandroid.com` backend
- A Web Bluetooth compatibility shim that exposes the subset of `navigator.bluetooth` used by the portal and forwards it to Capacitor BLE
- iOS native configuration for Bluetooth permissions and plugin registration

## Commands

```bash
bun install
bun run cap:sync
bun run ios:open
```

## Notes

- The UI can run in the iOS simulator, but CoreBluetooth does not work in the simulator. BLE testing requires a physical iPhone.
- The app source is mirrored locally, but authentication and API calls still go to the live `https://fsd.teslaandroid.com` service through the runtime bridge.
- `bun run cap:sync` reapplies the required iOS Swift Package Manager and Capacitor plugin registration changes after each Capacitor sync.
