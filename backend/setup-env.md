# Environment Variables Setup

## Required Environment Variables

Create a `.env` file in the `mintro/backend/` directory with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://robertadag02:<your_actual_password>@cluster0.ossvqxu.mongodb.net/mintro

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Alchemy Configuration
ALCHEMY_API_KEY=your-alchemy-api-key-here

# Noves API Configuration
NOVES_API_KEY=your-noves-api-key-here

# Server Configuration
PORT=5001
```

## How to Get API Keys

### Alchemy API Key
1. Go to [Alchemy](https://www.alchemy.com/)
2. Sign up/Login
3. Create a new app for World Chain
4. Copy your API key

### Noves API Key
1. Go to [Noves](https://noves.fi/)
2. Sign up/Login
3. Get your API key from the dashboard

## Quick Setup Commands

```bash
# Navigate to backend directory
cd mintro/backend

# Create .env file (replace with your actual values)
cat > .env << EOF
MONGODB_URI=mongodb+srv://robertadag02:<your_password>@cluster0.ossvqxu.mongodb.net/mintro
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
ALCHEMY_API_KEY=your-alchemy-api-key-here
NOVES_API_KEY=your-noves-api-key-here
PORT=5001
EOF

# Restart your server
npm start
```

## Testing

After setting up the environment variables, restart your backend server and check the console output. You should see:

```
🔧 Alchemy SDK initialized with API key
🔧 Noves API Key: Set
```

If you see "Not set" for Noves API Key, the system will still work but won't decode transactions with Noves.

## Architecture

The system now uses:
- **Alchemy SDK** for blockchain data (server-side, no CORS issues)
- **Noves API** for transaction decoding
- **MongoDB** for data storage
- **Backend listener** for continuous monitoring
- **Frontend** for data display and user interaction 