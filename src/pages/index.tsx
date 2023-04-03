import AccountCard from '@/components/AccountCard'
import AccountPicker from '@/components/AccountPicker'
import ImportBitGoWalletsBtn from '@/components/ImportBitGoWallets'
import PageHeader from '@/components/PageHeader'
import { EIP155_MAINNET_CHAINS, EIP155_TEST_CHAINS } from '@/data/EIP155Data'
import SettingsStore from '@/store/SettingsStore'
import WalletsStore from '@/store/WalletsStore'
import { Text } from '@nextui-org/react'
import { useSession } from 'next-auth/react'
import { Fragment } from 'react'
import { useSnapshot } from 'valtio'

export default function HomePage() {
  const { testNets, eip155Address } = useSnapshot(SettingsStore.state)
  const { wallets } = useSnapshot(WalletsStore.state)

  return (
    <Fragment>
      <PageHeader title="Wallets">
        <ImportBitGoWalletsBtn />
      </PageHeader>
      {wallets.map(wallet => {
        return (
          <div key={wallet.address}>
            <Text>{wallet.label}</Text>
            <Text>{wallet.address}</Text>
          </div>
        )
      })}
    </Fragment>
  )
}
