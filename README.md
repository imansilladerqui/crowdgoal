🌐 CrowdGoal

CrowdGoal is the world’s first **Web3 crowdfunding dApp** built on the **Chiliz (EVM compatible) network**—dedicated to empowering sports fans everywhere.
Unite, fund, and bring to life the most exciting fan-driven sports projects, experiences, and community initiatives.
The platform retains a **3% commission** on successful campaigns.

---

## ✨ Features

- 🏟️ **For Fans, By Fans**: Every project is sports-focused, from stadium experiences to fan clubs and athlete support.
- 📦 **Decentralized crowdfunding**: funds are held in smart contracts.
- 🔒 **Guaranteed security**: automatic refund if the goal is not reached.
- 🌍 **Global sports community**: connect with fans worldwide, regardless of sport, team, or country.
- 🖼️ **Metadata on IPFS**: project descriptions, images, and documents are stored in decentralized systems.
- 📊 **Dynamic UI**: cards showing fundraising progress, status, and deadline.
- 💸 **Low fees**: only 3% commission on successful campaigns, so more funds go directly to fan initiatives.

---

## 🏗️ Architecture

monorepo/
│── contracts/ # Smart contracts (Hardhat)
│── frontend/ # Frontend (Next.js + Tailwind)
│── shared/abis/ # ABIs exported from Hardhat for the frontend

### Data Flow

1. Smart contracts handle the critical logic:
   - Goal, deadline, fundraising, refunds, and distribution.
2. The contract stores a `metadataURI` → points to a JSON on **IPFS** with visual data (title, description, image, docs).
3. The frontend listens to events → combines **on-chain** data (goal, raised, status) with **IPFS** metadata → renders project cards.

---

## 🛠️ Tech Stack

- **Blockchain & Smart Contracts**

  - [Hardhat](https://hardhat.org/) (compilation, tests, deployment)
  - Solidity (contracts on Chiliz EVM)

- **Frontend**

  - [Next.js](https://nextjs.org/) (React SSR/SPA hybrid)
  - [Tailwind CSS](https://tailwindcss.com/) (fast and responsive UI)
  - [Wagmi](https://wagmi.sh/) + [viem](https://viem.sh/) (contract interaction)

- **Infrastructure**
  - [IPFS](https://ipfs.io/) (decentralized storage for metadata and images)
  - [The Graph](https://thegraph.com/) (optional for fast event indexing)
  - GitHub Actions (CI/CD)

---

## 🚀 Installation

Clone the repo:

```bash
git clone https://github.com/imansilladerqui/crowdgoal.git
cd crowdgoal
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

---

## 🧑‍💻 Contributing

Contributions are welcome! Open an issue or PR on GitHub to suggest improvements, report bugs, or propose new features.

---

## 📄 License

This project is licensed under the MIT License.

---

## 📬 Contact

For questions, support, or collaborations, you can open an issue on GitHub or email [imansilladerqui@hotmail.com](mailto:imansilladerqui@hotmail.com).
