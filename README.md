# Deal or No Deal Anniversary Game

A modern web-based "Deal or No Deal" anniversary gift game built with React, TypeScript, and Node.js. This application creates an interactive and romantic gaming experience perfect for anniversary celebrations, featuring a beautiful pastel UI and complete game flow management.

## Features

- **Interactive Welcome Screen** - Prize preview with the game name "Jam's Anniversary Surprise"
- **Randomized Envelope Selection** - Shuffled prize distribution for unpredictability
- **Cash-Out System** - "Deal or No Deal" decisions after each envelope selection
- **Automatic Final Prize** - Last selected envelope becomes final prize when tries are exhausted
- **Time's Up Modal** - Special modal appears when timer expires
- **Celebratory Confetti** - 6-second confetti animation on game completion
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
5. **Game Completion** - Either:
   - **Final try**: Directly shows Game Complete screen with confetti
   - **Time expires**: Shows Time's Up modal, then Game Complete screen with confetti
6. **Reset** - Return to welcome screen for new games

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push database schema changes

## Customization

### Colors
The game uses a custom pastel color palette with solid colors (no gradients):
- **Envelope colors**: Coral, Mint, Sky, Sage, Warm-yellow, Blush
- **Background**: Light pink throughout the game
- **Text contrast**: Darker variants for better readability on white backgrounds

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
- `POST /api/game-state/select-envelope` - Select an envelope
- `POST /api/game-state/cash-out` - Cash out from game
- `POST /api/game-state/time-up` - Complete game when timer expires
- `POST /api/game-state/reset` - Reset game to initial state
- `POST /api/game-state/start` - Start a new game

## Key Features

### Database Setup
I successfully set up a PostgreSQL database using **Neon** (neon.tech) and initialized it with:
- **Romantic prizes** - 30+ Bay Area anniversary activities
- **Game configuration** - 6 envelopes, 3 tries, 60-second timer
- **Initial game state** - Ready to play
- **Database schema** - All tables created and populated

### Development Environment
- **Dependencies installed** - All npm packages working
- **Environment variables** - `.env` file configured with Neon database
- **Server running** - Development server on port 4000
- **Database connected** - Successfully connected to Neon PostgreSQL

### Game Features Working
- **Welcome screen** - "Jam's Anniversary Surprise" with prize preview
- **Envelope selection** - 6 envelopes with romantic prizes
- **Cash-out system** - "Deal or No Deal" decisions
- **Timer functionality** - 60-second countdown
- **Time's Up modal** - Appears when timer expires
- **Game completion** - Last selected envelope becomes final prize with confetti celebration
- **Admin panel** - Available at `/admin` for configuration

### UI Improvements Made
- **Solid pastel colors** - Soft pastel envelope colors
- **Light pink background** - Consistent throughout the game
- **Responsive design** - Works on mobile and desktop
- **Smooth animations** - Envelope flips and transitions
- **Celebratory confetti** - 6-second falling confetti animation on game completion

## Running the Game

### Development
```bash
# Start the development server
DATABASE_URL="postgresql://neondb_owner:npg_r2O4apgLCnjx@ep-super-star-afogs8jq-pooler.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require" PORT=4000 npm run dev
```

### Access the Game
- **Main game**: http://localhost:4000
- **Admin panel**: http://localhost:4000/admin

## Next Steps for Deployment

When you're ready to deploy to production:

1. **Choose a platform** (Railway, Vercel, Render, etc.)
2. **Set environment variables** with your Neon database URL
3. **Build and deploy** using the platform's instructions
4. **Initialize database** with `npm run db:push`

The game is fully functional and ready for deployment!

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