const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting contract", function () {

    let votingContract;
    let voting;
    let owner;
    let alice;
    let bob;

    beforeEach(async function () {
        [owner, alice, bob, carol] = await ethers.getSigners();
        tokenContract = await ethers.getContractFactory("Token")
        token = await tokenContract.deploy();
        votingContract = await ethers.getContractFactory("Voting")
        voting = await votingContract.deploy(token.address);
    })

    describe("Voting functionalities", function () {
        it("Should set the right owner", async function () {
            expect(await voting.owner()).to.equal(owner.address);
        });

        it("Should be able to stake tokens", async function () {
            await token.transfer(alice.address, 1000000);
            const aliceBalance = await token.connect(alice).balanceOf(alice.address);
            await token.connect(alice).approve(voting.address, 1000000);
            await voting.connect(alice).stake(100000);
            expect(await token.balanceOf(alice.address)).to.equal(aliceBalance-100000);
        });

        it("Should be able to unstake tokens", async function () {
            await token.transfer(alice.address, 1000000);
            const aliceBalance = await token.connect(alice).balanceOf(alice.address);
            await token.connect(alice).approve(voting.address, 1000000);
            await voting.connect(alice).stake(100000);
            await voting.connect(alice).unstake();
            expect(await token.balanceOf(alice.address)).to.equal(aliceBalance);
        });

        it("Should be able to propose ideas when proposalLock is false", async function () {
            await token.transfer(alice.address, 1000000);
            await token.connect(alice).approve(voting.address, 1000000);
            await voting.connect(alice).stake(500000);

            await ethers.provider.send("evm_increaseTime", [31 * 24 * 60 * 60]);
            await ethers.provider.send("evm_mine", []);

            await voting.unlockProposal();

            let bytes32 = ethers.utils.formatBytes32String("Introduction of ETH asset");
            await voting.connect(alice).proposeIdea(bytes32);
            await expect(voting.proposals(0)).to.not.be.reverted;
        });

        it("Should not be able to propose ideas when proposalLock is true", async function () {
            await token.transfer(alice.address, 1000000);
            await token.connect(alice).approve(voting.address, 1000000);
            await voting.connect(alice).stake(500000);

            await ethers.provider.send("evm_increaseTime", [31 * 24 * 60 * 60]);
            await ethers.provider.send("evm_mine", []);

            let bytes32 = ethers.utils.formatBytes32String("Introduction of ETH asset");
            await expect(voting.connect(alice).proposeIdea(bytes32)).to.be.revertedWith("Cannot propose now since proposalLock is true");
        });

        it("Should not be able to propose idea when no token is staked", async function () {
            await token.transfer(alice.address, 1000000);
            await ethers.provider.send("evm_increaseTime", [31 * 24 * 60 * 60]);
            await ethers.provider.send("evm_mine", []);
            await voting.unlockProposal();
            let bytes32 = ethers.utils.formatBytes32String("Introduction of ETH asset");
            await expect(voting.connect(alice).proposeIdea(bytes32)).to.be.revertedWith("You don't have enough voting power to propose an idea");
        });

        it("Should not be able to propose idea when token is not staked for 30 days", async function () {
            await token.transfer(alice.address, 1000000);
            await token.connect(alice).approve(voting.address, 1000000);
            await voting.connect(alice).stake(500000);

            await ethers.provider.send("evm_increaseTime", [29 * 24 * 60 * 60]);
            await ethers.provider.send("evm_mine", []);

            await voting.unlockProposal();
            let bytes32 = ethers.utils.formatBytes32String("Introduction of ETH asset");
            await expect(voting.connect(alice).proposeIdea(bytes32)).to.be.revertedWith("You don't have enough voting power to propose an idea");
        });

        it("Should be able to vote when votingLock is false", async function () {
            await token.transfer(alice.address, 1000000);
            await token.connect(alice).approve(voting.address, 1000000);
            await voting.connect(alice).stake(500000);

            await ethers.provider.send("evm_increaseTime", [31 * 24 * 60 * 60]);
            await ethers.provider.send("evm_mine", []);

            await voting.unlockProposal();

            let bytes32 = ethers.utils.formatBytes32String("Introduction of ETH asset");
            await voting.connect(alice).proposeIdea(bytes32);

            await voting.unlockVoting();

            await expect(voting.connect(alice).vote(0)).to.not.be.reverted;
        });

        it("Should not be able to vote when votingLock is true", async function () {
            await token.transfer(alice.address, 1000000);
            await token.connect(alice).approve(voting.address, 1000000);
            await voting.connect(alice).stake(500000);

            await ethers.provider.send("evm_increaseTime", [31 * 24 * 60 * 60]);
            await ethers.provider.send("evm_mine", []);

            await voting.unlockProposal();

            let bytes32 = ethers.utils.formatBytes32String("Introduction of ETH asset");
            await voting.connect(alice).proposeIdea(bytes32);

            await expect(voting.connect(alice).vote(0)).to.be.revertedWith("Cannot vote now since votingLock is true");
        });

        it("Should not be able to vote when no tokens are staked", async function () {
            await token.transfer(alice.address, 1000000);
            await token.connect(alice).approve(voting.address, 1000000);
            await voting.connect(alice).stake(500000);

            await token.transfer(bob.address, 1000000);

            await ethers.provider.send("evm_increaseTime", [31 * 24 * 60 * 60]);
            await ethers.provider.send("evm_mine", []);

            await voting.unlockProposal();

            let bytes32 = ethers.utils.formatBytes32String("Introduction of ETH asset");
            await voting.connect(alice).proposeIdea(bytes32);

            await voting.unlockVoting();

            await expect(voting.connect(bob).vote(0)).to.be.revertedWith("You don't have the voting power to vote");
        });

        it("Should not be able to vote when tokens are staked for less than 30 days", async function () {
            await token.transfer(alice.address, 1000000);
            await token.connect(alice).approve(voting.address, 1000000);
            await voting.connect(alice).stake(500000);

            await token.transfer(bob.address, 1000000);

            await ethers.provider.send("evm_increaseTime", [31 * 24 * 60 * 60]);
            await ethers.provider.send("evm_mine", []);

            await token.connect(bob).approve(voting.address, 1000000);
            await voting.connect(bob).stake(500000);

            await ethers.provider.send("evm_increaseTime", [29 * 24 * 60 * 60]);
            await ethers.provider.send("evm_mine", []);

            await voting.unlockProposal();

            let bytes32 = ethers.utils.formatBytes32String("Introduction of ETH asset");
            await voting.connect(alice).proposeIdea(bytes32);

            await voting.unlockVoting();

            await expect(voting.connect(bob).vote(0)).to.be.revertedWith("You don't have the voting power to vote");
        });

        it("Should be able to find the winning proposal", async function () {
            await token.transfer(carol.address, 1000000);
            await token.connect(carol).approve(voting.address, 1000000);
            await voting.connect(carol).stake(500000);

            await ethers.provider.send("evm_increaseTime", [100 * 24 * 60 * 60]);
            await ethers.provider.send("evm_mine", []);

            await token.transfer(alice.address, 1000000);
            await token.connect(alice).approve(voting.address, 1000000);
            await voting.connect(alice).stake(500000);

            await token.transfer(bob.address, 1000000);
            await token.connect(bob).approve(voting.address, 1000000);
            await voting.connect(bob).stake(500000);

            await ethers.provider.send("evm_increaseTime", [31 * 24 * 60 * 60]);
            await ethers.provider.send("evm_mine", []);

            await voting.unlockProposal();

            let bytes32_1 = ethers.utils.formatBytes32String("Introduction of ETH asset");
            await voting.connect(alice).proposeIdea(bytes32_1);

            let bytes32_2 = ethers.utils.formatBytes32String("Introduction of BTC asset");
            await voting.connect(bob).proposeIdea(bytes32_2);

            await voting.unlockVoting();

            await expect(voting.connect(bob).vote(1));
            await expect(voting.connect(carol).vote(0));

            let winner = await voting.findWinningProposal();
            expect(winner).to.be.equal(ethers.utils.formatBytes32String("Introduction of ETH asset"));
        });

        it("Should be able to delete proposals", async function () {
            await token.transfer(carol.address, 1000000);
            await token.connect(carol).approve(voting.address, 1000000);
            await voting.connect(carol).stake(500000);

            await ethers.provider.send("evm_increaseTime", [100 * 24 * 60 * 60]);
            await ethers.provider.send("evm_mine", []);

            await token.transfer(alice.address, 1000000);
            await token.connect(alice).approve(voting.address, 1000000);
            await voting.connect(alice).stake(500000);

            await token.transfer(bob.address, 1000000);
            await token.connect(bob).approve(voting.address, 1000000);
            await voting.connect(bob).stake(500000);

            await ethers.provider.send("evm_increaseTime", [31 * 24 * 60 * 60]);
            await ethers.provider.send("evm_mine", []);

            await voting.unlockProposal();

            let bytes32_1 = ethers.utils.formatBytes32String("Introduction of ETH asset");
            await voting.connect(alice).proposeIdea(bytes32_1);

            let bytes32_2 = ethers.utils.formatBytes32String("Introduction of BTC asset");
            await voting.connect(bob).proposeIdea(bytes32_2);

            await voting.unlockVoting();

            await voting.connect(bob).vote(1);
            await voting.connect(carol).vote(0);

            let addr_bob = await voting.votersList(0);
            let vote_true = await voting.voters(addr_bob);
            expect(vote_true.voted).to.equal(true);

            await voting.findWinningProposal();
            await voting.deleteProposals();
            let proposals = await voting.listProposals();
            expect(proposals.length).to.equal(0);

            let vote_false = await voting.voters(addr_bob);
            expect(vote_false.voted).to.equal(false);
        });
    })
});
