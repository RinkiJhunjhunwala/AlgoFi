AlgoMint/
│
├── smart-contracts/                     # Solidity contracts for NFT logic
│   ├── contracts/
│   │   ├── AlgoMintNFT.sol              # ERC-721 NFT contract (base)
│   │   ├── AlgoMintMarketplace.sol      # Marketplace contract
│   │   ├── AlgoMintFactory.sol          # Handles minting logic (purchasable/non-purchasable)
│   │   └── interfaces/
│   │       └── IAlgoMintNFT.sol
│   │
│   ├── scripts/
│   │   ├── deploy.js                    # Hardhat deployment script
│   │   └── verify.js                    # Contract verification
│   │
│   ├── test/
│   │   ├── nft.test.js
│   │   └── marketplace.test.js
│   │
│   ├── hardhat.config.ts
│   └── package.json
│
├── backend/                             # Node.js + TypeScript backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.ts                    # MongoDB connection
│   │   │   ├── env.ts                   # Environment configuration
│   │   │   └── ipfs.ts                  # IPFS/NFT.Storage integration
│   │   │
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── NFT.ts
│   │   │   └── Transaction.ts
│   │   │
│   │   ├── controllers/
│   │   │   ├── nft.controller.ts        # Create/list NFTs
│   │   │   ├── user.controller.ts       # Profile management
│   │   │   └── marketplace.controller.ts# Marketplace operations
│   │   │
│   │   ├── routes/
│   │   │   ├── nft.routes.ts
│   │   │   ├── user.routes.ts
│   │   │   └── marketplace.routes.ts
│   │   │
│   │   ├── services/
│   │   │   ├── nft.service.ts
│   │   │   ├── marketplace.service.ts
│   │   │   └── wallet.service.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── errorHandler.ts
│   │   │   └── responseFormatter.ts
│   │   │
│   │   ├── app.ts                       # Express app setup
│   │   └── server.ts                    # Entry point
│   │
│   ├── tsconfig.json
│   ├── package.json
│   └── .env
│
├── frontend/                            # React + Tailwind frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── NFTCard.tsx
│   │   │   ├── NFTGrid.tsx
│   │   │   ├── WalletConnect.tsx
│   │   │   ├── MintForm.tsx
│   │   │   └── Loader.tsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Marketplace.tsx
│   │   │   ├── Profile.tsx
│   │   │   └── Mint.tsx
│   │   │
│   │   ├── context/
│   │   │   └── WalletContext.tsx        # Wallet state management
│   │   │
│   │   ├── hooks/
│   │   │   ├── useNFT.ts
│   │   │   └── useMarketplace.ts
│   │   │
│   │   ├── lib/
│   │   │   ├── contract.ts              # Contract connection (ethers.js)
│   │   │   ├── ipfs.ts
│   │   │   └── api.ts                   # Axios instance for backend
│   │   │
│   │   ├── styles/
│   │   │   └── globals.css
│   │   │
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   ├── package.json
│   └── .env
│
├── docs/
│   ├── README.md
│   ├── API_DOCS.md
│   ├── CONTRACTS.md
│   └── ARCHITECTURE.md
│
├── scripts/
│   ├── setupEnv.sh                      # Quick setup for dev environment
│   └── deployContracts.sh
│
├── .gitignore
├── package.json
└── README.md
