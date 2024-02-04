%lang starknet
from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.uint256 import Uint256

@contract
struct Bet:
    id: felt
    challenger: felt
    predictor: felt
    stake: Uint256
    resolution_date: felt
    mediator: felt
    mediator_deposit: Uint256

# Assuming a maximum of 1250 bets
const MAX_BETS = 1250

@storage_var
func bets(index: felt) -> (bet: Bet):
end

@storage_var
func bet_counter() -> (counter: felt):
end

@external
func create_bet(challenger: felt, predictor: felt, stake: Uint256, resolution_date: felt, mediator: felt) -> (bet_id: felt):
    let (counter) = bet_counter.read()
    assert counter < MAX_BETS, "Max bets reached"
    
    let mediator_deposit = Uint256(stake.low // 2, stake.high // 2)  # Assuming stake is a Uint256 for larger amounts
    let bet = Bet(id=counter, challenger=challenger, predictor=predictor, stake=stake, resolution_date=resolution_date, mediator=mediator, mediator_deposit=mediator_deposit)
    
    bets.write(counter, bet)
    bet_counter.write(counter + 1)
    
    return (counter)

@external
func resolve_bet(bet_id: felt, winner: felt):
    let (bet) = bets.read(bet_id)
    # Add logic to resolve the bet, transfer funds, and handle mediator's deposit