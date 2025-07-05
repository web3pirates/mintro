#!/bin/bash

# Sentiment Backend Heroku Deployment Script
echo "🚀 Deploying Sentiment Backend to Heroku..."

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI is not installed. Please install it first:"
    echo "   https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "server.js" ]; then
    echo "❌ Please run this script from the sentiment directory"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found. You'll need to set environment variables in Heroku."
    echo "   Please create a .env file based on env.example"
fi

# Get app name from user or use default
read -p "Enter Heroku app name (or press Enter for auto-generated name): " APP_NAME

if [ -z "$APP_NAME" ]; then
    echo "📝 Creating new Heroku app with auto-generated name..."
    heroku create
    APP_NAME=$(heroku apps:info --json | grep -o '"name":"[^"]*"' | cut -d'"' -f4)
else
    echo "📝 Creating Heroku app: $APP_NAME"
    heroku create $APP_NAME
fi

echo "✅ Heroku app created: $APP_NAME"

# Add MongoDB addon (MongoDB Atlas)
echo "🗄️  Adding MongoDB Atlas addon..."
heroku addons:create mongolab:sandbox

# Set environment variables
echo "🔧 Setting environment variables..."
heroku config:set NODE_ENV=production

# Prompt for CoinMarketCap API key
read -p "Enter your CoinMarketCap API key: " CMC_API_KEY
if [ ! -z "$CMC_API_KEY" ]; then
    heroku config:set CMC_API_KEY=$CMC_API_KEY
    echo "✅ CoinMarketCap API key set"
else
    echo "⚠️  Warning: CoinMarketCap API key not provided. Fear & Greed API won't work."
fi

# Deploy to Heroku
echo "📦 Deploying to Heroku..."
git add .
git commit -m "Deploy sentiment backend to Heroku"
git push heroku main

# Check if deployment was successful
if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Your app is available at: https://$APP_NAME.herokuapp.com"
    echo ""
    echo "📊 Test your endpoints:"
    echo "   Health check: https://$APP_NAME.herokuapp.com/health"
    echo "   Fear & Greed latest: https://$APP_NAME.herokuapp.com/api/fear-greed/latest"
    echo "   Fear & Greed historical: https://$APP_NAME.herokuapp.com/api/fear-greed/historical"
    echo ""
    echo "📋 View logs: heroku logs --tail -a $APP_NAME"
    echo "🔧 View config: heroku config -a $APP_NAME"
else
    echo "❌ Deployment failed. Check the logs above for errors."
    exit 1
fi 