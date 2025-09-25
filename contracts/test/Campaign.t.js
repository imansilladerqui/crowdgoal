const { expect } = require("chai");
const { ethers } = require("hardhat");
const { parseEther } = require("ethers");

describe("Campaign", function () {
  let owner, backer1, backer2, feeRecipient;
  let Token, token;
  let Campaign, campaign;

  const goal = parseEther("100"); // 100 tokens
  const initialBalance = parseEther("1000"); // tokens for deployer/backers

  beforeEach(async function () {
    [owner, backer1, backer2, feeRecipient] = await ethers.getSigners();

    // Deploy ERC20 mock
    Token = await ethers.getContractFactory("ERC20Mock");
    token = await Token.deploy(
      "Test Token",
      "TTK",
      owner.address,
      initialBalance
    );

    // Deploy Campaign
    Campaign = await ethers.getContractFactory("Campaign");
    const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hora desde ahora
    campaign = await Campaign.deploy(
      owner.address,
      goal,
      deadline,
      token.address,
      feeRecipient.address,
      "ipfs://metadata"
    );

    // Distribuir tokens a backers
    await token.transfer(backer1.address, parseEther("500"));
    await token.transfer(backer2.address, parseEther("500"));
  });

  it("Should accept contributions", async function () {
    await token.connect(backer1).approve(campaign.address, parseEther("50"));
    await campaign.connect(backer1).contribute(parseEther("50"));

    expect(await campaign.totalRaised()).to.equal(parseEther("50"));
    expect(await campaign.contributions(backer1.address)).to.equal(
      parseEther("50")
    );
  });

  it("Should allow refunds if goal not reached", async function () {
    await token.connect(backer1).approve(campaign.address, parseEther("50"));
    await campaign.connect(backer1).contribute(parseEther("50"));

    // Simulate time passing
    await ethers.provider.send("evm_increaseTime", [3601]); // +1 hour
    await ethers.provider.send("evm_mine");

    const balanceBefore = await token.balanceOf(backer1.address);
    await campaign.connect(backer1).refund();
    const balanceAfter = await token.balanceOf(backer1.address);

    expect(balanceAfter.sub(balanceBefore)).to.equal(parseEther("50"));
  });

  it("Should allow creator to claim funds with fee if goal reached", async function () {
    // Backers contribuyen
    await token.connect(backer1).approve(campaign.address, parseEther("60"));
    await token.connect(backer2).approve(campaign.address, parseEther("50"));

    await campaign.connect(backer1).contribute(parseEther("60"));
    await campaign.connect(backer2).contribute(parseEther("50"));

    expect(await campaign.totalRaised()).to.equal(parseEther("110"));

    // Simulate time passing
    await ethers.provider.send("evm_increaseTime", [3601]);
    await ethers.provider.send("evm_mine");

    const balanceCreatorBefore = await token.balanceOf(owner.address);
    const balanceFeeBefore = await token.balanceOf(feeRecipient.address);

    await campaign.connect(owner).claimFunds();

    const balanceCreatorAfter = await token.balanceOf(owner.address);
    const balanceFeeAfter = await token.balanceOf(feeRecipient.address);

    const totalRaised = parseEther("110");
    const fee = totalRaised.mul(300).div(10000); // 3%
    const creatorAmount = totalRaised.sub(fee);

    expect(balanceCreatorAfter.sub(balanceCreatorBefore)).to.equal(
      creatorAmount
    );
    expect(balanceFeeAfter.sub(balanceFeeBefore)).to.equal(fee);
  });
});
