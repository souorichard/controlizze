import { CirclePlus } from 'lucide-react'
import {
  ContainerContentTable,
  ContainerContentTableWrapper,
} from '@/components/container'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TransactionsList } from './transactions-list'

export function TransactionsView() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Input placeholder="Buscar por descrição" />
        <Button>
          <CirclePlus className="size-4" />
          Nova transação
        </Button>
      </div>

      <ContainerContentTable>
        <ContainerContentTableWrapper>
          <TransactionsList />
        </ContainerContentTableWrapper>
      </ContainerContentTable>
    </div>
  )
}
