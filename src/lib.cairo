use starknet::ContractAddress;

#[starknet::interface]
trait IWagerContract<TContractState> {
    fn bet(ref self: TContractState, text: felt252, amount: u256, resolution_date: u256, mediator: ContractAddress);
    fn accept(ref self: TContractState, id: u32);
    fn get_wager(self: @TContractState, id: u32) -> (felt252, u256, ContractAddress, ContractAddress, ContractAddress, u256);
}

#[starknet::contract]
mod WagerContract {

    use alexandria_storage::list::{List, ListTrait};
    use starknet::get_caller_address;
    use starknet::contract_address_try_from_felt252;
    use traits::Into;
    use super::{IWagerContract, ContractAddress};

    #[storage]
    struct Storage {
        texts: LegacyMap::<u32, felt252>,
        amounts: LegacyMap::<u32, u256>,
        predictors: LegacyMap::<u32, ContractAddress>,
        challengers: LegacyMap::<u32, ContractAddress>,
        mediators: LegacyMap::<u32, ContractAddress>,
        resolution_dates: LegacyMap::<u32, u256>,
        next_id: u32,
    }

    #[abi(embed_v0)]
    impl WagerContractImpl of super::IWagerContract<ContractState> {

         fn bet(ref self: ContractState, text: felt252, amount: u256, resolution_date: u256, mediator: ContractAddress) {
            assert(amount != 0, 'Amount cannot be 0');

            let id = self.next_id.read(); 

            self.texts.write(id, text);
            self.amounts.write(id, amount);
            self.predictors.write(id, get_caller_address());
            self.mediators.write(id, mediator);
            self.resolution_dates.write(id, amount);

            self.next_id.write(id + 1);
        }

        fn accept(ref self: ContractState, id: u32) {
            let length = self.next_id.read();
            assert(id < length, 'Id must be within length');

            self.challengers.write(id, get_caller_address());
        }

        fn get_wager(self: ContractState, id: u32) -> (felt252, u256, ContractAddress, ContractAddress, ContractAddress, u256) {
            (self.texts.read(id), self.amounts.read(id), self.predictors.read(id), self.challengers.read(id), self.mediators.read(id), self.resolution_dates.read(id))
        }
    }
}
