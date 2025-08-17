import { 
  gameConfigs, 
  envelopes, 
  gameStates,
  users,
  romanticPrizes,
  type GameConfig, 
  type InsertGameConfig, 
  type Envelope, 
  type InsertEnvelope,
  type GameState,
  type InsertGameState,
  type User, 
  type InsertUser,
  type RomanticPrize,
  type InsertRomanticPrize
} from "@shared/schema";
import { db } from "./db";
import { eq, asc } from "drizzle-orm";

export interface IStorage {
  // User methods (legacy)
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Game config methods
  getGameConfig(): Promise<GameConfig | undefined>;
  createOrUpdateGameConfig(config: InsertGameConfig): Promise<GameConfig>;
  
  // Envelope methods
  getAllEnvelopes(): Promise<Envelope[]>;
  createEnvelope(envelope: InsertEnvelope): Promise<Envelope>;
  updateEnvelope(id: string, envelope: Partial<InsertEnvelope>): Promise<Envelope | undefined>;
  deleteAllEnvelopes(): Promise<void>;
  
  // Game state methods
  getCurrentGameState(): Promise<GameState | undefined>;
  createOrUpdateGameState(state: InsertGameState): Promise<GameState>;
  resetGameState(): Promise<GameState>;
  startGame(): Promise<GameState>;
  cashOut(envelopeId: string): Promise<GameState>;

  // Romantic prizes methods
  getRomanticPrizes(): Promise<RomanticPrize[]>;
  initializeRomanticPrizes(): Promise<void>;
  getRandomRomanticPrizes(count: number): Promise<RomanticPrize[]>;
}

export class DatabaseStorage implements IStorage {
  // User methods (legacy)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Game config methods
  async getGameConfig(): Promise<GameConfig | undefined> {
    const [config] = await db.select().from(gameConfigs).limit(1);
    return config || undefined;
  }

  async createOrUpdateGameConfig(config: InsertGameConfig): Promise<GameConfig> {
    // Delete existing config and create new one (simple approach)
    await db.delete(gameConfigs);
    const [newConfig] = await db
      .insert(gameConfigs)
      .values(config)
      .returning();
    return newConfig;
  }

  // Envelope methods
  async getAllEnvelopes(): Promise<Envelope[]> {
    return await db.select().from(envelopes).orderBy(asc(envelopes.position));
  }

  async createEnvelope(envelope: InsertEnvelope): Promise<Envelope> {
    const [newEnvelope] = await db
      .insert(envelopes)
      .values(envelope)
      .returning();
    return newEnvelope;
  }

  async updateEnvelope(id: string, envelope: Partial<InsertEnvelope>): Promise<Envelope | undefined> {
    const [updatedEnvelope] = await db
      .update(envelopes)
      .set(envelope)
      .where(eq(envelopes.id, id))
      .returning();
    return updatedEnvelope || undefined;
  }

  async deleteAllEnvelopes(): Promise<void> {
    await db.delete(envelopes);
  }

  // Game state methods
  async getCurrentGameState(): Promise<GameState | undefined> {
    const [state] = await db.select().from(gameStates).limit(1);
    return state || undefined;
  }

  async createOrUpdateGameState(state: InsertGameState): Promise<GameState> {
    // Delete existing state and create new one
    await db.delete(gameStates);
    const [newState] = await db
      .insert(gameStates)
      .values(state)
      .returning();
    return newState;
  }

  async resetGameState(): Promise<GameState> {
    const config = await this.getGameConfig();
    const maxTries = config?.maxTries || 3;
    
    return this.createOrUpdateGameState({
      selectedEnvelopes: [],
      remainingTries: maxTries,
      isGameComplete: false,
      gameStarted: false,
      cashedOut: false,
      finalPrize: undefined,
      shuffledOrder: [],
    });
  }

  async startGame(): Promise<GameState> {
    const config = await this.getGameConfig();
    const maxTries = config?.maxTries || 3;
    const envelopes = await this.getAllEnvelopes();
    
    // Shuffle the envelope IDs to randomize prizes
    const shuffledOrder = [...envelopes.map(e => e.id)].sort(() => Math.random() - 0.5);
    
    return this.createOrUpdateGameState({
      selectedEnvelopes: [],
      remainingTries: maxTries,
      isGameComplete: false,
      gameStarted: true,
      cashedOut: false,
      finalPrize: undefined,
      shuffledOrder,
    });
  }

  async cashOut(envelopeId: string): Promise<GameState> {
    const currentState = await this.getCurrentGameState();
    if (!currentState) {
      throw new Error("No active game state");
    }

    const envelopes = await this.getAllEnvelopes();
    const envelope = envelopes.find(e => e.id === envelopeId);
    if (!envelope) {
      throw new Error("Envelope not found");
    }

    return this.createOrUpdateGameState({
      selectedEnvelopes: currentState.selectedEnvelopes,
      remainingTries: currentState.remainingTries,
      isGameComplete: true,
      gameStarted: currentState.gameStarted,
      cashedOut: true,
      finalPrize: envelope.prizeText,
      shuffledOrder: currentState.shuffledOrder,
    });
  }

