// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor() ERC20("RAY", "RAY") {
        _mint(msg.sender, 1000000000000000000000);//1000
    }

    function freeToMint() public {
        _mint(msg.sender, 10000000000000000000);//10
    }

    function approve(address owner, uint256 amount) public override returns (bool) {
        address spender = _msgSender();
        _approve(owner, spender, amount);
        return true;
    }
}
