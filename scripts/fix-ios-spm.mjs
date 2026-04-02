import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const root = resolve(scriptDir, '..');
const packageSwiftPath = resolve(root, 'ios/App/CapApp-SPM/Package.swift');
const capacitorConfigPath = resolve(root, 'ios/App/App/capacitor.config.json');

const packageSwift = `// swift-tools-version: 5.9
import PackageDescription

// DO NOT MODIFY THIS FILE - managed by Capacitor CLI commands
let package = Package(
    name: "CapApp-SPM",
    platforms: [.iOS(.v15)],
    products: [
        .library(
            name: "CapApp-SPM",
            targets: ["CapApp-SPM"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", exact: "8.3.0"),
        .package(path: "../../../node_modules/@capacitor-community/bluetooth-le")
    ],
    targets: [
        .target(
            name: "CapApp-SPM",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm"),
                .product(name: "CapacitorCommunityBluetoothLe", package: "bluetooth-le")
            ]
        )
    ]
)
`;

writeFileSync(packageSwiftPath, packageSwift);

const capacitorConfig = JSON.parse(readFileSync(capacitorConfigPath, 'utf8'));
capacitorConfig.packageClassList = ['BluetoothLe'];
writeFileSync(capacitorConfigPath, `${JSON.stringify(capacitorConfig, null, '\t')}\n`);
