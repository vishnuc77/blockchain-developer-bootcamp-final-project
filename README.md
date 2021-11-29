# DAO Governance

## Deployed application URL:

https://voting3.vercel.app/

## Running the project locally:

### Prerequisites

- Node.js >= 14
- Hardhat
- `git checkout main`

### Smart contracts

- Run `npm install` in project root
- Create .env file in project root with the following content:
    `PRIVATE_KEY=<provide-account-private-key-here>`
- Run `npx hardhat test` to run tests
- Run `npx hardhat run --network rinkeby scripts/deploy.js` to deploy the contracts in rinkeby

### Front-end

- Run `cd frontend` in project root
- `npm install`
- `npm start`
- Open `http://localhost:3000`
  
## Screencast link
https://www.loom.com/share/1a1288fcb17a494399180ef4bbb986c7?sharedAppSource=personal_library
  
## Project description

DAO Governance, as the name suggests is a platform which can be used for the governance of DAOs. There are two main functionalities here, suggest a proposal and vote for the proposals. Now coming to how it works. There is a native 'VOTE' ERC-20 token which only the owner of the smart contract gets. Owner can send these tokens to any users. Users who have the VOTE tokens can stake these tokens in the platform to get voting power. Tokens need to be locked in the platform for atleast 30 days to get voting power (since this is difficult to test, for now it is set to 2 mins). Voting power will be equal to the number of the tokens locked in the system, if the user had locked the tokens for less than 90 days and greater than 30 days. If the user has locked the token for more than 90 days, then the voting power will be two times the number of tokens staked.<br /><br />
The first stage is when admin unlocks the proposal lock, then any user having voting power will be able to suggest proposals. After giving enough time admin will lock the proposal lock and after that users will not be able to suggest new proposals. Once voting time is decided, admin can unlock voting lock, so then any user with voting power can start voting. Once the voting time ends, admin will lock the voting and can find the winning proposal. Winning proposal can be communicated to the community and then admin can delete all the already existing proposals. The same cycle can continue whenever new proposals need to be selected.

## A simple workflow

- Admin deploys the smart contracts
- Admin sends VOTE token to different users in the community (smart contract address of ERC-20 token can be found in frontend/Token.json or in the logs while deploying)
- Users approve allowance and stake tokens
- Admin unlocks the proposal lock
- Users propose ideas (Need to wait atleast 2 mins after staking)
- Admin locks the proposal lock
- Admin unlocks the voting lock
- Users can list all proposals and vote for any proposal by providing proposal index number
- Admin locks the voting lock
- Admin finds the winning proposal
- Admin delete all proposals
    
## Environment Variables
    
``` 
PRIVATE_KEY= 
```

## Directory structure

- frontend: Frontend of the project
- contracts: Smart contracts of the projects
- scripts: Script for deploying the smart contracts
- test: Tests for smart contracts
    
## To-do features
    
- NFT raffle for users who staked tokens
- Modify calculation of voting power, so that voting power degrades over time
- Update the front end so that user gets a notification whenever transaction succeeds and error message when transaction fails

## Public Ethereum wallet for certification:

`0x3Bf95B4945272cd94f795DD18beA45696f359986`
