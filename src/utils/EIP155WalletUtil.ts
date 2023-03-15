
import { Wallet } from '@bitgo-beta/sdk-core';
import { Gteth } from '@bitgo-beta/sdk-coin-eth';
import { BitGoAPI } from '@bitgo-beta/sdk-api';

export let wallet1: Wallet;
export let eip155Wallets: Record<string, Wallet>
export let eip155Addresses: string[]

let address1: string
const walletId = process.env.NEXT_PUBLIC_WALLET_ID;

/**
 * Utilities
 */
export async function createOrRestoreEIP155Wallet() {

  try {
    console.log('starting2');
    const bitgo = new BitGoAPI({
      env: 'test',
      customRootURI: 'http://localhost:3000',
      accessToken: 'unusedValue'
    });
    bitgo.register('gteth', Gteth.createInstance);
    const basecoin = bitgo.coin('gteth');
    // basecoin._url = 'https://app.bitgo-test.com/';
    // await bitgo.unlock({otp: '0000000', duration: 36000});
    wallet1 = await basecoin.wallets().get({ id: walletId });
    console.log(`bitgo wallet:
    {
      label: ${wallet1.label()}
      id: ${wallet1.id()}
      address: ${wallet1.receiveAddress()}
    }` )
    // const mnemonic1 = localStorage.getItem('EIP155_MNEMONIC_1')
    // const mnemonic2 = localStorage.getItem('EIP155_MNEMONIC_2')
    //
    // if (mnemonic1 && mnemonic2) {
    //   wallet1 = EIP155Lib.init({ mnemonic: mnemonic1 })
    //   wallet2 = EIP155Lib.init({ mnemonic: mnemonic2 })
    // } else {
    //   wallet1 = EIP155Lib.init({})
    //   wallet2 = EIP155Lib.init({})
    //
    //   // Don't store mnemonic in local storage in a production project!
    //   localStorage.setItem('EIP155_MNEMONIC_1', wallet1.getMnemonic())
    //   localStorage.setItem('EIP155_MNEMONIC_2', wallet2.getMnemonic())
    // }
    //
    address1 = wallet1.receiveAddress();
    // address2 = wallet2.getAddress()
    console.log('address1: ', address1);



    eip155Wallets = {
      [address1]: wallet1,
    }
    eip155Addresses = Object.keys(eip155Wallets)

    return {
      eip155Wallets,
      eip155Addresses
    }
  }
  catch (e: unknown) {
    // const errorMessage = `error: ${e.result.error} with requestid: ${e.result.requestId}`;
    console.log(e);
    throw new Error(e);
  }

}
