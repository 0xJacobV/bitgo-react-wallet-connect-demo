import AccountSelectCard from '@/components/AccountSelectCard'
import { Checkbox, Col, Row, Text } from '@nextui-org/react'
import WalletSelectCard from './WalletSelectCard'

/**
 * Types
 */
interface IProps {
  chain: string
  addresses: { address: string; label: string }[]
  selectedAddresses: { address: string; label: string }[] | undefined
  onSelect: (address: string, label: string) => void
}

/**
 * Component
 */
export default function WalletProposalSelectSection({
  addresses,
  selectedAddresses,
  chain,
  onSelect
}: IProps) {
  return (
    <Row>
      <Col>
        <Text h4 css={{ marginTop: '$5' }}>{`Choose ${chain} accounts`}</Text>
          {addresses.map((wallet, index) => (
            <WalletSelectCard
              key={wallet.address}
              address={wallet.address}
              label={wallet.label}
              index={index}
              onSelect={() => onSelect(wallet.address, wallet.label)}
              selected={
                selectedAddresses?.find(selected => selected.address === wallet.address) !==
                  undefined ?? false
              }
            />
          ))}
      </Col>
    </Row>
  )
}
