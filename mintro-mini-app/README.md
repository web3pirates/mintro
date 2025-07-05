## Create a Mini App

[Mini apps](https://docs.worldcoin.org/mini-apps) enable third-party developers to create native-like applications within World App.

This template is a way for you to quickly get started with authentication and examples of some of the trickier commands.

## Getting Started

1. cp .env.example .env.local
2. Follow the instructions in the .env.local file
3. **Set up Privy:**
   - Go to [Privy Dashboard](https://console.privy.io/) and create a new app
   - Copy your Privy App ID
   - Add `NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here` to your `.env.local` file
   - In your Privy app settings, add your domain (including ngrok URL for testing) to the allowed origins
4. Run `npm run dev`
5. Run `ngrok http 3000`
6. Run `npx auth secret` to update the `AUTH_SECRET` in the .env.local file
7. Add your domain to the `allowedDevOrigins` in the next.config.ts file.
8. [For Testing] If you're using a proxy like ngrok, you need to update the `AUTH_URL` in the .env.local file to your ngrok url.
9. Continue to developer.worldcoin.org and make sure your app is connected to the right ngrok url
10. [Optional] For Verify and Send Transaction to work you need to do some more setup in the dev portal. The steps are outlined in the respective component files.

### Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Worldcoin Mini App Configuration
NEXT_PUBLIC_WLD_CLIENT_ID=app_your_worldcoin_app_id_here

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Privy Configuration
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here
```

## Authentication

This starter kit uses [Privy](https://privy.io/) for Sign-In With Ethereum (SIWE) authentication, integrated with [Minikit's](https://github.com/worldcoin/minikit-js) wallet auth and [next-auth](https://authjs.dev/getting-started) for session management.

The authentication flow follows the [Privy Worldcoin SIWE guide](https://docs.privy.io/recipes/react/worldcoin-siwe-guide):

1. Generate a nonce from Privy
2. Use the nonce with Worldcoin's walletAuth command
3. Send the signed message and signature back to Privy to complete authentication

## UI Library

This starter kit uses [Mini Apps UI Kit](https://github.com/worldcoin/mini-apps-ui-kit) to style the app. We recommend using the UI kit to make sure you are compliant with [World App's design system](https://docs.world.org/mini-apps/design/app-guidelines).

## Eruda

[Eruda](https://github.com/liriliri/eruda) is a tool that allows you to inspect the console while building as a mini app. You should disable this in production.

## Contributing

This template was made with help from the amazing [supercorp-ai](https://github.com/supercorp-ai) team.
