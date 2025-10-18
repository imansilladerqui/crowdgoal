// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Custom IERC20 interface
interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

// Custom ReentrancyGuard
contract ReentrancyGuard {
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

    modifier nonReentrant() {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }
}

// Custom Ownable
contract Ownable {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor(address initialOwner) {
        _owner = initialOwner;
        emit OwnershipTransferred(address(0), initialOwner);
    }

    modifier onlyOwner() {
        require(_owner == msg.sender, "Ownable: caller is not the owner");
        _;
    }

    function owner() public view returns (address) {
        return _owner;
    }

    function renounceOwnership() public onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}

// Custom SafeERC20 functionality
library SafeERC20 {
    function safeTransfer(IERC20 token, address to, uint256 value) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transfer.selector, to, value));
    }

    function safeTransferFrom(IERC20 token, address from, address to, uint256 value) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transferFrom.selector, from, to, value));
    }

    function _callOptionalReturn(IERC20 token, bytes memory data) private {
        // Use low-level call instead of functionCall (not available in 0.8.19)
        (bool success, bytes memory returndata) = address(token).call(data);
        require(success, "SafeERC20: low-level call failed");
        
        if (returndata.length > 0) {
            require(abi.decode(returndata, (bool)), "SafeERC20: ERC20 operation did not succeed");
        }
    }
}

