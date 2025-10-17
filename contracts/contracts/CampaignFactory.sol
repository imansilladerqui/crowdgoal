// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CampaignFactory is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;
    
    enum CampaignStatus { Active, Successful, Failed, Finalized }
    
    struct Campaign {
        uint256 id;
        address authorWallet;
        string authorName;
        string title;
        string description;
        uint256 goal;
        uint256 raised;
        uint256 expiringDate;
        address token;
        string metadataURI;
        CampaignStatus status;
        bool fundsWithdrawn;
    }

    uint256 public constant PLATFORM_FEE_PERCENTAGE = 3; // 3% platform fee
    
    Campaign[] public campaigns;
    mapping(uint256 => mapping(address => uint256)) public donations;
    mapping(uint256 => address[]) public campaignDonors;
    
    event CampaignCreated(
        uint256 indexed id,
        address indexed authorWallet,
        string authorName,
        string title,
        string description,
        uint256 goal,
        uint256 expiringDate,
        address token,
        string metadataURI
    );
    
    event DonationReceived(
        uint256 indexed campaignId,
        address indexed donor,
        uint256 amount
    );
    
    event FundsWithdrawn(
        uint256 indexed campaignId,
        address indexed recipient,
        uint256 amount,
        uint256 platformFee
    );
    
    event RefundClaimed(
        uint256 indexed campaignId,
        address indexed donor,
        uint256 amount
    );

    event CampaignFinalized(
        uint256 indexed campaignId,
        CampaignStatus status
    );
    
    event PlatformFeeCollected(
        uint256 indexed campaignId,
        uint256 amount,
        address token
    );

    constructor() Ownable(msg.sender) {}

    function createCampaign(
        address _author,
        string memory authorName,
        string memory title,
        string memory description,
        uint256 goal,
        uint256 expiringDate,
        address token,
        string memory metadataURI
    ) public returns (uint256) {
        require(goal > 0, "Goal must be greater than zero");
        require(expiringDate > block.timestamp, "Expiring date must be in the future");
        
        // Validate token address if not ETH
        if (token != address(0)) {
            // Basic check to ensure token is a contract
            uint256 size;
            assembly { size := extcodesize(token) }
            require(size > 0, "Token address is not a contract");
        }
        
        uint256 campaignId = campaigns.length;
        
        campaigns.push(
            Campaign({
                id: campaignId,
                authorWallet: _author,
                authorName: authorName,
                title: title,
                description: description,
                goal: goal,
                raised: 0,
                expiringDate: expiringDate,
                token: token,
                metadataURI: metadataURI,
                status: CampaignStatus.Active,
                fundsWithdrawn: false
            })
        );

        emit CampaignCreated(
            campaignId,
            msg.sender,
            authorName,
            title,
            description,
            goal,
            expiringDate,
            token,
            metadataURI
        );
        
        return campaignId;
    }
    
    function donate(uint256 campaignId, uint256 amount) public payable nonReentrant {
        require(campaignId < campaigns.length, "Campaign does not exist");
        Campaign storage campaign = campaigns[campaignId];
        
        // Update status before accepting donation
        _updateCampaignStatus(campaignId);
        
        require(campaign.status == CampaignStatus.Active, "Campaign is not active");
        require(amount > 0, "Donation amount must be greater than zero");
        
        // Handle ETH donations
        if (campaign.token == address(0)) {
            require(msg.value == amount, "Sent value does not match amount");
        } 
        // Handle ERC20 token donations
        else {
            require(msg.value == 0, "ETH not accepted for token campaigns");
            
            // Transfer tokens from donor to contract
            IERC20 token = IERC20(campaign.token);
            uint256 balanceBefore = token.balanceOf(address(this));
            token.safeTransferFrom(msg.sender, address(this), amount);
            uint256 balanceAfter = token.balanceOf(address(this));
            
            // Verify the actual amount transferred
            amount = balanceAfter - balanceBefore;
            require(amount > 0, "No tokens were transferred");
        }
        
        // If this is the first donation from this user, add to donors list
        if (donations[campaignId][msg.sender] == 0) {
            campaignDonors[campaignId].push(msg.sender);
        }
        
        donations[campaignId][msg.sender] += amount;
        campaign.raised += amount;
        
        // Check if campaign goal has been reached
        if (campaign.raised >= campaign.goal) {
            campaign.status = CampaignStatus.Successful;
        }
        
        emit DonationReceived(campaignId, msg.sender, amount);
    }
    
    function withdrawFunds(uint256 campaignId) public nonReentrant {
        require(campaignId < campaigns.length, "Campaign does not exist");
        Campaign storage campaign = campaigns[campaignId];
        
        // Update campaign status first
        _updateCampaignStatus(campaignId);
        
        require(campaign.authorWallet == msg.sender, "Only campaign author can withdraw funds");
        require(campaign.status == CampaignStatus.Successful, "Campaign must be successful to withdraw funds");
        require(!campaign.fundsWithdrawn, "Funds have already been withdrawn");
        
        campaign.fundsWithdrawn = true;
        
        // Calculate platform fee (3% of raised amount)
        uint256 platformFee = (campaign.raised * PLATFORM_FEE_PERCENTAGE) / 100;
        uint256 authorAmount = campaign.raised - platformFee;
        
        // Transfer funds to campaign author and platform
        if (campaign.token == address(0)) {
            // Send platform fee to contract owner
            (bool feeSuccess, ) = owner().call{value: platformFee}("");
            require(feeSuccess, "Platform fee transfer failed");
            
            // Send remaining funds to campaign author
            (bool authorSuccess, ) = campaign.authorWallet.call{value: authorAmount}("");
            require(authorSuccess, "Author payment transfer failed");
        } else {
            IERC20 token = IERC20(campaign.token);
            
            // Send platform fee to contract owner
            token.safeTransfer(owner(), platformFee);
            
            // Send remaining funds to campaign author
            token.safeTransfer(campaign.authorWallet, authorAmount);
        }
        
        campaign.status = CampaignStatus.Finalized;
        
        emit PlatformFeeCollected(campaignId, platformFee, campaign.token);
        emit FundsWithdrawn(campaignId, campaign.authorWallet, authorAmount, platformFee);
        emit CampaignFinalized(campaignId, campaign.status);
    }
    
    // Function for users to claim refunds from failed campaigns
    function claimRefund(uint256 campaignId) public nonReentrant {
        require(campaignId < campaigns.length, "Campaign does not exist");
        Campaign storage campaign = campaigns[campaignId];
        
        // Update campaign status first
        _updateCampaignStatus(campaignId);
        
        require(campaign.status == CampaignStatus.Failed, "Campaign must have failed to claim refund");
        
        uint256 donationAmount = donations[campaignId][msg.sender];
        require(donationAmount > 0, "No donations to refund");
        
        // Reset donation amount before transfer
        donations[campaignId][msg.sender] = 0;
        
        // Transfer refund to donor
        if (campaign.token == address(0)) {
            (bool success, ) = msg.sender.call{value: donationAmount}("");
            require(success, "ETH refund transfer failed");
        } else {
            IERC20 token = IERC20(campaign.token);
            token.safeTransfer(msg.sender, donationAmount);
        }
        
        emit RefundClaimed(campaignId, msg.sender, donationAmount);
    }
    
    function _updateCampaignStatus(uint256 campaignId) internal {
        Campaign storage campaign = campaigns[campaignId];
        
        if (campaign.status == CampaignStatus.Active) {
            if (block.timestamp >= campaign.expiringDate) {
                if (campaign.raised >= campaign.goal) {
                    campaign.status = CampaignStatus.Successful;
                } else {
                    campaign.status = CampaignStatus.Failed;
                }
            }
        }
    }
    
    // External function to manually update campaign status
    function updateCampaignStatus(uint256 campaignId) public {
        require(campaignId < campaigns.length, "Campaign does not exist");
        _updateCampaignStatus(campaignId);
    }

    function getAllCampaigns() public view returns (Campaign[] memory) {
        return campaigns;
    }
    
    function getCampaign(uint256 campaignId) public view returns (Campaign memory) {
        require(campaignId < campaigns.length, "Campaign does not exist");
        return campaigns[campaignId];
    }
    
    function getDonation(uint256 campaignId, address donor) public view returns (uint256) {
        return donations[campaignId][donor];
    }
    
    function getCampaignDonors(uint256 campaignId) public view returns (address[] memory) {
        return campaignDonors[campaignId];
    }
    
    // Allow the contract to receive ETH
    receive() external payable {}
}