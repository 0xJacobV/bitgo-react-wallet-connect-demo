import { Wallet } from '@bitgo-beta/sdk-core'
import { Gteth } from '@bitgo-beta/sdk-coin-eth'
import { BitGoAPI } from '@bitgo-beta/sdk-api'

let __bitgo: BitGoAPI

export const initBitGo = () => {
  if (!__bitgo) {
    __bitgo = new BitGoAPI({
      env: 'test'
    })
    __bitgo.register('gteth', Gteth.createInstance)
  }
  return __bitgo
}

export const getBitGo = () => {
  if (!__bitgo) {
    initBitGo()
  }
  return __bitgo
}
