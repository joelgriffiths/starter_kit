pragma solidity >=0.5.0;

import "./Token.sol";

contract EthSwap {
    string public name = "EthSwap Instant Exchange";
    Token public token;

    // 100 ERC-20 per ETH
    uint public rate = 100;

    event TokensPurchased(
        address account,  // Who purchased
        address token,    // Address of token
        uint amount,      // Amount
        uint rate         // Rate
    );

    event TokensSold(
        address account,  // Who purchased
        address token,    // Address of token
        uint amount,      // Amount
        uint rate         // Rate
    );

    constructor(Token _token) public {
        token = _token;
    }

    function buyTokens() public payable {
        // Amount of ETH * Redemption Rate
        // Redemption rate = # tokens for one ETH
        uint tokenAmount = msg.value * rate;
        token.transfer(msg.sender, tokenAmount);

        require(token.balanceOf(address(this)) >= tokenAmount);

        // Emit an event
        emit TokensPurchased(msg.sender, address(token), tokenAmount, rate);
    }


    // _amount = # tokens - not amount of ETH
    function sellTokens(uint _amount) public {
        // Amount of ETH to redeem
        uint ethAmount = _amount / rate;

        // Does investor have enough tokens for this trade
        require(token.balanceOf(msg.sender) >= _amount);

        // Do we have enough ETH to complete this trade
        require(address(this).balance >= ethAmount);

        // Remove the tokens from investor's wallet
        token.transferFrom(msg.sender, address(this), _amount);

        // Return ETH to the investor
        msg.sender.transfer(ethAmount);

        // Emit an event
        emit TokensSold(msg.sender, address(token), _amount, rate);
    }
}