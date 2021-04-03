const { assert } = require('chai')
const { default: Web3 } = require('web3')

const Token = artifacts.require('Token')
const EthSwap = artifacts.require('EthSwap')

// Configures assertion?
require('chai')
  .use(require('chai-as-promised'))
  .should()

function tokens(n) {
    return web3.utils.toWei(n, 'ether')
}

contract('EthSwap', ([deployer, investor]) => {
    let token, ethSwap
    let orig_tokenBalance, orig_ethSwapBalance

    before(async () => {
        token = await Token.new()    
        ethSwap = await EthSwap.new(token.address)    

        orig_tokenBalance = await token.balanceOf(token.address)
        orig_ethSwapBalance = await token.balanceOf(ethSwap.address)
        await token.transfer(ethSwap.address, tokens('1000000'))
    })

    describe('Token deployment', async () => {
        it('contract has a name', async () => {
            const name = await token.name()
            assert.equal(name, "DApp Token")
        })
    })

    describe('EthSwap deployment', async () => {
        it('contract has a name', async () => {
            const name = await ethSwap.name()
            assert.equal(name, "EthSwap Instant Exchange")
        })
    })

    it('contract has tokens', async () => {
        let balance = await token.balanceOf(ethSwap.address)
        assert.equal(balance, tokens('1000000'))
    })

    describe('buyTokens()', async () => {
        let result

        // Purchase tokens before each test
        before(async () => {
            result = await ethSwap.buyTokens({ from: investor, value: web3.utils.toWei('0.1','ether') })
        })

        it('Allows users to purchase tokens from ethSwap for a fixed price', async () => {
            let investorBalance = await token.balanceOf(investor)
            assert.equal(investorBalance.toString(), tokens('10'))

            // Confirm investor lost money
            let tokenEthSwapBalance = await token.balanceOf(ethSwap.address)
            assert.equal(tokenEthSwapBalance.toString(), tokens('999990'))

            // Did the exchange receive the 0.1 ETH?
            let exchangeBalance = await web3.eth.getBalance(ethSwap.address)
            assert.equal(exchangeBalance.toString(), web3.utils.toWei('0.1', 'ether'))

            const event = result.logs[0].args
            assert.equal(event.account, investor)
            assert.equal(event.token, token.address)
            assert.equal(event.amount.toString(), tokens('10').toString())
            assert.equal(event.rate.toString(), '100')
        })
    })

    describe('sellTokens()', async () => {
        let result

        // Purchase tokens before each test
        before(async () => {
            await token.approve(ethSwap.address, tokens('10'), {from: investor})
            result = await ethSwap.sellTokens(tokens('10'), { from: investor })
        })

        it('Allows users to sell tokens to ethSwap for a fixed price', async () => {

            // Confirm the investor no longer has tokens
            let investorBalance = await token.balanceOf(investor)
            assert.equal(investorBalance.toString(), tokens('0'))

            // Confirm investor got his money back
            let tokenEthSwapBalance = await token.balanceOf(ethSwap.address)
            assert.equal(tokenEthSwapBalance.toString(), tokens('1000000'))

            // Did the exchange ETH balance go back to 0
            let exchangeBalance = await web3.eth.getBalance(ethSwap.address)
            assert.equal(exchangeBalance.toString(), '0')

            // Confirm event is emitted with the correct data
            const event = result.logs[0].args
            assert.equal(event.account, investor)
            assert.equal(event.token, token.address)
            assert.equal(event.amount.toString(), tokens('10').toString())
            assert.equal(event.rate.toString(), '100')

            // Test if investor tries to sell too many tokens
            await ethSwap.sellTokens(tokens('500'), { from: investor }).should.be.rejected
        })
    })
})