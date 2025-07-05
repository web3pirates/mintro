// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Script } from "forge-std/Script.sol";
import { SmartWallet } from "../src/SmartWallet.sol";

contract DeploySmartWallet is Script {
    function run() public {
        vm.startBroadcast();
        new SmartWallet(0x39B0b31745415e911bBf5bEe6EBA434592555E80);
        vm.stopBroadcast();
    }
}