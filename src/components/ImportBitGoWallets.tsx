import ModalStore from '@/store/ModalStore'
import SettingsStore from '@/store/SettingsStore'
import { eip155Addresses } from '@/utils/EIP155WalletUtil'
import { Button } from '@nextui-org/react'
import { useSnapshot } from 'valtio'

export default function ImportBitGoWalletsBtn() {
  const { account } = useSnapshot(SettingsStore.state)

  function onPress() {
    ModalStore.open('ImportWalletsModal', {})
  }

  return (
    <Button size="xs" onClick={onPress} color="gradient">
      Add Wallet
    </Button>
  )
}
