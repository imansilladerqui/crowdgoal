// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ERC20Mock
 * @dev Mock de token ERC20 para testing.
 * - Permite mint inicial para deployer.
 * - Funciona con Campaign.sol para tests de contribuciones y reembolsos.
 */
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Mock is ERC20 {
    constructor(
        string memory name_,
        string memory symbol_,
        address initialAccount,
        uint256 initialBalance
    ) ERC20(name_, symbol_) {
        _mint(initialAccount, initialBalance);
    }

    /// @notice Mint adicional, útil para tests
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}