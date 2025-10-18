# CrowdGoal 🎯

A decentralized crowdfunding platform built on the Spicy Network (Chiliz) blockchain, enabling users to create and fund campaigns using CHZ tokens.

## 🌟 Features

- **Decentralized Campaign Creation**: Create crowdfunding campaigns directly on the blockchain
- **Native CHZ Support**: Fund campaigns using CHZ tokens on Spicy Network
- **Smart Contract Security**: Built with OpenZeppelin security standards
- **Platform Fee System**: 3% platform fee for sustainable operations
- **Refund Mechanism**: Automatic refunds for failed campaigns
- **Real-time Status Updates**: Track campaign progress and funding status
- **Modern Web3 UI**: Clean, responsive interface with MetaMask integration

## 🏗️ Architecture

### Smart Contracts

- **CampaignFactory**: Main contract managing all campaigns
- **Campaign Status**: Active, Successful, Failed, Finalized
- **Platform Fee**: 3% fee on successful campaigns
- **Refund System**: Automatic refunds for failed campaigns

### Frontend

- **React + TypeScript**: Modern frontend with type safety
- **Web3 Integration**: MetaMask wallet connection
- **Form Validation**: Comprehensive input validation and sanitization
- **Error Handling**: Robust error handling for blockchain interactions

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MetaMask wallet
- CHZ tokens on Spicy Network
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/crowdgoal.git
   cd crowdgoal
   ```

2. **Install dependencies**

   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install contract dependencies (if deploying)
   cd ../contracts
   npm install
   ```

3. **Environment Setup**

   ```bash
   # Copy environment template
   cp frontend/.env.example frontend/.env

   # Edit frontend/.env with your configuration
   VITE_CAMPAIGN_FACTORY_ADDRESS=0x...
   VITE_SPICY_RPC_URL=https://spicy-rpc.chiliz.com
   VITE_CHAIN_ID=88882
   ```

4. **Start the development server**

   ```bash
   cd frontend
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `frontend` directory:

```env
# Contract Configuration
VITE_CAMPAIGN_FACTORY_ADDRESS=0xYourDeployedContractAddress
VITE_CAMPAIGN_FACTORY_NAME=CampaignFactory

# Network Configuration
VITE_SPICY_RPC_URL=https://spicy-rpc.chiliz.com
VITE_CHAIN_ID=88882
VITE_CHAIN_NAME=Spicy Network
VITE_CURRENCY_SYMBOL=CHZ
VITE_CURRENCY_DECIMALS=18
```

### MetaMask Setup

1. **Add Spicy Network to MetaMask**

   - Network Name: Spicy Network
   - RPC URL: `https://spicy-rpc.chiliz.com`
   - Chain ID: `88882`
   - Currency Symbol: `CHZ`
   - Block Explorer: `https://spicy-explorer.chiliz.com`

2. **Get CHZ Tokens**
   - Use a bridge or exchange to get CHZ tokens
   - Ensure you have enough CHZ for gas fees and campaign creation

## 📱 Usage

### Creating a Campaign

1. **Connect Wallet**: Click "Connect Wallet" and approve MetaMask connection
2. **Fill Campaign Details**:
   - Author Name: Your display name
   - Title: Campaign title (max 100 characters)
   - Description: Detailed description (max 500 characters)
   - Goal: Funding target in CHZ
   - Expiry Date: Campaign end date
3. **Submit**: Review and submit your campaign to the blockchain

### Funding a Campaign

1. **Browse Campaigns**: View active campaigns on the homepage
2. **Select Campaign**: Click on a campaign to view details
3. **Donate**: Enter donation amount and confirm transaction
4. **Track Progress**: Monitor funding progress and campaign status

### Withdrawing Funds

1. **Campaign Success**: Wait for campaign to reach its goal
2. **Withdraw**: Campaign author can withdraw funds (minus 3% platform fee)
3. **Refunds**: Failed campaigns automatically allow donor refunds

## 🛠️ Development

### Project Structure

```
crowdgoal/
├── contracts/                 # Smart contracts
│   ├── contracts/
│   │   └── CampaignFactory.sol
│   ├── test/
│   └── scripts/
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   └── types/
│   └── public/
└── shared/                    # Shared utilities
```

### Available Scripts

**Frontend:**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

**Contracts:**

```bash
npm run compile      # Compile contracts
npm run deploy       # Deploy to network
npm run test         # Run contract tests
```

### Smart Contract Deployment

1. **Configure Hardhat**

   ```javascript
   // hardhat.config.js
   module.exports = {
     solidity: {
       version: "0.8.19",
       settings: {
         evmVersion: "shanghai", // Compatible with Spicy Network
       },
     },
     networks: {
       spicy: {
         url: "https://spicy-rpc.chiliz.com",
         chainId: 88882,
         accounts: [process.env.PRIVATE_KEY],
       },
     },
   };
   ```

2. **Deploy Contract**

   ```bash
   cd contracts
   npx hardhat run scripts/deploy.js --network spicy
   ```

3. **Update Environment**
   ```env
   VITE_CAMPAIGN_FACTORY_ADDRESS=0xDeployedContractAddress
   ```

## 🔒 Security

- **Smart Contract Audits**: Contracts use OpenZeppelin security standards
- **Input Validation**: Comprehensive validation on both frontend and contract
- **Reentrancy Protection**: Built-in protection against reentrancy attacks
- **Access Control**: Proper ownership and permission management

## 🐛 Troubleshooting

### Common Issues

**"MetaMask not found"**

- Ensure MetaMask is installed and unlocked
- Check if MetaMask is enabled for the site

**"Invalid opcode: MCOPY"**

- Contract compiled for newer EVM version
- Ensure contract uses `evmVersion: "shanghai"`

**"Transaction failed"**

- Check CHZ balance for gas fees
- Verify network connection
- Ensure contract is deployed correctly

**"Campaign Factory not found"**

- Verify `VITE_CAMPAIGN_FACTORY_ADDRESS` in `.env`
- Ensure contract is deployed on Spicy Network

### Getting Help

- Check the [Issues](https://github.com/yourusername/crowdgoal/issues) page
- Review the [Wiki](https://github.com/yourusername/crowdgoal/wiki) for detailed guides
- Join our [Discord](https://discord.gg/yourdiscord) community

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenZeppelin](https://openzeppelin.com/) for secure smart contract libraries
- [Chiliz](https://chiliz.com/) for the Spicy Network infrastructure
- [React](https://reactjs.org/) and [TypeScript](https://www.typescriptlang.org/) communities

## 📞 Contact

- **Project Maintainer**: [Ignacio Mansilla Derqui](https://github.com/imansilladerqui)
- **Email**: imansilladerqui@hotmail.com

---

**Built with ❤️ for the decentralized future**
