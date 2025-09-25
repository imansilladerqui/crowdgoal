// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Campaign.sol";

/**
 * @title CampaignFactory
 * @dev Creates new campaigns and keeps record of all.
 */
contract CampaignFactory {
    address public feeRecipient; // CrowdGoal wallet
    Campaign[] public campaigns;

    event CampaignCreated(
        address indexed creator,
        address campaignAddress,
        uint256 goal,
        uint256 deadline,
        string metadataURI
    );

    constructor(address _feeRecipient) {
        feeRecipient = _feeRecipient;
    }

    function createCampaign(
        uint256 _goal,
        uint256 _deadline,
        address _token,
        string memory _metadataURI
    ) external {
        Campaign campaign = new Campaign(
            msg.sender,
            _goal,
            _deadline,
            _token,
            feeRecipient,
            _metadataURI
        );

        campaigns.push(campaign);

        emit CampaignCreated(
            msg.sender,
            address(campaign),
            _goal,
            _deadline,
            _metadataURI
        );
    }

    function getAllCampaigns() external view returns (Campaign[] memory) {
        return campaigns;
    }
}
