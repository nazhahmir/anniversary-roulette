# Deployment Guide - Deal or No Deal Anniversary Game

This guide provides step-by-step instructions for deploying the Deal or No Deal anniversary game to various platforms.

## Quick Start (Recommended: Railway)

### 1. Database Setup
1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new PostgreSQL database
3. Copy the connection string (looks like: `postgresql://username:password@host/database?sslmode=require`)

### 2. Deploy to Railway
1. Go to [railway.app](https://railway.app) and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Connect your GitHub repository
4. Add environment variables:
   - `DATABASE_URL` = your Neon connection string
   - `NODE_ENV` = `production`
5. Railway will automatically deploy your app

### 3. Initialize Database
1. Go to your Railway project dashboard
2. Open the terminal/console
3. Run: `npm run db:push`
4. Your app is now live! 🎉

## Detailed Platform Guides

### Vercel Deployment

**Best for:** Frontend-heavy applications with serverless functions

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Configure in Vercel Dashboard:**
   - Go to your project settings
   - Add environment variables:
     - `DATABASE_URL`
     - `NODE_ENV=production`

4. **Build Settings:**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Render Deployment

**Best for:** Full-stack applications with persistent processes

1. **Create Web Service:**
   - Go to [render.com](https://render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository

2. **Configure Settings:**
   - Name: `anniversary-roulette`
   - Environment: `Node`
   - Build Command: `npm run build`
   - Start Command: `npm run start`

3. **Environment Variables:**
   - `DATABASE_URL`
   - `NODE_ENV=production`

4. **Deploy:**
   - Click "Create Web Service"
   - Render will build and deploy automatically

### DigitalOcean App Platform

**Best for:** Production applications with scaling needs

1. **Create App:**
   - Go to DigitalOcean App Platform
   - Click "Create App" → "Source: GitHub"
   - Select your repository

2. **Configure App:**
   - Name: `anniversary-roulette`
   - Environment: `Node.js`
   - Build Command: `npm run build`
   - Run Command: `npm run start`

3. **Environment Variables:**
   - Add `DATABASE_URL` and `NODE_ENV=production`

4. **Deploy:**
   - Click "Create Resources"
   - Your app will be deployed

### Docker Deployment

**Best for:** Containerized deployments, Kubernetes, or custom servers

1. **Create Dockerfile:**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   EXPOSE 5000
   CMD ["npm", "run", "start"]
   ```

2. **Create .dockerignore:**
   ```
   node_modules
   .git
   .env*
   README.md
   ```

3. **Build and Run:**
   ```bash
   docker build -t anniversary-roulette .
   docker run -p 5000:5000 \
     -e DATABASE_URL=your_database_url \
     -e NODE_ENV=production \
     anniversary-roulette
   ```

## Environment Variables Reference

### Required Variables
```bash
DATABASE_URL=postgresql://username:password@host/database?sslmode=require
NODE_ENV=production
```

### Optional Variables
```bash
PORT=5000                    # Server port (default: 5000)
SESSION_SECRET=your-secret   # Session encryption key
LOG_LEVEL=info              # Logging level
CORS_ORIGIN=https://yourdomain.com  # CORS origin
```

## Database Setup

### Option 1: Neon (Recommended)
1. Go to [neon.tech](https://neon.tech)
2. Create free account
3. Create new project
4. Copy connection string
5. Run: `npm run db:push`

### Option 2: Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create free account
3. Create new project
4. Go to Settings → Database
5. Copy connection string
6. Run: `npm run db:push`

### Option 3: Railway PostgreSQL
1. In Railway dashboard, click "New" → "Database" → "PostgreSQL"
2. Copy connection string from Variables tab
3. Run: `npm run db:push`

## Post-Deployment Checklist

- [ ] Database is initialized (`npm run db:push`)
- [ ] Environment variables are set
- [ ] App is accessible via HTTPS
- [ ] Admin panel is working (`/admin`)
- [ ] Game functionality is working
- [ ] Database backups are enabled
- [ ] Monitoring is set up (optional)

## Troubleshooting

### Common Issues

**"Database connection failed"**
- Check `DATABASE_URL` format
- Verify database is accessible
- Ensure SSL is enabled (`sslmode=require`)

**"Build failed"**
- Check Node.js version (requires 18+)
- Verify all dependencies are in `package.json`
- Check for TypeScript errors

**"App won't start"**
- Check environment variables are set
- Verify port is available
- Check application logs

**"Game not working"**
- Ensure database is initialized
- Check API endpoints are responding
- Verify game state is properly set

### Performance Tips

1. **Database:**
   - Enable connection pooling
   - Use read replicas for heavy traffic
   - Monitor query performance

2. **Application:**
   - Enable gzip compression
   - Use CDN for static assets
   - Implement caching

3. **Monitoring:**
   - Set up health checks
   - Monitor error rates
   - Track response times

## Security Best Practices

1. **Environment Variables:**
   - Never commit `.env` files
   - Use strong `SESSION_SECRET`
   - Rotate credentials regularly

2. **Database:**
   - Use SSL connections
   - Restrict IP access
   - Enable automatic backups

3. **Application:**
   - Keep dependencies updated
   - Use HTTPS only
   - Implement rate limiting

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review application logs
3. Verify environment variables
4. Test database connectivity
5. Check platform-specific documentation

For additional help, refer to the main README.md file or create an issue in the repository. 