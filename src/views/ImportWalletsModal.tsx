import ProjectInfoCard from '@/components/ProjectInfoCard'
import ProposalSelectSection from '@/components/ProposalSelectSection'
import RequestModalContainer from '@/components/RequestModalContainer'
import WalletProposalSelectSection from '@/components/WalletProposalSelectSelection'
import ModalStore from '@/store/ModalStore'
import WalletsStore from '@/store/WalletsStore'
import { getBitGo, initBitGo } from '@/utils/BitGo'
import { eip155Addresses } from '@/utils/EIP155WalletUtil'
import { isEIP155Chain } from '@/utils/HelperUtil'
import { legacySignClient } from '@/utils/LegacyWalletConnectUtil'
import { Button, Divider, Modal, Text } from '@nextui-org/react'
import { getSdkError } from '@walletconnect/utils'
import { useSession } from 'next-auth/react'
import { Fragment, useEffect, useState } from 'react'

export default function ImportBitGoWallets() {
  const [selectedAccounts, setSelectedAccounts] = useState<
    Record<string, { address: string; label: string }[]>
  >({})
  const [bitgoWallets, setBitGoWallets] = useState<{ address: string; label: string }[]>([])

  const hasSelected = Object.keys(selectedAccounts).length
  const { data } = useSession()

  // Add / remove address from EIP155 selection
  const onSelectAccount = (address: string, label: string) => {
    const chain = 'eip155'
    if (selectedAccounts[chain]?.find(wallet => wallet.address !== address)) {
      const newSelectedAccounts = selectedAccounts[chain]?.filter(a => a.address !== address)
      setSelectedAccounts(prev => ({
        ...prev,
        [chain]: newSelectedAccounts
      }))
    } else {
      const prevChainAddresses = selectedAccounts[chain] ?? []
      setSelectedAccounts(prev => ({
        ...prev,
        [chain]: [...prevChainAddresses, { address, label }]
      }))
    }
  }

  // Hanlde approve action, construct session namespace
  const onApprove = () => {
    WalletsStore.addWallets(selectedAccounts['eip155'])
    ModalStore.close()
  }

  // Handle reject action
  function onReject() {
    ModalStore.close()
  }

  // Render account selection checkboxes based on chain
  function renderAccountSelection(chain: string) {
    if (isEIP155Chain(chain)) {
      return (
        <WalletProposalSelectSection
          addresses={bitgoWallets}
          selectedAddresses={selectedAccounts[chain]}
          onSelect={onSelectAccount}
          chain={chain}
        />
      )
    }
  }

  useEffect(() => {
    const { accessToken } = data as any
    const bitgo = getBitGo()
    bitgo.authenticateWithAccessToken({ accessToken })
    bitgo
      .coin('gteth')
      .wallets()
      .list()
      .then(({ wallets }) => {
        const bitgoWallets = wallets.map(wallet => ({
          address: wallet.receiveAddress(),
          label: wallet.label()
        }))
        setBitGoWallets(bitgoWallets)
      })
      .catch(error => {
        console.log(error)
      })
  }, [])

  return (
    <Fragment>
      <RequestModalContainer title="Session Proposal">
        {renderAccountSelection('eip155')}
        <Divider y={2} />
      </RequestModalContainer>

      <Modal.Footer>
        <Button auto flat color="error" onClick={onReject}>
          Close
        </Button>

        <Button
          auto
          flat
          color="success"
          onPress={onApprove}
          disabled={!hasSelected}
          css={{ opacity: hasSelected ? 1 : 0.4 }}
        >
          Add
        </Button>
      </Modal.Footer>
    </Fragment>
  )
}
