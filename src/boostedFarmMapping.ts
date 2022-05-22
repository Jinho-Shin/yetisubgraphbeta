import {BoostedFarm, Deposit} from "../generated/BoostedFarm/BoostedFarm"
import { newDeposit } from "../generated/schema"

export function handleDeposit(event: Deposit): void {
    let id = event.transaction.hash.toHex()
    let deposit = newDeposit.load(id)
    if (deposit == null) {
        deposit = new newDeposit(id)
    }
    deposit.user = event.params.user
    deposit.timestamp = event.block.timestamp
    const contract = BoostedFarm.bind(event.address)
    deposit.boostedPartition = contract.boostedPartition()
    deposit.rewardRate = contract.rewardRate()
    deposit.amountOfLP = contract.userInfo(event.params.user).value0
    deposit.userFactor = contract.userInfo(event.params.user).value2
    deposit.sumOfFactors = contract.sumOfFactors()
    deposit.save()
    
}