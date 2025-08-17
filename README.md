# Deal or No Deal Anniversary Game

A modern web-based "Deal or No Deal" anniversary gift game built with React, TypeScript, and Node.js. This application creates an interactive and romantic gaming experience perfect for anniversary celebrations, featuring a beautiful pastel UI and complete game flow management.

## Features

- **Interactive Welcome Screen** - Prize preview with the game name "Anniversary Surprise"
- **Randomized Envelope Selection** - Shuffled prize distribution for unpredictability
- **Cash-Out System** - "Deal or No Deal" decisions after each envelope selection
- **Automatic Final Prize** - Remaining prize assignment when tries are exhausted
- **Admin Panel** - Complete game configuration and envelope management
- **Beautiful Pastel UI** - Custom color palette (coral, mint, sky, sage, warm-yellow, blush)
- **Mobile Responsive** - Optimized for all device sizes
- **Real-time Game State** - Server-side persistence with client-side updates

## System Architecture

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Shadcn/ui** components with Radix UI primitives
- **Tailwind CSS** with custom pastel design system
- **TanStack Query** for server state management
- **Wouter** for lightweight routing
- **React Hook Form** with Zod validation
- **Framer Motion** for smooth animations

### Backend
- **Node.js** with Express.js
- **Drizzle ORM** with PostgreSQL
- **Neon Database** for serverless PostgreSQL
- **RESTful API** with proper error handling
- **ESBuild** for production bundling

### Database Schema
- **gameConfigs** - Game settings (envelope count, max tries, timer)
- **envelopes** - Prize information with position, text, and color
- **gameStates** - Game progress tracking and state management
- **romanticPrizes** - Prize categories and management
- **users** - Legacy authentication (maintained for compatibility)

## Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- PostgreSQL 14+ (or Neon Database account)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd anniversary-roulette
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file
   DATABASE_URL=your_neon_database_url_here
   PORT=5000
   NODE_ENV=development
   ```

4. **Set up the database**
   ```bash
   # Push the schema to your database
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5000`

## Project Structure

```
anniversary-roulette/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility libraries
│   └── index.html
├── server/                # Backend Express server
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API route definitions
│   ├── db.ts            # Database connection
│   └── storage.ts       # Data storage utilities
├── shared/               # Shared code between frontend/backend
│   ├── schema.ts        # Database schema definitions
│   └── prefilled-options.ts
├── attached_assets/      # Game assets and images
└── migrations/          # Database migrations (generated)
```

## Game Flow

1. **Welcome Screen** - Players see the game introduction and prize preview
2. **Game Start** - Envelopes are shuffled and game timer begins
3. **Envelope Selection** - Players select envelopes one by one
4. **Cash-Out Decision** - After each selection, players can cash out or continue
5. **Game Completion** - Final prize assignment or cash-out completion
6. **Reset** - Return to welcome screen for new games

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push database schema changes

## Customization

### Colors
The game uses a custom pastel color palette defined in Tailwind config:
- Coral, Mint, Sky, Sage, Warm-yellow, Blush

### Prizes
Edit `shared/prefilled-options.ts` to customize:
- Envelope prizes and descriptions
- Prize categories and text
- Color schemes for envelopes

### Game Settings
Configure via admin panel or database:
- Number of envelopes
- Maximum tries allowed
- Game timer duration
- Prize distribution

## Development

### Adding New Components
1. Create component in `client/src/components/`
2. Use Shadcn/ui components for consistency
3. Follow the existing component patterns
4. Add TypeScript types for props

### Database Changes
1. Modify `shared/schema.ts`
2. Run `npm run db:push` to apply changes
3. Update related API endpoints in `server/routes.ts`

### API Endpoints
- `GET /api/game-config` - Get current game configuration
- `POST /api/game-config` - Update game configuration
- `GET /api/envelopes` - Get all envelopes
- `POST /api/envelopes` - Create/update envelopes
- `GET /api/game-state` - Get current game state
- `POST /api/game-state` - Update game state
- `POST /api/select-envelope` - Select an envelope
- `POST /api/cash-out` - Cash out from game
- `POST /api/reset-game` - Reset game to initial state

## Deployment

### Prerequisites
- Node.js 18+ and npm 9+
- PostgreSQL database (Neon, Supabase, or self-hosted)
- Git repository access
- Deployment platform account (Vercel, Railway, Render, etc.)

### Production Build
```bash
npm run build
npm run start
```

### Environment Variables for Production
```bash
# Required
DATABASE_URL=your_production_database_url
NODE_ENV=production

