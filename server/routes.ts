import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGameConfigSchema, insertEnvelopeSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Game config routes
  app.get("/api/game-config", async (req, res) => {
    try {
      const config = await storage.getGameConfig();
      if (!config) {
        // Return default config if none exists
        return res.json({ envelopeCount: 6, maxTries: 3 });
      }
      res.json(config);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch game config" });
    }
  });

  app.post("/api/game-config", async (req, res) => {
    try {
      const validatedData = insertGameConfigSchema.parse(req.body);
      const config = await storage.createOrUpdateGameConfig(validatedData);
      res.json(config);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid game config data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to save game config" });
    }
  });

  // Envelope routes
  app.get("/api/envelopes", async (req, res) => {
    try {
      const envelopes = await storage.getAllEnvelopes();
      res.json(envelopes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch envelopes" });
    }
  });

  app.post("/api/envelopes", async (req, res) => {
    try {
      const validatedData = insertEnvelopeSchema.parse(req.body);
      const envelope = await storage.createEnvelope(validatedData);
      res.json(envelope);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid envelope data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create envelope" });
    }
  });

  app.post("/api/envelopes/bulk", async (req, res) => {
    try {
      const envelopesData = z.array(insertEnvelopeSchema).parse(req.body);
      
      // Clear existing envelopes
      await storage.deleteAllEnvelopes();
      
      // Create new envelopes
      const createdEnvelopes = [];
      for (const envelopeData of envelopesData) {
        const envelope = await storage.createEnvelope(envelopeData);
        createdEnvelopes.push(envelope);
      }
      
      res.json(createdEnvelopes);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid envelopes data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to save envelopes" });
    }
  });

  // Game state routes
  app.get("/api/game-state", async (req, res) => {
    try {
      let gameState = await storage.getCurrentGameState();
      if (!gameState) {
        // Create initial game state if none exists
        gameState = await storage.resetGameState();
      }
      res.json(gameState);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch game state" });
    }
  });

  app.post("/api/game-state/select-envelope", async (req, res) => {
    try {
      const { envelopeId } = req.body;
      if (!envelopeId) {
        return res.status(400).json({ message: "Envelope ID is required" });
      }

      const currentState = await storage.getCurrentGameState();
      if (!currentState) {
        return res.status(400).json({ message: "No active game state" });
      }

      if (currentState.remainingTries <= 0) {
        return res.status(400).json({ message: "No tries remaining" });
      }

      if (currentState.selectedEnvelopes.includes(envelopeId)) {
        return res.status(400).json({ message: "Envelope already selected" });
      }

      const newSelectedEnvelopes = [...currentState.selectedEnvelopes, envelopeId];
      const newRemainingTries = currentState.remainingTries - 1;
      const isGameComplete = newRemainingTries <= 0;

      let finalPrize = currentState.finalPrize;
      
      // If this is the last try, automatically assign the final prize
      if (isGameComplete && currentState.shuffledOrder.length > 0) {
        const envelopes = await storage.getAllEnvelopes();
        const remainingEnvelopeIds = currentState.shuffledOrder.filter(id => !newSelectedEnvelopes.includes(id));
        if (remainingEnvelopeIds.length > 0) {
          const finalEnvelope = envelopes.find(e => e.id === remainingEnvelopeIds[0]);
          if (finalEnvelope) {
            finalPrize = finalEnvelope.prizeText;
          }
        }
      }

      const updatedState = await storage.createOrUpdateGameState({
        selectedEnvelopes: newSelectedEnvelopes,
        remainingTries: newRemainingTries,
        isGameComplete,
        gameStarted: currentState.gameStarted,
        cashedOut: currentState.cashedOut,
        finalPrize,
        shuffledOrder: currentState.shuffledOrder,
      });

      res.json(updatedState);
    } catch (error) {
      res.status(500).json({ message: "Failed to update game state" });
    }
  });

  app.post("/api/game-state/reset", async (req, res) => {
    try {
      const resetState = await storage.resetGameState();
      res.json(resetState);
    } catch (error) {
      res.status(500).json({ message: "Failed to reset game state" });
    }
  });

  app.post("/api/game-state/start", async (req, res) => {
    try {
      const gameState = await storage.startGame();
      res.json(gameState);
    } catch (error) {
      res.status(500).json({ message: "Failed to start game" });
    }
  });

  app.post("/api/game-state/cash-out", async (req, res) => {
    try {
      const { envelopeId } = req.body;
      if (!envelopeId) {
        return res.status(400).json({ message: "Envelope ID is required" });
      }

      const gameState = await storage.cashOut(envelopeId);
      res.json(gameState);
    } catch (error) {
      res.status(500).json({ message: "Failed to cash out" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
