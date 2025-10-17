// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "remix_tests.sol"; 
import "remix_accounts.sol";
import "../contracts/CampaignFactory.sol";

contract CampaignFactoryTest {
    CampaignFactory factory;
    address owner;
    address addr1;
    address addr2;

    function beforeAll() public {
        owner = TestsAccounts.getAccount(0);
        addr1 = TestsAccounts.getAccount(1);
        addr2 = TestsAccounts.getAccount(2);
        factory = new CampaignFactory();
    }

    function testCreateCampaign() public {
        // Use a specific address for testing if needed
        address expectedAuthor = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;
        uint goal = 1 ether;
        uint expiringDate = block.timestamp + 1 days;
        address token = address(0);
        string memory authorName = "Test Author";
        string memory title = "Test Title";
        string memory description = "Test Description";
        string memory metadataURI = "ipfs://test";

        uint campaignId = factory.createCampaign(
            expectedAuthor,
            authorName,
            title,
            description,
            goal,
            expiringDate,
            token,
            metadataURI
        );
        Assert.equal(campaignId, uint(0), "First campaign ID should be 0");

        CampaignFactory.Campaign memory campaign = factory.getCampaign(campaignId);

        Assert.equal(campaign.id, uint(0), "Campaign ID should be 0");
        Assert.equal(campaign.authorWallet, expectedAuthor, "Author wallet should be owner");
        Assert.equal(campaign.title, title, "Title should match");
        Assert.equal(campaign.goal, goal, "Goal should match");
    }

    function testDonateEth() public payable {
        // Create a campaign
        factory.createCampaign(
            address(this),  // Use test contract as author for simplicity
            "Test Author",
            "Test Campaign",
            "Description",
            10 ether,
            block.timestamp + 30 days,
            address(0),  // ETH
            "ipfs://QmTest"
        );
        
        // Donate a small amount to avoid balance issues
        uint256 campaignId = 0;
        uint256 donationAmount = 0.01 ether;
        
        // Donate with matching value
        factory.donate{value: donationAmount}(campaignId, donationAmount);
        
        // No assertions - just check if it reverts
    }

    function testFailDonateToNonExistentCampaign() public {
        try factory.donate(999, 1 ether) {
            Assert.ok(false, "Should revert for non-existent campaign");
        } catch Error(string memory reason) {
            Assert.equal(reason, "Campaign does not exist", "Revert reason should match");
        }
    }

    function testFailDonateZeroAmount() public {
        try factory.donate(0, 0) {
            Assert.ok(false, "Should revert for zero donation");
        } catch Error(string memory reason) {
            Assert.equal(reason, "Donation amount must be greater than zero", "Revert reason should match");
        }
    }

    function testFailCreateCampaignZeroGoal() public {
        uint expiringDate = block.timestamp + 1 days;
        try factory.createCampaign(0x5B38Da6a701c568545dCfcB03FcB875f56beddC4, "Author", "Title", "Desc", 0, expiringDate, address(0), "ipfs://meta") {
            Assert.ok(false, "Should revert for zero goal");
        } catch Error(string memory reason) {
            Assert.equal(reason, "Goal must be greater than zero", "Revert reason should match");
        }
    }

    function testFailCreateCampaignPastExpiry() public {
        uint goal = 1 ether;
        uint expiringDate = block.timestamp - 100;
        try factory.createCampaign(0x5B38Da6a701c568545dCfcB03FcB875f56beddC4, "Author", "Title", "Desc", goal, expiringDate, address(0), "ipfs://meta") {
            Assert.ok(false, "Should revert for past expiry");
        } catch Error(string memory reason) {
            Assert.equal(reason, "Expiring date must be in the future", "Revert reason should match");
        }
    }

    /// Additional tests

    function testDonateEthAndWithdrawByAuthor() public {
        // Create a campaign with low goal and author as this contract
        uint256 goal = 1;
        uint256 expiringDate = block.timestamp + 1 days;
        uint256 campaignId = factory.createCampaign(
            address(this),
            "Author",
            "Title",
            "Desc",
            goal,
            expiringDate,
            address(0),
            "ipfs://meta"
        );

        // Donate exact goal in ETH
        factory.donate{value: goal}(campaignId, goal);

        // Withdraw as author
        factory.withdrawFunds(campaignId);

        // Check campaign finalized and withdrawn
        CampaignFactory.Campaign memory c = factory.getCampaign(campaignId);
        Assert.equal(uint(c.status), uint(CampaignFactory.CampaignStatus.Finalized), "Campaign should be finalized after withdraw");
        Assert.ok(c.fundsWithdrawn, "Funds should be marked withdrawn");
    }

    function testFailWithdrawNotAuthor() public {
        // Author is addr1, but we will try to withdraw from this contract
        uint256 goal = 1;
        uint256 expiringDate = block.timestamp + 1 days;
        uint256 campaignId = factory.createCampaign(
            addr1,
            "Author",
            "Title",
            "Desc",
            goal,
            expiringDate,
            address(0),
            "ipfs://meta"
        );
        // Fund it to success
        factory.donate{value: goal}(campaignId, goal);

        try factory.withdrawFunds(campaignId) {
            Assert.ok(false, "Only author should be able to withdraw");
        } catch Error(string memory reason) {
            Assert.equal(reason, "Only campaign author can withdraw funds", "Revert reason should match");
        }
    }

    function testFailClaimRefundWhenActive() public {
        // Create active campaign
        uint256 campaignId = factory.createCampaign(
            address(this),
            "Author",
            "Title",
            "Desc",
            100,
            block.timestamp + 1 days,
            address(0),
            "ipfs://meta"
        );

        try factory.claimRefund(campaignId) {
            Assert.ok(false, "Refund should revert when not failed");
        } catch Error(string memory reason) {
            Assert.equal(reason, "Campaign must have failed to claim refund", "Revert reason should match");
        }
    }

    function testFailCreateCampaignWithNonContractToken() public {
        uint goal = 1 ether;
        uint expiringDate = block.timestamp + 1 days;
        // Use EOA address as token, should fail extcodesize check
        address eoaTokenLike = addr2;
        try factory.createCampaign(addr1, "Author", "Title", "Desc", goal, expiringDate, eoaTokenLike, "ipfs://meta") {
            Assert.ok(false, "Should revert for non-contract token address");
        } catch Error(string memory reason) {
            Assert.equal(reason, "Token address is not a contract", "Revert reason should match");
        }
    }

    function testFailDonateMismatchValue() public {
        uint256 campaignId = factory.createCampaign(
            address(this),
            "Author",
            "Title",
            "Desc",
            100,
            block.timestamp + 1 days,
            address(0),
            "ipfs://meta"
        );
        // Send wrong msg.value vs amount
        try factory.donate{value: 1}(campaignId, 2) {
            Assert.ok(false, "Should revert for value mismatch");
        } catch Error(string memory reason) {
            Assert.equal(reason, "Sent value does not match amount", "Revert reason should match");
        }
    }
}