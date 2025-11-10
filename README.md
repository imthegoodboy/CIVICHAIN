# CIVICHAIN — Decentralized Voting & Identity Platform

> **Trustless democracy for a trustless world.**

CIVICHAIN is a comprehensive decentralized voting and identity platform that combines blockchain identity verification, zero-knowledge privacy, and on-chain governance to create transparent, tamper-proof elections.

## 🌟 Overview

CIVICHAIN solves the fundamental problems of traditional voting systems:

- ❌ **Fake voters** → ✅ Soulbound on-chain ID
- ❌ **Vote tampering** → ✅ Immutable blockchain tally
- ❌ **Centralized servers** → ✅ IPFS decentralized data
- ❌ **Lack of privacy** → ✅ Zero-knowledge voting
- ❌ **Limited access** → ✅ Pay & participate with any crypto via SideShift

## 🏗️ Architecture

### Core Components

1. **Decentralized ID (Soulbound NFT)**
   - Non-transferable ERC-721 tokens
   - Verifies citizen identity on-chain
   - One person = one identity

2. **On-Chain Voting**
   - Transparent, tamper-proof elections
   - Multiple voting types: Single Choice, Ranked, Quadratic
   - Results stored permanently on blockchain

3. **Zero-Knowledge Privacy**
   - Vote choices remain private
   - Results are verifiable by anyone
   - Prevents vote buying and coercion

4. **DAO Governance Layer**
   - Automated election creation
   - Result counting and distribution
   - Authority NFT for verified creators

5. **SideShift Integration**
   - Cross-chain payment gateway
   - Accept payments in any cryptocurrency
   - Automatic conversion to stablecoins
   - Reward distribution in preferred tokens

6. **AI-Powered Insights**
   - Election analysis and predictions
   - Voter turnout forecasting
   - Automated description generation

## 🚀 Features

### For Citizens
- ✅ Register identity with Soulbound NFT
- ✅ Browse and participate in elections
- ✅ Vote securely with verified identity
- ✅ View transparent results
- ✅ Receive rewards in preferred cryptocurrency

### For Governments/DAOs
- ✅ Create verified elections
- ✅ Set voting parameters and candidates
- ✅ Monitor real-time results
- ✅ Distribute rewards automatically
- ✅ Access AI-powered analytics

### Technical Features
- ✅ Web3 wallet integration (MetaMask, WalletConnect)
- ✅ MongoDB database for metadata
- ✅ RESTful API architecture
- ✅ Responsive, modern UI
- ✅ Smart contract integration (ready for deployment)
- ✅ IPFS-ready metadata storage

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern, responsive styling
- **Wagmi** - React hooks for Ethereum
- **Viem** - Ethereum library
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - Database for elections and users
- **Mongoose** - MongoDB ODM

### Smart Contracts
- **Solidity 0.8.24** - Smart contract language
- **Hardhat** - Development environment
- **OpenZeppelin** - Secure contract libraries

### Integrations
- **SideShift API** - Cross-chain payment gateway
- **OpenAI API** - AI-powered features
- **IPFS** - Decentralized storage (ready for integration)

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or cloud instance)
- MetaMask or compatible Web3 wallet

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd voting
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add:
   - `MONGODB_URI` - Your MongoDB connection string
   - `OPENAI_API_KEY` - (Optional) For AI features
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` - (Optional) For WalletConnect

4. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🔐 Smart Contracts

The project includes three main smart contracts:

### 1. CivicIdentity.sol
- Soulbound NFT for identity verification
- Non-transferable ERC-721 tokens
- Minting fee collection
- Identity verification system

### 2. VotingContract.sol
- On-chain voting system
- Multiple voting types support
- Vote counting and results
- Authority-based election creation

### 3. AuthorityNFT.sol
- NFT for authorized election creators
- Government/DAO verification
- Permission management

**Note:** Contracts are written but not deployed. They are ready for deployment when needed.

### Compiling Contracts
```bash
npx hardhat compile
```

### Testing Contracts
```bash
npx hardhat test
```

## 💱 SideShift Integration

### What is SideShift?

SideShift is a non-custodial cryptocurrency exchange API that enables seamless cross-chain swaps without requiring users to hold specific tokens.

### How SideShift Works in CIVICHAIN

#### 1. **Identity Registration Payments**
- Users can pay registration fees in any cryptocurrency (BTC, ETH, MATIC, etc.)
- SideShift automatically converts the payment to USDC
- Smart contract receives the exact amount needed
- No blockchain barriers for users

**Example Flow:**
```
User wants to register → Pays 0.001 BTC → SideShift converts → 2 USDC → Contract mints NFT
```

#### 2. **Election Creation Fees**
- DAOs/Governments pay election creation fees
- Can pay from any chain/wallet
- Automatic conversion to unified token

#### 3. **Voter Rewards Distribution**
- DAOs set reward pools in USDC
- Voters receive rewards in their preferred token
- SideShift handles conversion and distribution
- Supports BTC, ETH, USDC, USDT, MATIC, and more

**Example Flow:**
```
DAO has 10,000 USDC rewards → 1000 voters → Each voter chooses token
→ SideShift converts → Direct wallet payment
```

#### 4. **Treasury Management**
- DAOs can balance treasury across chains
- Convert between stablecoins automatically
- Multi-chain fund management

### SideShift API Usage

The platform uses SideShift's **public API** which doesn't require authentication:

- **Quote Endpoint**: Get exchange rates
- **Order Endpoint**: Create swap orders
- **Status Endpoint**: Check order status

**API Base URL**: `https://api.sideshift.ai/v2`

