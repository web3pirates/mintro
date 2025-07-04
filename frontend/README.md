# Mintro Frontend

This is the frontend application for Mintro, built with Next.js 14.

## Features

- ⚡ **Next.js 14** - The React framework for production
- 🎨 **Tailwind CSS** - A utility-first CSS framework
- 📱 **Responsive Design** - Mobile-first approach
- 🔧 **TypeScript** - Type safety and better developer experience
- 🚀 **App Router** - Next.js 13+ app directory structure
- 📦 **ESLint** - Code linting and formatting

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
frontend/
├── src/
│   ├── app/              # App Router pages and layouts
│   │   ├── globals.css   # Global styles
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Home page
│   └── components/       # Reusable React components
├── public/               # Static assets
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── next.config.ts        # Next.js configuration
├── tailwind.config.ts    # Tailwind CSS configuration
└── postcss.config.mjs    # PostCSS configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - learn about Tailwind CSS.
- [TypeScript Documentation](https://www.typescriptlang.org/docs/) - learn about TypeScript.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details. 