

console.log("hello world");
const Bitcoin = require('bitcoinjs-lib');
const Bip39 = require('bip39');
const Bip32 = require('bip32');

function getAddress (node, network) {
  return Bitcoin.payments.p2pkh({ pubkey: node.publicKey, network }).address
}

// const mnemonic = `entire taste skull already invest view turtle surge razor key next \
// buffalo venue canoe sheriff winner wash ten subject hamster scrap unit shield garden`;

const mnemonic = `Commerce on the Internet has come to rely almost exclusively on financial institutions serving as
trusted third parties to process electronic payments`;

const seed = Bip39.mnemonicToSeed(mnemonic);

const root = Bip32.fromSeed(seed, Bitcoin.networks.bitcoin);

const child1 = root.derivePath("m/44'/0'/0'/0/0");
const child2 = root.deriveHardened(44).deriveHardened(0).deriveHardened(0).derive(0).derive(0);

console.log(getAddress(child1)); //1ENQm8nEP7sd6dqXbAMYZ4AuqcP8Y7AtR
console.log(getAddress(child2)); //1Hb6Z1uZ1RuZ6GXTvedQ2ETYKYsMc5qynN