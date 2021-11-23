import { ethers } from 'ethers';
import Voting from './Voting.json';
import Token from './Token.json';
import { useState } from 'react';
import './App.css';

function App() {
  const [ balance, setBalance ] = useState(0);
  const [ allowance, setAllowance ] = useState(0);
  const [ approveValue, setApproveValue ] = useState(0);
  const [ stakeValue, setStakeValue ] = useState(0);
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function fetchBalance() {
    if(typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(Token.address, Token.abi, signer);
      try {
        const balance = await contract.balanceOf(signer.getAddress());
        setBalance(balance.toString());
      } catch (err) {
        console.log('Error: ', err);
      }
    }
  }

  async function approve() {
    if (!approveValue) return
    if(typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(Token.address, Token.abi, signer);
      try {
        await contract.approve(Voting.address, approveValue);
      } catch (err) {
        console.log('Error: ', err);
      }
    }
  }

  async function getAllowance() {
    await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(Token.address, Token.abi, provider);
      try {
        const allowance = await contract.allowance(provider.getSigner().getAddress(), Voting.address);
        setAllowance(allowance.toString());
      } catch (err) {
        console.log('Error: ', err);
      }
  }

  async function stake() {
    if (!stakeValue) return
    if(typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(Voting.address, Voting.abi, signer);
      try {
        await contract.stake(stakeValue);
      } catch (err) {
        console.log('Error: ', err);
      }
    }
  }

  async function unstake() {
    if(typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(Voting.address, Voting.abi, signer);
      try {
        await contract.unstake();
      } catch (err) {
        console.log('Error: ', err);
      }
    }
  }

  return (
    <div className="App">
      <header className="App-header"><br />
        <button className="button" onClick={fetchBalance}>Get Balance</button><br /><br />
        <p>Balance: {balance}</p>
        <input type="text" onChange={e => setApproveValue(e.target.value)} placeholder="Set approve value" />&nbsp;
        <button className="button" onClick={approve}>Approve</button><br /><br />
        <button className="button" onClick={getAllowance}>Get Allowance</button><br /><br />
        <p>Allowance: {allowance}</p>
        <input type="text" onChange={e => setStakeValue(e.target.value)} placeholder="Set stake value" />&nbsp;
        <button className="button" onClick={stake}>Stake</button><br /><br />
        <button className="button" onClick={unstake}>Unstake</button><br /><br />
      </header>
    </div>
  );
}

export default App;