/**
 * Type definitions for the number guessing game
 */

/**
 * Difficulty level identifiers
 */
export type DifficultyLevel = '1' | '2' | '3';

/**
 * Configuration for difficulty levels
 */
export interface DifficultyConfig {
  name: string;
  chances: number;
  message: string;
}

/**
 * Game state interface to track current game progress
 */
export interface GameState {
  targetNumber: number;
  remainingChances: number;
  attemptsMade: number;
  difficulty: DifficultyLevel;
  startTime: number;
}

/**
 * High score entry structure
 */
export interface HighScoreEntry {
  guesses: number;
  time: number; // in seconds
  date: string;
}

/**
 * High scores for all difficulty levels
 */
export interface HighScores {
  easy: HighScoreEntry;
  medium: HighScoreEntry;
  hard: HighScoreEntry;
}

/**
 * Interface for hint functions
 */
export interface Hint {
  description: string;
  generator: (num: number) => string;
}