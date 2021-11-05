function initiateProposal(bytes32 proposalName, bytes32 description) {
  // Function to initiate a new proposal upon which voting will happen
};

function startVoting(uint proposal) {
  // Function to open voting for a proposal
}

function vote(uint proposal, uint votingPower) {
  // Function to vote for a proposal. User can use upto maximum voting power available
}

function passOrFail(uint proposal) returns(bool){
  // Function to check whether a proposal got passed
}

modifier onlyStaker() {
  // Only users who have staked their tokens atleast for a month is allowed to do certain actions
  _;
}