# Optional (defaults shown)
PORT=5000
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
LOG_LEVEL=info
```

### Database Setup
1. **Create a PostgreSQL database:**
   - **Neon** (Recommended): [neon.tech](https://neon.tech) - Free tier available
   - **Supabase**: [supabase.com](https://supabase.com) - Free tier available
   - **Railway**: [railway.app](https://railway.app) - PostgreSQL service
   - **Self-hosted**: Install PostgreSQL on your server

2. **Get your connection string** (format: `postgresql://username:password@host/database`)

3. **Initialize the database:**
   ```bash
   npm run db:push
   ```

4. **Set up environment variables** with your database URL

### Deployment Platforms

#### Option 1: Vercel (Recommended for Frontend-Heavy Apps)
1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Configure environment variables** in Vercel dashboard:
   - `DATABASE_URL`
   - `NODE_ENV=production`

4. **Build settings:**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

#### Option 2: Railway (Full-Stack Platform)
1. **Connect your GitHub repository** to Railway
2. **Add environment variables:**
   - `DATABASE_URL`
   - `NODE_ENV=production`
3. **Deploy automatically** on git push

#### Option 3: Render (Full-Stack Platform)
1. **Create a new Web Service** on Render
2. **Connect your GitHub repository**
3. **Configure build settings:**
   - Build Command: `npm run build`
   - Start Command: `npm run start`
4. **Add environment variables:**
   - `DATABASE_URL`
   - `NODE_ENV=production`

#### Option 4: DigitalOcean App Platform
1. **Create a new app** on DigitalOcean
2. **Connect your GitHub repository**
3. **Configure build settings:**
   - Build Command: `npm run build`
   - Run Command: `npm run start`
4. **Add environment variables**

#### Option 5: Heroku (Legacy)
1. **Install Heroku CLI:**
   ```bash
   npm install -g heroku
   ```

2. **Create Heroku app:**
   ```bash
   heroku create your-app-name
   ```

3. **Add PostgreSQL addon:**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

4. **Set environment variables:**
   ```bash
   heroku config:set NODE_ENV=production
   ```

5. **Deploy:**
   ```bash
   git push heroku main
   ```

### Docker Deployment

#### Create Dockerfile
```dockerfile
# Use Node.js 18 Alpine for smaller image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "run", "start"]
```

#### Create .dockerignore
```
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.env.local
.env.development
.env.test
.env.production
```

#### Build and Run with Docker
```bash
# Build image
docker build -t anniversary-roulette .

# Run container
docker run -p 5000:5000 \
  -e DATABASE_URL=your_database_url \
  -e NODE_ENV=production \
  anniversary-roulette
```

### Environment-Specific Configurations

#### Development
```bash
DATABASE_URL=postgresql://username:password@localhost:5432/anniversary_roulette
NODE_ENV=development
PORT=3000
```

#### Staging
```bash
DATABASE_URL=postgresql://username:password@host/database
NODE_ENV=staging
PORT=5000
```

#### Production
```bash
DATABASE_URL=postgresql://username:password@host/database
NODE_ENV=production
PORT=5000
SESSION_SECRET=your-super-secret-session-key
```

### Security Considerations

1. **Environment Variables:**
   - Never commit `.env` files to version control
   - Use strong, unique `SESSION_SECRET` in production
   - Rotate database credentials regularly

2. **Database Security:**
   - Use SSL connections (`sslmode=require`)
   - Restrict database access to your application IP
   - Enable connection pooling for better performance

3. **Application Security:**
   - Keep dependencies updated
   - Use HTTPS in production
   - Implement rate limiting for API endpoints

### Monitoring and Maintenance

1. **Health Checks:**
   - Add `/api/health` endpoint for monitoring
   - Set up uptime monitoring (UptimeRobot, Pingdom)

2. **Logging:**
   - Configure proper logging levels
   - Set up log aggregation (if needed)

3. **Backups:**
   - Enable automatic database backups
   - Test restore procedures regularly

### Troubleshooting

#### Common Issues:
1. **Database Connection Errors:**
   - Verify `DATABASE_URL` format
   - Check database accessibility
   - Ensure SSL is configured correctly

2. **Build Failures:**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript compilation errors

3. **Runtime Errors:**
   - Check environment variables are set
   - Verify database schema is initialized
   - Check application logs for errors

#### Performance Optimization:
1. **Database:**
   - Enable connection pooling
   - Add database indexes if needed
   - Monitor query performance

2. **Application:**
   - Enable gzip compression
   - Use CDN for static assets
   - Implement caching strategies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Roadmap

- [ ] Multi-player support
- [ ] Custom prize categories
- [ ] Advanced animations
- [ ] Sound effects
- [ ] Leaderboard system
- [ ] Social sharing features

## Support

For issues and questions:
1. Check the existing issues
2. Create a new issue with detailed description
3. Include steps to reproduce the problem

---

**Made with love for special anniversary moments** 