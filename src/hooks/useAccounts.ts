import SettingsStore from '@/store/SettingsStore'
import { createOrRestoreEIP155Wallet, eip155Addresses } from '@/utils/EIP155WalletUtil'
import { useEffect } from 'react'

export default function useAccounts() {
  useEffect( () => {
    const fetchData = async () => {
      const { eip155Addresses } = await createOrRestoreEIP155Wallet();
      SettingsStore.setEIP155Address(eip155Addresses[0])
    }
    fetchData();
  }, [eip155Addresses])
}
