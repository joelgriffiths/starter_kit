import React, { Component } from 'react';
import logo from '../logo.png';
import Web3 from 'web3';
import './App.css';
import Navbar from './Navbar'

class App extends Component {

  constructor(props) {
      super(props)
      this.state = { items: [], text: '' }
      //this.handleChange = this.handleChange.bind(this)
      //this.handleSubmit = this.handleSubmit.bind(this)
  }

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    const ethBalance = await web3.eth.getBalance(accounts[0])
    this.setState({account: accounts[0], ethBalance})
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      try {
        // Request account access if needed
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access…
      }
    } else if (window.web3) {
      // Legacy dapp browsers…
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      // Non-dapp browsers…
      console.log(
        'Non-Ethereum browser detected. You should consider trying Status!'
      );
    }
    console.log(window.web3);
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account}/>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>Birdfart Swap</h1>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
