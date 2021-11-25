import { ethers } from 'ethers';
import Voting from './Voting.json';
import Token from './Token.json';
import { useState } from 'react';
import './App.css';

function App() {
  const [ balance, setBalance ] = useState(0);
  const [ isadmin, setIsadmin ] = useState(false);
  const [ allowance, setAllowance ] = useState(0);
  const [ approveValue, setApproveValue ] = useState(0);
  const [ stakeValue, setStakeValue ] = useState(0);
  const [ proposalLock, setProposalLock ] = useState(true);
  const [ votingLock, setVotingLock ] = useState(true);
  const [proposals, setProposals ] = useState([]);
  const [ voteValue, setVoteValue ] = useState(0);
  const [ idea, setIdea ] = useState(ethers.utils.formatBytes32String(""));
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider1 = new ethers.providers.Web3Provider(window.ethereum);
    const signer1 = provider1.getSigner();
    const contract = new ethers.Contract(Voting.address, Voting.abi, signer1);
    const token = new ethers.Contract(Token.address, Token.abi, signer1);
    const owner = await contract.owner();
    const connectedAddress = await signer1.getAddress();
    const allowance = await token.allowance(provider1.getSigner().getAddress(), Voting.address);
    const balance = await token.balanceOf(signer1.getAddress());
    const p = await contract.proposalLock();
    setProposalLock(p);
    setBalance(balance.toString());
    setAllowance(allowance.toString());
    if(owner === connectedAddress) {
      setIsadmin(true);
    } else {
      setIsadmin(false);
    }
  }

  // async function fetchBalance() {
  //   if(typeof window.ethereum !== 'undefined') {
  //     await requestAccount();
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const signer = provider.getSigner();
  //     const contract = new ethers.Contract(Token.address, Token.abi, signer);
  //     try {
  //       const balance = await contract.balanceOf(signer.getAddress());
  //       setBalance(balance.toString());
  //     } catch (err) {
  //       console.log('Error: ', err);
  //     }
  //   }
  // }

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

  // async function getAllowance() {
  //   await requestAccount();
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const contract = new ethers.Contract(Token.address, Token.abi, provider);
  //     try {
  //       const allowance = await contract.allowance(provider.getSigner().getAddress(), Voting.address);
  //       setAllowance(allowance.toString());
  //     } catch (err) {
  //       console.log('Error: ', err);
  //     }
  // }

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

  async function unlockProposalInvitation() {
    if(typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(Voting.address, Voting.abi, signer);
      try {
        await contract.unlockProposal();
        setProposalLock(0);
      } catch (err) {
        console.log('Error: ', err);
      }
    }
  }

  async function lockProposalInvitation() {
    if(typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(Voting.address, Voting.abi, signer);
      try {
        await contract.lockProposal();
        setProposalLock(1);
      } catch (err) {
        console.log('Error: ', err);
      }
    }
  }

  async function isProposalLocked() {
    if(typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(Voting.address, Voting.abi, signer);
      try {
        const proposalLockValue = await contract.proposalLock();
        console.log(proposalLockValue);
        setProposalLock(proposalLockValue);
        console.log(proposalLock);
      } catch (err) {
        console.log('Error: ', err);
      }
    }
  }

  async function inviteIdea() {
    if (!idea) return
    if(typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(Voting.address, Voting.abi, signer);
      try {
        await contract.proposeIdea(idea);
      } catch (err) {
        console.log('Error: ', err);
      }
    }
  }

  async function listAllProposals() {
    if(typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(Voting.address, Voting.abi, signer);
      try {
        const proposalList = await contract.listProposals();
        setProposals(proposalList);
        console.log(ethers.utils.parseBytes32String(proposalList[0].name));
      } catch (err) {
        console.log('Error: ', err);
      }
    }
  }

  async function unlockVotingProcess() {
    if(typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(Voting.address, Voting.abi, signer);
      try {
        await contract.unlockVoting();
        setVotingLock(false);
      } catch (err) {
        console.log('Error: ', err);
      }
    }
  }

  async function lockVotingProcess() {
    if(typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(Voting.address, Voting.abi, signer);
      try {
        await contract.lockVoting();
        setVotingLock(true);
      } catch (err) {
        console.log('Error: ', err);
      }
    }
  }

  async function vote() {
    if (!voteValue) return
    if(typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(Voting.address, Voting.abi, signer);
      try {
        await contract.vote(voteValue);
      } catch (err) {
        console.log('Error: ', err);
      }
    }
  }

  async function findWinningProposal() {
    if(typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(Voting.address, Voting.abi, signer);
      try {
        const name = await contract.findWinningProposal();
        console.log(ethers.utils.parseBytes32String(name));
      } catch (err) {
        console.log('Error: ', err);
      }
    }
  }
  
  return (
    <div className="App">
      <header className="App-header"><br />
      <button className="button" onClick={requestAccount}>Connect</button><br />
        {/* <button className="button" onClick={fetchBalance}>Get Balance</button><br /><br /> */}
        <p>Balance: {balance} &nbsp; &nbsp; Allowance: {allowance}</p>
        <p>Proposal lock: {proposalLock ? "Yes" : "No"}</p>
        <p>Voting lock: {votingLock ? "Yes" : "No"}</p>
        <input type="text" onChange={e => setApproveValue(e.target.value)} placeholder="Set approve value" />
        <button className="button" onClick={approve}>Approve</button><br /><br />
        {/* <button className="button" onClick={getAllowance}>Get Allowance</button><br /><br /> */}
        <input type="text" onChange={e => setStakeValue(e.target.value)} placeholder="Set stake value" />
        <button className="button" onClick={stake}>Stake</button><br />
        <button className="button" onClick={unstake}>Unstake</button><br />
        { isadmin
          ? <div>
              <button onClick={isProposalLocked}>Proposal locked?</button><br />
              <button onClick={unlockProposalInvitation}>Unlock Proposal</button><br />
              <button onClick={lockProposalInvitation}>Lock Proposal</button><br />
              <button onClick={listAllProposals}>List proposals</button><br />
              <button onClick={unlockVotingProcess}>Unlock Voting</button><br />
              <button onClick={lockVotingProcess}>Lock Voting</button><br />
              <button onClick={findWinningProposal}>Winning proposal</button><br />
            </div>
          : <div>
              <input onChange={e => setIdea(ethers.utils.formatBytes32String(e.target.value))} placeholder="Proposal" />&nbsp;
              <button onClick={inviteIdea}>Propose Idea</button><br />
              <input onChange={e => setVoteValue(e.target.value)} placeholder="Proposal index" />&nbsp;
              <button onClick={vote}>Vote</button><br /><br />
            </div>
        }
      </header>
    </div>
  );
}

export default App;