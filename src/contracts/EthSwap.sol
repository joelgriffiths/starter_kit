pragma solidity >=0.5.0;

import "./Token.sol";

contract EthSwap {
    string public name = "EthSwap Instant Exchange";
    Token public token;

    // 100 ERC-20 per ETH
    uint public rate = 100;

    constructor(Token _token) public {
        token = _token;
    }

    function buyTokens() public payable {
        // Amount of ETH * Redemption Rate
        // Redemption rate = # tokens for one ETH
        uint tokenAmount = msg.value * rate;
        token.transfer(msg.sender, tokenAmount);
    }
}