# Mintro Backend API

A Node.js/Express backend API for the Mintro application.

## Features

- User authentication with JWT
- Trader management
- Following system
- MongoDB integration
- RESTful API endpoints

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file based on `env.example`:

```bash
cp env.example .env
```

3. Update the environment variables in `.env`

4. Start the development server:

```bash
npm run dev
```

## Heroku Deployment

### Prerequisites

1. Install Heroku CLI
2. Login to Heroku: `heroku login`
3. Have a MongoDB database (MongoDB Atlas recommended)

### Deployment Steps

1. **Initialize Git repository** (if not already done):

```bash
git init
git add .
git commit -m "Initial commit"
```

2. **Create Heroku app**:

```bash
heroku create your-app-name
```

3. **Set environment variables**:

```bash
heroku config:set MONGODB_URI="your-mongodb-connection-string"
heroku config:set JWT_SECRET="your-super-secret-jwt-key"
```

4. **Deploy to Heroku**:

```bash
git push heroku main
```

5. **Open the app**:

```bash
heroku open
```

### Environment Variables

- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token signing
- `PORT`: Port number (set automatically by Heroku)

## API Endpoints

- `GET /health` - Health check
- `GET /api/test` - Test endpoint
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/users` - Get users
- `GET /api/traders` - Get traders
- `POST /api/following` - Follow a trader

## Troubleshooting

- Check logs: `heroku logs --tail`
- Restart app: `heroku restart`
- Check config: `heroku config`
