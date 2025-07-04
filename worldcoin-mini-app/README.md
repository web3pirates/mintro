# WorldCoin Mini App

A modern Next.js application that demonstrates WorldCoin integration for digital identity verification. This Mini App showcases how to implement WorldCoin's zero-knowledge proof system for proving human uniqueness without revealing personal data.

## Features

- 🌍 **WorldCoin Integration**: Seamless integration with WorldCoin's IDKit
- 🔐 **Zero-Knowledge Proof**: Verify human uniqueness without revealing identity
- 📱 **Mobile Optimized**: Designed to work perfectly in the World App
- 🎨 **Modern UI**: Beautiful, responsive design with dark mode support
- ⚡ **Fast Performance**: Built with Next.js 15 and optimized for speed
- 🔒 **Privacy First**: Your biometric data stays on your device

## Prerequisites

- Node.js 18+
- npm or yarn
- WorldCoin Developer Account (get one at [developer.worldcoin.org](https://developer.worldcoin.org))

## Getting Started

### 1. Clone and Install

```bash
cd worldcoin-mini-app
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```bash
# WorldCoin Configuration
NEXT_PUBLIC_WORLDCOIN_APP_ID=your_actual_app_id_here

# Optional: WalletConnect Project ID
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
```

### 3. Get Your WorldCoin App ID

1. Visit [developer.worldcoin.org](https://developer.worldcoin.org)
2. Sign up for a developer account
3. Create a new app
4. Copy your App ID and add it to `.env.local`

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view your Mini App.

## WorldCoin Integration

### IDKit Widget

The app uses WorldCoin's IDKit widget for verification:

```tsx
<IDKitWidget
  app_id={WORLDCOIN_CONFIG.APP_ID}
  action={WORLDCOIN_CONFIG.ACTION}
  signal={WORLDCOIN_CONFIG.SIGNAL}
  onSuccess={handleSuccess}
  verification_level={WORLDCOIN_CONFIG.VERIFICATION_LEVEL}
>
  {({ open }) => <button onClick={open}>Verify with WorldCoin</button>}
</IDKitWidget>
```

### Verification Flow

1. User clicks "Verify with WorldCoin"
2. WorldCoin IDKit opens
3. User completes verification (Orb scan or device verification)
4. App receives verification proof
5. User is marked as verified

## Project Structure

```
worldcoin-mini-app/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main Mini App page
│   │   ├── layout.tsx        # App layout and metadata
│   │   └── globals.css       # Global styles
│   └── config/
│       └── worldcoin.ts      # WorldCoin configuration
├── public/                   # Static assets
├── package.json
└── README.md
```

## Configuration

### WorldCoin Settings

Edit `src/config/worldcoin.ts` to customize:

- App ID and verification settings
- API endpoints for backend integration
- Mini App metadata

### Styling

The app uses Tailwind CSS for styling. Customize colors and components in:

- `src/app/globals.css` - Global styles
- Component-level Tailwind classes

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Testing

### Development Testing

1. Use the staging App ID for development
2. Test with WorldCoin's test environment
3. Use the World App's development mode

### Production Testing

1. Get a production App ID from WorldCoin
2. Test with real Orb verification
3. Verify proof validation on your backend

## Backend Integration

For production use, you'll need a backend to validate WorldCoin proofs:

```typescript
// Example API route for proof verification
export async function POST(req: Request) {
  const { proof, merkle_root, nullifier_hash } = await req.json();

  // Verify the proof with WorldCoin's API
  const verification = await fetch(
    "https://developer.worldcoin.org/api/v1/verify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merkle_root,
        nullifier_hash,
        proof,
        credential_type: "orb",
        action: "verify_user",
        signal: "user_value",
      }),
    }
  );

  return Response.json({ success: verification.ok });
}
```

## Troubleshooting

### Common Issues

1. **App ID not working**: Ensure you're using the correct App ID from your WorldCoin developer dashboard
2. **Verification failing**: Check that your App ID is configured for the correct environment (staging/production)
3. **Widget not loading**: Verify that all required dependencies are installed

### Debug Mode

Enable debug logging by setting:

```bash
NEXT_PUBLIC_DEBUG=true
```

## Resources

- [WorldCoin Developer Documentation](https://developer.worldcoin.org)
- [IDKit Documentation](https://docs.worldcoin.org/idkit)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For WorldCoin-specific questions:

- [WorldCoin Developer Discord](https://discord.gg/worldcoin)
- [WorldCoin Developer Forum](https://forum.worldcoin.org)

For general app questions:

- Open an issue on GitHub
- Check the troubleshooting section above
