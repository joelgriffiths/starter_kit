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
        it('Allows users to purchase tokens from ethSwap for a fixed price', async () => {
            await ethSwap.buyTokens({ from: investor, value: web3.utils.toWei('1','ether')})
        })
    })
})