use starknet::ContractAddress;

#[starknet::interface]
trait IWagerContract<TContractState> {
    fn bet(ref self: TContractState, text: felt252, amount: u256, resolution_date: u256, mediator: ContractAddress);
    fn accept(ref self: TContractState, id: u32);
    fn accept_ex(ref self: TContractState, text: felt252, predictor: ContractAddress, amount: u256, resolution_date: u256, mediator: ContractAddress, id: u32);
    // fn view(self: @TContractState) -> List<Wager>;
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
        wagers: List<Wager>,
        next_id: u32,
    }

    #[derive(Copy, Drop, Serde, starknet::Store)]
    struct Wager {
        text: felt252,
        amount: u256,
        predictor: ContractAddress,
        challenger: ContractAddress,
        resolution_date: u256,
        mediator: ContractAddress,
        id: u32,
        // parties: LegacyMap::<ContractAddress, bool>,
    }

    #[abi(embed_v0)]
    impl WagerContractImpl of super::IWagerContract<ContractState> {

         fn bet(ref self: ContractState, text: felt252, amount: u256, resolution_date: u256, mediator: ContractAddress) {
            assert(amount != 0, 'Amount cannot be 0');

            let mut current_wagers_list = self.wagers.read();
            let length = self.next_id.read();

            let mut new_wager = Wager{  text: text, amount: amount, predictor: get_caller_address(), challenger: get_caller_address(), 
                                    resolution_date: resolution_date, mediator: mediator, id: length };
            current_wagers_list.append(new_wager);
            
            self.next_id.write(length + 1);
        }

        fn accept_ex(ref self: ContractState, text: felt252, predictor: ContractAddress, amount: u256, resolution_date: u256, mediator: ContractAddress, id: u32){
            let mut current_wagers_list = self.wagers.read();
            let length = self.next_id.read();
            assert(id < length, 'Id must be within length');

            let current_wager = current_wagers_list[id];
            let new_wager = Wager {     text: text, 
                                        amount: amount, 
                                        predictor: predictor, 
                                        challenger: get_caller_address(), 
                                        resolution_date: resolution_date, 
                                        mediator: mediator, 
                                        id: id};
            current_wager_list.set(id, new_wager);
        }

        fn accept(ref self: ContractState, id: u32) {
            let mut current_wagers_list = self.wagers.read();
            let length = self.next_id.read();
            assert(id < length, 'Id must be within length');


            let current_wager = current_wagers_list[id];
            // assert(current_wager.challenger.read() == 0x0, 'Already a challenger');

            // Read from involved parties, challenger shouldn't exist yet
            // Afterward, set involvement to true
            // let challenger = get_caller_address();
            // assert(!current_wager.parties.read(challenger), 'party already involved');
            // current_wager.parties.write(challenger, true);

            // let new_wager = Wager {     text: current_wager.text, 
                                        //amount: current_wager.amount, 
                                        //predictor: current_wager.predictor, 
                                        //challenger: get_caller_address(), 
                                        //resolution_date: current_wager.resolution_date, 
                                        //mediator: current_wager.mediator, 
                                        //id: current_wager.length };
            // let new_wager = Wager{  text: current_wager.text, amount: current_wager.amount, predictor: current_wager.predictor, 
            //                        challenger: get_caller_address(), resolution_date: current_wager.resolution_date, mediator: current_wager.mediator, id: current_wager.length };
            // current_wager.challenger.write(get_caller_address());

            // current_wager_list.set(id, new_wager);
        }

        // View the list of wagers
        //fn view(self: @ContractState) -> List<Wager> {
        //    self.wagers.read();
        //}
    }
}
