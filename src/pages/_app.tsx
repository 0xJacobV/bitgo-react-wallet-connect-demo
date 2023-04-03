import Layout from '@/components/Layout'
import Modal from '@/components/Modal'
import useInitialization from '@/hooks/useInitialization'
import useWalletConnectEventsManager from '@/hooks/useWalletConnectEventsManager'
import { initBitGo } from '@/utils/BitGo'
import { createLegacySignClient } from '@/utils/LegacyWalletConnectUtil'
import { createTheme, NextUIProvider } from '@nextui-org/react'
import { SessionProvider } from 'next-auth/react'

import { AppProps } from 'next/app'
import '../../public/main.css'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  // Step 1 - Initialize wallets and wallet connect client
  const initialized = useInitialization()

  // Step 2 - Once initialized, set up wallet connect event manager
  useWalletConnectEventsManager(initialized)

  // Backwards compatibility only - create a legacy v1 SignClient instance.
  createLegacySignClient()

  initBitGo()

  return (
    <SessionProvider session={session}>
      <NextUIProvider theme={createTheme({ type: 'dark' })}>
        <Layout initialized={initialized}>
          <Component {...pageProps} />
        </Layout>
        <Modal />
      </NextUIProvider>
    </SessionProvider>
  )
}
