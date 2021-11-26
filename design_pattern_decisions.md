# Design patterns used

## Access Control Design Patterns

- `Access Control (Ownable)` design pattern is used in Voting contract to restrict certain actions. These actions can only be performed by admin.

## Inheritance and Interfaces

- Voting contract inherits OpenZeppelin's `Ownable` contract for access control. Token contract inherits OpenZeppelin's `ERC20` and `Pausable` contracts.

## Inter-Contract Execution 

- Voting contract makes external contract function calls to Token contract.


