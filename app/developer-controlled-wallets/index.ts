import { createWalletSet } from "./walletSet/createWalletSet";
import { createWallet } from "./wallets/createWallet";

async function main() {
    const walletSet = await createWalletSet('MyWalletSet');
    if (!walletSet) return console.error("Error while creating wallet set");

    const wallets = await createWallet(walletSet.id, 1);
    console.log('Created wallets: ', wallets);
}

main();