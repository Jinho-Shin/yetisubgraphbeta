import {BorrowOperation, TroveCreated, TroveUpdated, YUSDBorrowingFeePaid, VariableFeePaid} from '../generated/Yeti-Test/BorrowOperation'
import {TroveManager } from '../generated/TroveManager/TroveManager'
import { newTrove, updatedTrove, YUSDPaid, VariablePaid} from '../generated/schema'
import { Address, ethereum, Bytes} from '@graphprotocol/graph-ts'


export function handleTroveCreated(event: TroveCreated): void {
  let trove = new newTrove(event.block.hash.toHex())
  trove.borrower = event.params._borrower
  trove.arrayIndex = event.params.arrayIndex
  trove.transaction = event.transaction.hash
  trove.timestamp = event.block.timestamp
  trove.save()
}

function addressToBytes(address: Address): Bytes {
  return Bytes.fromHexString(address.toHexString())
}

var BorrowerOperation = ["openTrove", "closeTrove", "adjustTrove"]


export function handleTroveUpdated(event: TroveUpdated): void {
  let id = event.transaction.hash.toHex()
  let trove = updatedTrove.load(id)
  if (trove == null) {
    trove = new updatedTrove(id)
    trove.borrower = event.params._borrower
    trove.debt = event.params._debt
    trove.amounts = event.params._amounts
    trove.transaction = event.transaction.hash
    trove.timestamp = event.block.timestamp
    trove.operation = BorrowerOperation[event.params.operation]
    trove.tokens =  event.params._tokens.map<Bytes>((token) => {return addressToBytes(token)})
    trove.managed = 1
    trove.save()
  } else {
    trove.borrower = event.params._borrower
    trove.debt = event.params._debt
    trove.amounts = event.params._amounts
    trove.transaction = event.transaction.hash
    trove.timestamp = event.block.timestamp
    trove.operation = BorrowerOperation[event.params.operation]
    trove.tokens =  event.params._tokens.map<Bytes>((token) => {return addressToBytes(token)})
    let contract = TroveManager.bind(Address.fromBytes(trove.eventAddress))
    trove.currentICR = contract.getCurrentICR(Address.fromBytes(trove.borrower))
    trove.managed = 2
    trove.save()
  }
  
}

export function handleYUSDPaid(event: YUSDBorrowingFeePaid): void {
  let id = event.block.hash.toHex()
  let yusdPaid =  new YUSDPaid(id)
  yusdPaid.borrower = event.params._borrower
  yusdPaid.fee = event.params._YUSDFee
  yusdPaid.transaction = event.transaction.hash
  yusdPaid.timestamp = event.block.timestamp
  yusdPaid.save()
}

export function handleVariablePaid(event: VariableFeePaid): void {
  let id = event.block.hash.toHex()
  let variablePaid =  new VariablePaid(id)
  variablePaid.borrower = event.params._borrower
  variablePaid.fee = event.params._YUSDVariableFee
  variablePaid.transaction = event.transaction.hash
  variablePaid.timestamp = event.block.timestamp
  variablePaid.save()
}


