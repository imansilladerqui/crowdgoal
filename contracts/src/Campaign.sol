// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Campaign
 * @dev Crowdfunding contract for an individual campaign.
 * - Users can contribute with tokens.
 * - If the goal is reached before the deadline, the creator can withdraw the funds.
 * - If not reached, users can claim a refund.
 * - The platform receives a 3% commission on successful campaigns.
 */

interface IERC20 {
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function transfer(address to, uint256 value) external returns (bool);
}

contract Campaign {
    // ---------------------------
    // Public variables
    // ---------------------------
    address public creator;          // campaign owner
    uint256 public goal;             // fundraising goal (in tokens)
    uint256 public deadline;         // deadline (timestamp)
    uint256 public totalRaised;      // total raised
    address public token;            // token used (e.g., CHZ or stablecoin)
    bool public claimed;             // whether the creator already withdrew the funds
    string public metadataURI;       // link to JSON on IPFS with project info

    mapping(address => uint256) public contributions; // track contributions

    // Fixed commission (3%)
    uint256 public constant FEE_PERCENT = 300; // 300 = 3% with base 10000
    uint256 public constant FEE_DENOMINATOR = 10000;
    address public feeRecipient; // CrowdGoal wallet

    // ---------------------------
    // Events
    // ---------------------------
    event Contributed(address indexed backer, uint256 amount);
    event Refunded(address indexed backer, uint256 amount);
    event FundsClaimed(address indexed creator, uint256 creatorAmount, uint256 feeAmount);

    // ---------------------------
    // Constructor
    // ---------------------------
    constructor(
        address _creator,
        uint256 _goal,
        uint256 _deadline,
        address _token,
        address _feeRecipient,
        string memory _metadataURI
    ) {
        require(_deadline > block.timestamp, "Deadline must be in the future");
        require(_goal > 0, "Goal must be greater than 0");

        creator = _creator;
        goal = _goal;
        deadline = _deadline;
        token = _token;
        feeRecipient = _feeRecipient;
        metadataURI = _metadataURI;
    }

    // ---------------------------
    // Main functions
    // ---------------------------

    /// @notice Contribute with `amount` tokens to the campaign
    function contribute(uint256 amount) external {
        require(block.timestamp < deadline, "Campaign ended");
        require(amount > 0, "Amount must be > 0");

        IERC20(token).transferFrom(msg.sender, address(this), amount);

        contributions[msg.sender] += amount;
        totalRaised += amount;

        emit Contributed(msg.sender, amount);
    }

    /// @notice Creator claims funds if the goal is reached
    function claimFunds() external {
        require(msg.sender == creator, "Only creator can claim");
        require(block.timestamp >= deadline || totalRaised >= goal, "Campaign not ended or goal not met");
        require(totalRaised >= goal, "Goal not reached");
        require(!claimed, "Funds already claimed");

        claimed = true;

        uint256 feeAmount = (totalRaised * FEE_PERCENT) / FEE_DENOMINATOR;
        uint256 creatorAmount = totalRaised - feeAmount;

        IERC20(token).transfer(creator, creatorAmount);
        IERC20(token).transfer(feeRecipient, feeAmount);

        emit FundsClaimed(creator, creatorAmount, feeAmount);
    }

    /// @notice User claims refund if the goal was not reached
    function refund() external {
        require(block.timestamp >= deadline, "Campaign not ended yet");
        require(totalRaised < goal, "Goal was reached, no refunds");
        
        uint256 amount = contributions[msg.sender];
        require(amount > 0, "Nothing to refund");

        contributions[msg.sender] = 0;
        IERC20(token).transfer(msg.sender, amount);

        emit Refunded(msg.sender, amount);
    }

    /// @notice Current campaign status
    function getStatus() external view returns (string memory) {
        if (claimed) return "claimed";
        if (block.timestamp < deadline && totalRaised < goal) return "active";
        if (totalRaised >= goal) return "successful";
        if (block.timestamp >= deadline && totalRaised < goal) return "failed";
        return "unknown";
    }
}