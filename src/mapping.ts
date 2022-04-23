import { TroveCreated } from '../generated/Yeti-Test/Yeti'
import { Trove } from '../generated/Yeti-Test/Yeti'

export function handleTroveCreated(event: TroveCreated): void {
  let trove = new Trove(event.params.id.toHex())
  trove.borrower = event.params._borrower
  trove.arrayIndex = event.params.arrayIndex
  trove.save()
}