### Benefits of SideShift Integration

1. **Global Accessibility**: Users worldwide can participate regardless of their preferred cryptocurrency
2. **Seamless UX**: No need to manually swap tokens
3. **Cost Efficiency**: Competitive exchange rates
4. **Trustless**: Non-custodial, users maintain control
5. **Multi-Chain**: Works across all major blockchains

## 🤖 AI Features

CIVICHAIN includes AI-powered features using OpenAI:

### 1. **Election Analysis**
- Analyzes voting patterns and trends
- Provides insights on voter turnout
- Sentiment analysis
- Recommendations for future elections

### 2. **Description Generation**
- Auto-generates professional election descriptions
- Context-aware content creation
- Saves time for election creators

### 3. **Predictive Analytics**
- Voter turnout predictions
- Trend analysis
- Historical data insights

## 📁 Project Structure

```
voting/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── elections/     # Election endpoints
│   │   ├── users/         # User endpoints
│   │   ├── vote/          # Voting endpoints
│   │   ├── sideshift/     # SideShift integration
│   │   └── ai/            # AI features
│   ├── elections/         # Election pages
│   ├── create/            # Create election page
│   ├── register/          # Identity registration
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── ui/               # UI primitives
│   └── Navbar.tsx        # Navigation
├── contracts/            # Smart contracts
│   ├── CivicIdentity.sol
│   ├── VotingContract.sol
│   └── AuthorityNFT.sol
├── lib/                  # Utilities
│   ├── mongodb.ts        # Database connection
│   ├── wagmi.ts          # Web3 config
│   ├── sideshift.ts      # SideShift API
│   └── ai.ts             # AI functions
├── models/               # MongoDB models
│   ├── User.ts
│   └── Election.ts
└── README.md
```

## 🔄 How It Works

### User Flow

1. **Registration**
   - User connects wallet
   - Pays registration fee (any crypto via SideShift)
   - Receives Soulbound NFT identity
   - Identity stored on-chain and in database

2. **Election Participation**
   - Browse available elections
   - View election details and candidates
   - Cast vote with verified identity
   - Vote recorded on-chain and in database

3. **Results & Rewards**
   - View real-time results
   - Access AI-powered insights
   - Receive rewards in preferred token (via SideShift)

### Authority Flow

1. **Election Creation**
   - Authority connects wallet
   - Creates election with parameters
   - Pays creation fee (any crypto)
   - Election deployed (contract ready)

2. **Management**
   - Monitor voter participation
   - View real-time results
   - Access analytics
   - Distribute rewards

## 🌐 API Endpoints

### Elections
- `GET /api/elections` - List all elections
- `GET /api/elections/[id]` - Get election details
- `POST /api/elections` - Create new election
- `PUT /api/elections/[id]` - Update election

### Users
- `GET /api/users/register?walletAddress=...` - Get user
- `POST /api/users/register` - Register user

### Voting
- `POST /api/vote` - Cast a vote

### SideShift
- `GET /api/sideshift/quote` - Get exchange quote
- `POST /api/sideshift/order` - Create swap order
- `GET /api/sideshift/order?orderId=...` - Get order status

### AI
- `POST /api/ai/analyze` - Analyze election
- `POST /api/ai/generate` - Generate description

## 🎯 Use Cases

### Governments
- Transparent citizen elections
- Local and state-level voting
- Budget allocation votes
- Policy referendums

### Universities
- Student body elections
- Faculty voting
- Budget proposals
- Policy changes

### DAOs
- Member elections
- Budget allocation
- Proposal voting
- Governance decisions

### Corporations
- Board member voting
- Shareholder decisions
- Policy approvals

### Communities
- Opinion polls
- Feature requests
- Community decisions

## 🔒 Security Features

- ✅ Wallet-based authentication
- ✅ Identity verification (Soulbound NFTs)
- ✅ One vote per identity
- ✅ Immutable vote records
- ✅ Transparent result verification
- ✅ Private vote choices (ZK-ready)

## 🚧 Current Status

### ✅ Completed
- Full-stack application structure
- Smart contracts (written, not deployed)
- MongoDB integration
- SideShift API integration
- AI features
- Responsive UI
- Web3 wallet integration
- Election creation and voting
- User registration

### 🔄 Future Enhancements
- Smart contract deployment
- Full ZK proof implementation
- IPFS integration for metadata
- Multi-chain support
- Advanced analytics dashboard
- Mobile app
- Email notifications
- Social sharing

## 📝 Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/civichain
OPENAI_API_KEY=sk-... (optional)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=... (optional)
```

## 🧪 Development

### Run Development Server
```bash
npm run dev
```

### Compile Smart Contracts
```bash
npx hardhat compile
```

### Test Smart Contracts
```bash
npx hardhat test
```

### Build for Production
```bash
npm run build
npm start
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please open an issue on GitHub.

## 🙏 Acknowledgments

- **SideShift** - For cross-chain payment infrastructure
- **OpenZeppelin** - For secure smart contract libraries
- **Wagmi** - For excellent Web3 React hooks
- **Next.js** - For the amazing framework

---

**Built with ❤️ for a more transparent and democratic future.**

*"Your vote, your power — on-chain."*
