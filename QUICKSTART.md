# Quick Start Guide

## Prerequisites

1. **Node.js 18+** - [Download](https://nodejs.org/)
2. **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier available)
3. **MetaMask** - [Install Extension](https://metamask.io/)

## Setup in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/civichain
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/civichain

# Optional: For AI features
OPENAI_API_KEY=sk-your-key-here

# Optional: For WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id
```

### 3. Start MongoDB

**Local MongoDB:**
```bash
# On macOS/Linux
mongod

# On Windows
# Start MongoDB service from Services or run:
mongod.exe
```

**Or use MongoDB Atlas** (cloud, no installation needed):
- Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a free cluster
- Get connection string
- Add to `.env.local`

### 4. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Connect Your Wallet

1. Install MetaMask browser extension
2. Create or import a wallet
3. Click "Connect Wallet" on the homepage
4. Approve the connection

## First Steps

### Register Your Identity

1. Go to `/register` or click "Get Started"
2. Connect your wallet
3. Select payment method (demo is free)
4. Click "Register Identity"

### Create an Election

1. Go to `/create`
2. Fill in election details:
   - Title
   - Description (or use AI generate)
   - Add at least 2 candidates
   - Set start and end times
3. Click "Create Election"

### Vote in an Election

1. Go to `/elections`
2. Browse available elections
3. Click on an election
4. Select a candidate
5. Click "Cast Vote"

## Testing Smart Contracts

### Compile Contracts
```bash
npm run compile
```

### Run Tests
```bash
npm run test
```

### Start Local Hardhat Node
```bash
npm run node
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env.local`
- For Atlas: Check IP whitelist and credentials

### Wallet Connection Issues
- Ensure MetaMask is installed
- Check if you're on a supported network
- Try refreshing the page

### API Errors
- Check console for error messages
- Verify environment variables are set
- Ensure MongoDB is accessible

## Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Explore the smart contracts in `/contracts`
- Customize the UI in `/app` and `/components`
- Deploy contracts when ready (see Hardhat docs)

## Need Help?

- Check the [README.md](./README.md) for detailed information
- Review API endpoints in `/app/api`
- Examine smart contracts in `/contracts`

Happy voting! 🗳️