  async timeUp(finalPrize: string): Promise<GameState> {
    const currentState = await this.getCurrentGameState();
    if (!currentState) {
      throw new Error("No active game state");
    }

    return this.createOrUpdateGameState({
      selectedEnvelopes: currentState.selectedEnvelopes,
      remainingTries: currentState.remainingTries,
      isGameComplete: true,
      gameStarted: currentState.gameStarted,
      cashedOut: false,
      finalPrize: finalPrize,
      shuffledOrder: currentState.shuffledOrder,
    });
  }

  // Romantic prizes methods
  async getRomanticPrizes(): Promise<RomanticPrize[]> {
    return await db.select().from(romanticPrizes).where(eq(romanticPrizes.isActive, true));
  }

  async initializeRomanticPrizes(): Promise<void> {
    // Check if prizes already exist
    const existingPrizes = await db.select().from(romanticPrizes).limit(1);
    if (existingPrizes.length > 0) {
      return; // Already initialized
    }

    // Bay Area romantic anniversary options
    const romanticOptions = [
      // Weekend Getaways & Hotels
      { prizeText: "Weekend getaway to Sausalito waterfront hotel", category: "weekend-getaway" },
      { prizeText: "Romantic stay at Cavallo Point Lodge with Golden Gate views", category: "weekend-getaway" },
      { prizeText: "Napa Valley luxury spa resort weekend", category: "weekend-getaway" },
      { prizeText: "Carmel-by-the-Sea cottage retreat with ocean views", category: "weekend-getaway" },
      { prizeText: "Half Moon Bay Ritz-Carlton oceanfront escape", category: "weekend-getaway" },
      
      // Scenic & Adventure Experiences
      { prizeText: "Golden Gate Bridge bike ride to Sausalito with ferry return", category: "scenic" },
      { prizeText: "Sunrise hot air balloon ride over Napa Valley", category: "scenic" },
      { prizeText: "Sunset kayaking tour under the Golden Gate Bridge", category: "scenic" },
      { prizeText: "Point Bonita Lighthouse sunset hike with suspension bridge", category: "scenic" },
      { prizeText: "Whale watching cruise around San Francisco Bay", category: "scenic" },
      { prizeText: "Private airplane sunset tour over the bay", category: "scenic" },
      
      // Fine Dining Experiences
      { prizeText: "Atelier Crenn: Michelin-starred 'poetic culinaria' tasting menu", category: "dining" },
      { prizeText: "Quince: opulent Michelin-starred Italian with plush interiors", category: "dining" },
      { prizeText: "Boulevard: classic American cuisine with Bay Bridge views", category: "dining" },
      { prizeText: "Waterbar dinner overlooking the bay (popular proposal spot)", category: "dining" },
      { prizeText: "Verjus: intimate French bistro with candlelit ambiance", category: "dining" },
      { prizeText: "Private chef five-star dinner experience at home", category: "dining" },
      
      // Cultural & Creative Experiences
      { prizeText: "Foreign Cinema: dinner while watching movies under the stars", category: "cultural" },
      { prizeText: "Couples pottery class with romantic 'Ghost' movie vibes", category: "cultural" },
      { prizeText: "Private dance lesson: salsa, swing, or ballroom", category: "cultural" },
      { prizeText: "California Academy of Sciences NightLife with planetarium shows", category: "cultural" },
      { prizeText: "Candlelight classical concert at St. Ignatius Church", category: "cultural" },
      { prizeText: "Wine tasting tour through Sonoma County vineyards", category: "cultural" },
      
      // Unique Activities
      { prizeText: "Church of 8 Wheels: adults-only roller disco in converted church", category: "unique" },
      { prizeText: "Mission Bowling Club: upscale bowling with gourmet dining", category: "unique" },
      { prizeText: "Alcatraz night tour: explore the infamous prison after dark", category: "unique" },
      { prizeText: "Couples massage at luxury spa in Union Square", category: "unique" },
      { prizeText: "Horse-drawn carriage ride through Golden Gate Park", category: "unique" },
      
      // Scenic Spots & Gardens
      { prizeText: "Japanese Tea Garden: tranquil paths, koi ponds, traditional architecture", category: "scenic" },
      { prizeText: "Crissy Field sunset picnic with Golden Gate Bridge views", category: "scenic" },
      { prizeText: "Lands End Trail: coastal hike with ocean views & Sutro Baths ruins", category: "scenic" },
      { prizeText: "Alamo Square: Painted Ladies views for romantic picnics", category: "scenic" }
    ];

    await db.insert(romanticPrizes).values(romanticOptions);
  }

  async getRandomRomanticPrizes(count: number): Promise<RomanticPrize[]> {
    // Get all active romantic prizes
    const allPrizes = await this.getRomanticPrizes();
    
    // Shuffle and take the requested count
    const shuffled = [...allPrizes].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }
}

export const storage = new DatabaseStorage();
