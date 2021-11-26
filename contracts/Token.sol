//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC20, Pausable, Ownable {
    /**
     * @dev Constructor for Token contract
     */
    constructor() ERC20("Vote coin", "VOTE"){
        _mint(owner(), 10000 * 10 ** 5);
    }

    /**
     * @dev Function to be used by owner to mint new tokens
     * @param to Address to which newly minted tokens should go
     * @param amount Quantity of token to be minted
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev Function to be used by owner to pause
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @dev Function to be used by owner to unpause
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev Function which returns the decimals of the ERC20 token
     */
    function decimals() public pure override returns (uint8) {
        return 5;
    }

    /**
     * @dev Function which will be executed before token transfer
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal whenNotPaused override {
        super._beforeTokenTransfer(from, to, amount);
    }    
}