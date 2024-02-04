use starknet::ContractAddress;
// use array:ArrayTrait;

#[starknet::interface]
trait IWagerContract<TContractState> {
    fn bet(ref self: TContractState, text: felt252, amount: u256, predictor: ContractAddress, challenger: ContractAddress, resolution_date: u256, mediator: ContractAddress);
    // fn accept(self: @TContractState);
}

#[starknet::contract]
mod WagerContract {
    use alexandria_storage::list::{List, ListTrait};
    use starknet::get_caller_address;
    use traits::Into;
    use super::{IWagerContract, ContractAddress};

    #[storage]
    struct Storage {
        wagers: List<u256>
        //wagers: Array<u256>
    }

    struct Wager {
        text: felt252,
        amount: u256,
        predictor: ContractAddress,
        challenger: ContractAddress,
        resolution_date: u256,
        mediator: ContractAddress,
        id: u256,
    }

    #[abi(embed_v0)]
    impl WagerContractImpl of super::IWagerContract<ContractState> {

        fn bet(ref self: ContractState, text: felt252, amount: u256, predictor: ContractAddress, challenger: ContractAddress, resolution_date: u256, mediator: ContractAddress) {
            assert(amount != 0, 'Amount cannot be 0');
            assert(predictor != challenger, 'Parties must be different');
        }

        // fn accept(self: @ContractState) {
        //     
        // }
    }
}
