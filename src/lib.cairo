#[starknet::interface]
trait IWager<TContractState> {
    fn bet(ref self: TContractState, amount: u256);
    fn accept(self: @TContractState) -> u256;
}

#[starknet::contract]
mod HelloStarknet {
    #[storage]
    struct Storage {
        text: string,
        amount: u256,
        predictor: address,
        challenger: address,
        resolution_date: u256,
        mediator: address,
        id: u256,
    }

    #[abi(embed_v0)]
    impl Wager of super::IWager<ContractState> {
        fn bet(ref self: ContractState, text: string, amount: u256, predictor: address, challenger: address, resolution_date: u256, mediator: address) {
            assert(amount != 0, 'Amount cannot be 0');
            assert(predictor != challenger, "Challenger and predictor must be different");
            new_wager = new Wager(text, amount, predictor, challenger, resolution_date, mediator);
            wagers.add(new_wager);
           # self.balance.write(self.balance.read() + amount);
        }


        fn accept(self: @ContractState) -> felt252 {
            self.balance.read()
        }
    }
}
