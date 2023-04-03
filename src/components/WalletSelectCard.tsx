import { truncate } from '@/utils/HelperUtil'
import { Card, Checkbox, Row, Text } from '@nextui-org/react'

/**
 * Types
 */
interface IProps {
  address: string
  index: number
  label: string
  selected: boolean
  onSelect: () => void
}

/**
 * Component
 */
export default function WalletSelectCard({ address, label, selected, index, onSelect }: IProps) {
  return (
    <Card
      isPressable
      onPress={onSelect}
      key={address}
      css={{
        marginTop: '$5',
        backgroundColor: selected ? 'rgba(23, 200, 100, 0.2)' : '$accents2'
      }}
    >
      <Card.Body>
        <Row justify="space-between" align="center">
          <Checkbox size="lg" color="success" isSelected={selected}>
            <Text>{`${truncate(address, 14)} - ${truncate(label, 25)}`} </Text>
          </Checkbox>
        </Row>
      </Card.Body>
    </Card>
  )
}
