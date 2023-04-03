import { proxy, subscribe } from 'valtio'

export type BitGoWallet = {
  address: string
  label: string
}
/**
 * Types
 */
interface State {
  wallets: BitGoWallet[]
}

const persistedWallets =
  typeof localStorage !== 'undefined' ? localStorage.getItem('WALLETS') : null

/**
 * State
 */
const initState = persistedWallets ? JSON.parse(persistedWallets) : { wallets: [] }
const state = proxy<State>(initState)

/**
 * Store / Actions
 */
const WalletsStore = {
  state,

  addWallets(wallets: BitGoWallet[]) {
    state.wallets = state.wallets.concat(wallets)
  },

  getWallets() {
    return state.wallets
  }
}

subscribe(state, () => {
  localStorage.setItem('WALLETS', JSON.stringify(state))
})

export default WalletsStore
