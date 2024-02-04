use starknet::ContractAddress;

#[starknet::interface]
trait IWagerContract<TContractState> {
    fn bet(ref self: TContractState, text: felt252, amount: u256, resolution_date: u256, mediator: ContractAddress);
    fn accept(ref self: TContractState, id: u32);
    fn decide(ref self: TContractState, id: u32, winner: ContractAddress);

    // Getters
    fn get_text(self: @TContractState, id: u32) -> felt252;
    fn get_amount(self: @TContractState, id: u32) -> u256;
    fn get_resolution_date(self: @TContractState, id: u32) -> u256;
    fn get_predictor(self: @TContractState, id: u32) -> ContractAddress; 
    fn get_challenger(self: @TContractState, id: u32) -> ContractAddress; 
    fn get_mediator(self: @TContractState, id: u32) -> ContractAddress; 
    fn get_winner(self: @TContractState, id: u32) -> ContractAddress; 
}

#[starknet::contract]
mod WagerContract {

    use alexandria_storage::list::{List, ListTrait};
    use starknet::get_caller_address;
    use traits::Into;
    use super::{IWagerContract, ContractAddress};

    #[storage]
    struct Storage {
        texts: LegacyMap::<u32, felt252>,
        amounts: LegacyMap::<u32, u256>,
        predictors: LegacyMap::<u32, ContractAddress>,
        challengers: LegacyMap::<u32, ContractAddress>,
        mediators: LegacyMap::<u32, ContractAddress>,
        winners: LegacyMap::<u32, ContractAddress>,
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
            assert(0 <= id && id < self.next_id.read(), 'Invalid ID');
            assert(self.challengers.read(id).is_zero(), 'Challenger already set');

            self.challengers.write(id, get_caller_address());
        }

        fn decide(ref self: ContractState, id: u32, winner: ContractAddress){
            assert(get_caller_address() == self.mediators.read(id), 'Permission denied');
            assert(winner == self.predictors.read(id) || winner == self.challengers.read(id), 'Invalid winner');
            self.winners.write(id, winner); 
        }

        fn get_text(self: @ContractState, id: u32) -> felt252 {
            assert(0 <= id && id < self.next_id.read(), 'Invalid ID');
            self.texts.read(id)
        }
        fn get_amount(self: @ContractState, id: u32) -> u256 {
            assert(0 <= id && id < self.next_id.read(), 'Invalid ID');
            self.amounts.read(id)
        }
        fn get_resolution_date(self: @ContractState, id: u32) -> u256 {
            assert(0 <= id && id < self.next_id.read(), 'Invalid ID');
            self.resolution_dates.read(id)
        }
        fn get_predictor(self: @ContractState, id: u32) -> ContractAddress {
            assert(0 <= id && id < self.next_id.read(), 'Invalid ID');
            self.predictors.read(id) 
        }
        fn get_challenger(self: @ContractState, id: u32) -> ContractAddress {
            assert(0 <= id && id < self.next_id.read(), 'Invalid ID');
            self.challengers.read(id)
        }
        fn get_mediator(self: @ContractState, id: u32) -> ContractAddress {
            assert(0 <= id && id < self.next_id.read(), 'Invalid ID');
            self.mediators.read(id)
        } 
        fn get_winner(self: @ContractState, id: u32) -> ContractAddress {
            assert(0 <= id && id < self.next_id.read(), 'Invalid ID');
            self.mediators.read(id)
        } 
    }
}
