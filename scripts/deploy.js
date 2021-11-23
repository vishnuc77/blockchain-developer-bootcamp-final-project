const fs = require('fs');

async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy();
    const ownerBalance = await token.balanceOf(deployer.address);
    votingContract = await ethers.getContractFactory("Voting")
    voting = await votingContract.deploy(token.address);
  
    console.log("Token smart contract address:", token.address);
    console.log("Balance of owner:", ownerBalance.toString());
    console.log("Voting smart contract address:", voting.address);

    const data_voting = {
        address: voting.address,
        abi: JSON.parse(voting.interface.format('json'))
    };
    fs.writeFileSync('frontend/src/Voting.json', JSON.stringify(data_voting));
  
    const data_token = {
        address: token.address,
        abi: JSON.parse(token.interface.format('json'))
    };
    fs.writeFileSync('frontend/src/Token.json', JSON.stringify(data_token));
}
    
main()
    .then(() => process.exit(0))
    .catch((error) => {
    console.error(error);
    process.exit(1);
    });