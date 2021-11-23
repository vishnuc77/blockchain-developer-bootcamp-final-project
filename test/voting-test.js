const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting contract", function () {

    let votingContract;
    let voting;
    let owner;
    let alice;
    let bob;

    beforeEach(async function () {
        [owner, alice, bob] = await ethers.getSigners();
        tokenContract = await ethers.getContractFactory("Token")
        token = await tokenContract.deploy();
        votingContract = await ethers.getContractFactory("Voting")
        voting = await votingContract.deploy(token.address);
    })

    describe("Voting functionalities", function () {
        it("Should set the right owner", async function () {
            expect(await voting.owner()).to.equal(owner.address);
        })
    })
});
