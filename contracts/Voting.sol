//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Token.sol";

/**
 * @title A voting contract for DAO governance
 * @author Vishnu C
 * @notice A simple voting implementation for DAO governance where uers have to stake tokens to vote
 */
contract Voting is Ownable {
    Token token;
    bool proposalLock = true;
    bool votingLock = true;

    event StakeEvent(address, uint256);
    event UnstakeEvent(address, uint256);

    struct Voter {
        uint256 amount;
        uint256 depositTime;
        bool voted;
        uint256 vote;
    }

    mapping(address => Voter) public voters;

    struct Proposal {
        bytes32 name;
        uint voteCount;
    }

    Proposal[] public proposals;

    /**
     * @dev Constructor for Stake contract
     * @param _addr Adress of the ERC20 token smart contract
     */
    constructor(address _addr) {
        token = Token(_addr);
    }

    /**
     * @dev Function for users to stake tokens
     * @param _amount Amount to be staked
     */
    function stake(uint256 _amount) public {
        voters[msg.sender].depositTime = block.timestamp;
        voters[msg.sender].amount += _amount;
        token.transferFrom(msg.sender, address(this), _amount);
        emit StakeEvent(msg.sender, _amount);
    }

    /**
     * @dev Function for users to unstake tokens
     * @param _amount Amount to be unstaked
     */
    function unstake(uint256 _amount) public {
        voters[msg.sender].amount -= _amount;
        token.transfer(msg.sender, _amount);
        emit UnstakeEvent(msg.sender, _amount);
    }

    /**
     * @dev Function for admin to lock invitation for proposals
     */
     function lockProposal() public onlyOwner {
         proposalLock = true;
     }

    /**
     * @dev Function for admin to unlock invitation for proposals
     */
     function unlockProposal() public onlyOwner {
         proposalLock = false;
     }

    /**
     * @dev Function for users to propose an idea
     * @param _proposalName Proposal that is being proposed
     */
     function proposeIdea(bytes32 _proposalName) public {
         uint256 votingPow = votingPower(msg.sender);
         require(votingPow > 0, "You don't have enough voting power to propose an idea");
         proposals.push(Proposal({
                name: _proposalName,
                voteCount: 0
            }));
     }

    /**
     * @dev Internal function to calculate voting power of an address
     * @param _addr Address for whom voting power needs to be calculated
     * @return Voting power in integer format
     */
     function votingPower(address _addr) view internal returns(uint256) {
         if(block.timestamp - voters[_addr].depositTime < 30 days || voters[_addr].amount == 0) {
             return 0;
         } else {
             if(block.timestamp - voters[_addr].depositTime >= 90 days) {
                 return  (2*voters[_addr].amount);
             } else {
                 return voters[_addr].amount;
             }
         }
     }

    /**
     * @dev Function for owner to unlock voting so that voting can start
     */
     function unlockVoting() public onlyOwner {
         votingLock = true;
     }

    /**
     * @dev Function for owner to lock voting so that voting can stop
    */
     function lockVoting() public onlyOwner {
         votingLock = false;
     }

    /**
     * @dev Function for users to vote
     * @param _proposalIndex Index of the proposal for which the user wants to vote
     */
     function vote(uint256 _proposalIndex) external {
         require(voters[msg.sender].voted == false, "You already voted");
         uint256 votingPow = votingPower(msg.sender);
         require(votingPow > 0, "You don't have the voting power to vote");
         voters[msg.sender].voted = true;
         voters[msg.sender].vote = _proposalIndex;
         proposals[_proposalIndex].voteCount += votingPow;
     }

    /**
     * @dev Function for Owner to find the winning proposal
     * @return Name of the winning proposal
     */
     function findWinningProposal() public view onlyOwner returns(bytes32) {
        uint256 winningVoteCount = 0;
        uint256 winningProposal;
        for (uint256 i = 0; i < proposals.length; i++) {
            if (proposals[i].voteCount > winningVoteCount) {
                winningVoteCount = proposals[i].voteCount;
                winningProposal = i;
            }
        }
        return proposals[winningProposal].name;
     }
}