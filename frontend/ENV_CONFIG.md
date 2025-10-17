# Environment Configuration

This document explains the required environment variables for the CrowdGoal application.

## Required Variables

### Network Configuration

#### `VITE_CHILIZ_CHAIN_ID`

- **Description**: The chain ID for Chiliz SpicyNet testnet
- **Format**: Can be decimal number or 0x-prefixed hex string
- **Examples**:

  ```bash
  # Decimal format (recommended)
  VITE_CHILIZ_CHAIN_ID=88882

  # Hex format (also supported)
  VITE_CHILIZ_CHAIN_ID=0x15bb2
  ```

- **Note**: The app automatically converts decimal to hex for wallet operations

#### `VITE_CHILIZ_RPC_URL`

- **Description**: RPC endpoint URL for Chiliz SpicyNet
- **Example**:
  ```bash
  VITE_CHILIZ_RPC_URL=https://spicy-rpc.chiliz.com
  ```

### Contract Addresses

#### `VITE_CAMPAIGN_FACTORY_ADDRESS`

- **Description**: Deployed CampaignFactory contract address
- **Format**: 0x-prefixed Ethereum address
- **Example**:
  ```bash
  VITE_CAMPAIGN_FACTORY_ADDRESS=0xD649DF5498AE3F9D068f8D16D3024979D24D33a9
  ```

#### ~~`VITE_CHZ_TOKEN_ADDRESS`~~ **REMOVED**

- **Reason**: CHZ is the native currency on Chiliz SpicyNet, not an ERC-20 token
- **Usage**: All campaigns now use native CHZ currency automatically

#### `VITE_CAMPAIGN_FACTORY_NAME`
- **Description**: ~~Human-readable name for the CampaignFactory contract~~ **REMOVED**
- **Reason**: Not used anywhere in the codebase

## Example .env File

```bash
# Network Configuration
VITE_CHILIZ_CHAIN_ID=88882
VITE_CHILIZ_RPC_URL=https://spicy-rpc.chiliz.com

# Contract Addresses
VITE_CAMPAIGN_FACTORY_ADDRESS=0xD649DF5498AE3F9D068f8D16D3024979D24D33a9
```

## Validation

The app will validate these values on startup:

- Chain ID must be a positive number
- RPC URL must be reachable
- Contract addresses must have code deployed on the connected network
- Missing values will show helpful error messages

## Troubleshooting

### Common Issues

1. **"Invalid chain id"**: Ensure `VITE_CHILIZ_CHAIN_ID` is a positive number
2. **"RPC not reachable"**: Check your `VITE_CHILIZ_RPC_URL` and network connection
3. **"Contract not found"**: Verify `VITE_CAMPAIGN_FACTORY_ADDRESS` is deployed on the correct network
4. **"Token not a contract"**: ~~No longer applicable~~ - All campaigns use native CHZ currency

### Getting Contract Addresses

1. Deploy contracts to Chiliz SpicyNet
2. Copy the deployed addresses from your deployment script/Remix
3. Update the .env file with the correct addresses
4. Restart the development server
