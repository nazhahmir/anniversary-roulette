import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const gameConfigs = pgTable("game_configs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  envelopeCount: integer("envelope_count").notNull().default(6),
  maxTries: integer("max_tries").notNull().default(3),
});

export const envelopes = pgTable("envelopes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  position: integer("position").notNull(),
  prizeText: text("prize_text").notNull(),
  color: text("color").notNull(),
});

export const gameStates = pgTable("game_states", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  selectedEnvelopes: text("selected_envelopes").array().notNull().default([]),
  remainingTries: integer("remaining_tries").notNull(),
  isGameComplete: boolean("is_game_complete").notNull().default(false),
});

export const insertGameConfigSchema = createInsertSchema(gameConfigs).omit({
  id: true,
});

export const insertEnvelopeSchema = createInsertSchema(envelopes).omit({
  id: true,
});

export const insertGameStateSchema = createInsertSchema(gameStates).omit({
  id: true,
});

export type InsertGameConfig = z.infer<typeof insertGameConfigSchema>;
export type GameConfig = typeof gameConfigs.$inferSelect;

export type InsertEnvelope = z.infer<typeof insertEnvelopeSchema>;
export type Envelope = typeof envelopes.$inferSelect;

export type InsertGameState = z.infer<typeof insertGameStateSchema>;
export type GameState = typeof gameStates.$inferSelect;

// Legacy user schema (keeping for compatibility)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