contract CampaignFactory is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;
    
    enum CampaignStatus { Active, Successful, Failed, Finalized }
    
    struct Campaign {
        uint256 id;
        address authorWallet;
        address token;
        uint256 goal;
        uint256 raised;
        uint256 expiringDate;
        CampaignStatus status;
        bool fundsWithdrawn;
        string authorName;
        string title;
        string description;
        string metadataURI;
    }

    uint256 public constant PLATFORM_FEE_PERCENTAGE = 3; // 3% platform fee
    
    Campaign[] public campaigns;
    mapping(uint256 => mapping(address => uint256)) public donations;
    mapping(uint256 => address[]) public campaignDonors;
    
    event CampaignCreated(uint256 indexed id, address indexed authorWallet, string authorName, string title, string description, uint256 goal, uint256 expiringDate, address token, string metadataURI);
    event DonationReceived(uint256 indexed campaignId, address indexed donor, uint256 amount);
    event FundsWithdrawn(uint256 indexed campaignId, address indexed recipient, uint256 amount, uint256 platformFee);
    event RefundClaimed(uint256 indexed campaignId, address indexed donor, uint256 amount);

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
        require(_author != address(0), "Author address cannot be zero");
        require(bytes(authorName).length > 0 && bytes(authorName).length <= 50, "Author name must be 1-50 characters");
        require(bytes(title).length > 0 && bytes(title).length <= 100, "Title must be 1-100 characters");
        require(bytes(description).length > 0 && bytes(description).length <= 500, "Description must be 1-500 characters");
        require(goal > 0, "Goal must be greater than zero");
        require(goal <= 100000 ether, "Goal cannot exceed 100,000 ether");
        require(expiringDate > block.timestamp, "Expiring date must be in the future");
        require(expiringDate <= block.timestamp + 90 days, "Campaign cannot last more than 90 days");
        
        // Validate token address if not ETH
        if (token != address(0)) {
            // Check if token has code (is a contract)
            uint256 codeSize;
            assembly {
                codeSize := extcodesize(token)
            }
            require(codeSize > 0, "Token address is not a contract");
            
            // Try to call totalSupply to verify it's a valid ERC20
            try IERC20(token).totalSupply() returns (uint256) {
                // Token exists and is valid
            } catch {
                revert("Invalid ERC20 token");
            }
        }
        
        uint256 campaignId = campaigns.length;
        
        campaigns.push(
            Campaign({
                id: campaignId,
                authorWallet: _author,
                token: token,
                goal: goal,
                raised: 0,
                expiringDate: expiringDate,
                status: CampaignStatus.Active,
                fundsWithdrawn: false,
                authorName: authorName,
                title: title,
                description: description,
                metadataURI: metadataURI
            })
        );

        emit CampaignCreated(
            campaignId,
            _author,
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
        require(amount <= 10000 ether, "Donation cannot exceed 10,000 ether");
        
        // Handle ETH donations
        if (campaign.token == address(0)) {
            require(msg.value == amount, "Sent value does not match amount");
        } 
        // Handle ERC20 token donations
        else {
            require(msg.value == 0, "Cannot send ETH for token campaigns");
            
            // Transfer tokens from donor to contract
            IERC20 token = IERC20(campaign.token);
            uint256 balanceBefore = token.balanceOf(address(this));
            token.safeTransferFrom(msg.sender, address(this), amount);
            uint256 balanceAfter = token.balanceOf(address(this));
            
            // Verify the actual amount transferred
            amount = balanceAfter - balanceBefore;
            require(amount > 0, "Token transfer failed");
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
        require(campaign.raised > 0, "No funds to withdraw");
        
        campaign.fundsWithdrawn = true;
        
        // Calculate platform fee (3% of raised amount) - safe from overflow
        uint256 platformFee = (campaign.raised * PLATFORM_FEE_PERCENTAGE) / 100;
        uint256 authorAmount = campaign.raised - platformFee;
        
        // Additional safety checks
        require(authorAmount <= campaign.raised, "Author amount calculation error");
        require(platformFee <= campaign.raised, "Platform fee calculation error");
        
        // Transfer funds to campaign author and platform
        if (campaign.token == address(0)) {
            // Check contract has enough ETH balance
            require(address(this).balance >= campaign.raised, "Insufficient contract balance");
            
            // Send platform fee to contract owner
            if (platformFee > 0) {
                (bool feeSuccess, ) = owner().call{value: platformFee}("");
                require(feeSuccess, "Platform fee transfer failed");
            }
            
            // Send remaining funds to campaign author
            if (authorAmount > 0) {
                (bool authorSuccess, ) = campaign.authorWallet.call{value: authorAmount}("");
                require(authorSuccess, "Author payment transfer failed");
            }
        } else {
            IERC20 token = IERC20(campaign.token);
            
            // Check contract has enough token balance
            require(token.balanceOf(address(this)) >= campaign.raised, "Insufficient token balance");
            
            // Send platform fee to contract owner
            if (platformFee > 0) {
                token.safeTransfer(owner(), platformFee);
            }
            
            // Send remaining funds to campaign author
            if (authorAmount > 0) {
                token.safeTransfer(campaign.authorWallet, authorAmount);
            }
        }
        
        campaign.status = CampaignStatus.Finalized;
        
        emit FundsWithdrawn(campaignId, campaign.authorWallet, authorAmount, platformFee);
    }
    
    // Function for users to claim refunds from failed campaigns
    function claimRefund(uint256 campaignId) public nonReentrant {
        require(campaignId < campaigns.length, "Campaign does not exist");
        Campaign storage campaign = campaigns[campaignId];
        
        // Update campaign status first
        _updateCampaignStatus(campaignId);
        
        require(campaign.status == CampaignStatus.Failed, "Campaign must have failed to claim refund");
        
        uint256 donationAmount = donations[campaignId][msg.sender];
        require(donationAmount > 0, "No donation amount to refund");
        
        // Reset donation amount before transfer
        donations[campaignId][msg.sender] = 0;
        
        // Transfer refund to donor
        if (campaign.token == address(0)) {
            // Check contract has enough ETH balance
            require(address(this).balance >= donationAmount, "Insufficient contract balance for refund");
            
            (bool success, ) = msg.sender.call{value: donationAmount}("");
            require(success, "Refund transfer failed");
        } else {
            IERC20 token = IERC20(campaign.token);
            
            // Check contract has enough token balance
            require(token.balanceOf(address(this)) >= donationAmount, "Insufficient token balance for refund");
            
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
    
    // Emergency function to withdraw stuck ETH (only owner)
    function emergencyWithdrawETH() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH to withdraw");
        
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Emergency withdrawal failed");
    }
    
    // Emergency function to withdraw stuck tokens (only owner)
    function emergencyWithdrawToken(address token) external onlyOwner {
        IERC20 tokenContract = IERC20(token);
        uint256 balance = tokenContract.balanceOf(address(this));
        require(balance > 0, "No tokens to withdraw");
        
        tokenContract.safeTransfer(owner(), balance);
    }
    
    // Function to check if a campaign exists
    function campaignExists(uint256 campaignId) public view returns (bool) {
        return campaignId < campaigns.length;
    }
    
    // Function to get contract ETH balance
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
    // Function to get contract token balance
    function getContractTokenBalance(address token) public view returns (uint256) {
        if (token == address(0)) {
            return address(this).balance;
        }
        return IERC20(token).balanceOf(address(this));
    }
}
