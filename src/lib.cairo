use starknet::ContractAddress;

#[derive(Drop, Serde, starknet::Store)]
enum target {
    blockTime: u128,
    amount: u128,
}

#[starknet::interface]
trait IERC20<TContractState> {
    fn name(self: @TContractState) -> felt252;
    fn symbol(self: @TContractState) -> felt252;
    fn decimals(self: @TContractState) -> u8;
    fn total_supply(self: @TContractState) -> u256;
    fn balanceOf(self: @TContractState, account: ContractAddress) -> u256;
    fn allowance(self: @TContractState, owner: ContractAddress, spender: ContractAddress) -> u256;
    fn transfer(ref self: TContractState, recipient: ContractAddress, amount: u256) -> bool;
    fn transferFrom(
        ref self: TContractState, sender: ContractAddress, recipient: ContractAddress, amount: u256
    ) -> bool;
    fn approve(ref self: TContractState, spender: ContractAddress, amount: u256) -> bool;
}

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
    use traits::Into;
    use core::option::OptionTrait;
    use core::traits::TryInto;
    use starknet::{get_caller_address, ContractAddress, get_contract_address, Zeroable, get_block_timestamp, contract_address_const};

    use super::{IERC20Dispatcher, IERC20DispatcherTrait, target};

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

    #[constructor]
    fn constructor(ref self: ContractState) {
        self.texts.write(0, 'we win hackathon');
        self.amounts.write(0, 200);
        self.resolution_dates.write(0, 2024);
        self.predictors.write(0, contract_address_const::<0>());
        self.challengers.write(0, contract_address_const::<0>());
        self.mediators.write(0, contract_address_const::<0>());
        self.winners.write(0, contract_address_const::<0>());
        self.next_id.write(1);

        self.texts.write(1, 'hit pubertty');
        self.amounts.write(1, 200);
        self.resolution_dates.write(1, 2030);
        self.predictors.write(1, contract_address_const::<0>());
        self.challengers.write(1, contract_address_const::<0>());
        self.mediators.write(1, contract_address_const::<0>());
        self.winners.write(1, contract_address_const::<0>());
        self.next_id.write(2);
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
