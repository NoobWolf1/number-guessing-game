/**
 * Utility functions for the Number Guessing Game
 */
import fs from 'fs';
import path from 'path';
import { HighScores, HighScoreEntry, DifficultyLevel } from './types';
import { GAME_CONFIG } from './config';

/**
 * Checks if a number is prime
 * @param num - The number to check
 * @returns True if the number is prime, false otherwise
 */
export function isPrime(num: number): boolean {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  
  let i = 5;
  while (i * i <= num) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
    i += 6;
  }
  
  return true;
}

/**
 * Formats time in seconds to a string with 2 decimal places
 * @param milliseconds - Time in milliseconds
 * @returns Formatted time string in seconds
 */
export function formatTime(milliseconds: number): string {
  return (milliseconds / 1000).toFixed(2);
}

/**
 * Generates a random number between min and max (inclusive)
 * @param min - Minimum possible value
 * @param max - Maximum possible value
 * @returns Random number in the specified range
 */
export function generateRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Maps difficulty level to its corresponding key in the high scores object
 * @param difficulty - The difficulty level
 * @returns The corresponding key in high scores
 */
export function difficultyToScoreKey(difficulty: DifficultyLevel): keyof HighScores {
  switch (difficulty) {
    case '1': return 'easy';
    case '2': return 'medium';
    case '3': return 'hard';
    default: return 'easy'; // Should never happen with proper typing
  }
}

/**
 * Ensures the directory for a file path exists
 * @param filePath - Path to check/create directories for
 */
export function ensureDirectoryExists(filePath: string): void {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}

/**
 * Loads high scores from storage
 * @returns The current high scores
 */
export function loadHighScores(): HighScores {
  try {
    ensureDirectoryExists(GAME_CONFIG.HIGH_SCORES_PATH);
    
    if (!fs.existsSync(GAME_CONFIG.HIGH_SCORES_PATH)) {
      return createDefaultHighScores();
    }
    
    const data = fs.readFileSync(GAME_CONFIG.HIGH_SCORES_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading high scores:', error);
    return createDefaultHighScores();
  }
}

/**
 * Creates a default high scores object
 * @returns Default high scores
 */
export function createDefaultHighScores(): HighScores {
  const defaultEntry: HighScoreEntry = {
    guesses: Infinity,
    time: Infinity,
    date: new Date().toISOString()
  };
  
  return {
    easy: { ...defaultEntry },
    medium: { ...defaultEntry },
    hard: { ...defaultEntry }
  };
}

/**
 * Saves high scores to storage
 * @param scores - High scores to save
 */
export function saveHighScores(scores: HighScores): void {
  try {
    ensureDirectoryExists(GAME_CONFIG.HIGH_SCORES_PATH);
    fs.writeFileSync(GAME_CONFIG.HIGH_SCORES_PATH, JSON.stringify(scores, null, 2));
  } catch (error) {
    console.error('Error saving high scores:', error);
  }
}

/**
 * Updates high scores if a new record is achieved
 * @param difficulty - The difficulty level
 * @param guesses - Number of guesses made
 * @param time - Time taken in milliseconds
 * @returns True if a new high score was achieved, false otherwise
 */
export function updateHighScore(difficulty: DifficultyLevel, guesses: number, time: number): boolean {
  const scores = loadHighScores();
  const key = difficultyToScoreKey(difficulty);
  const timeInSeconds = time / 1000;
  
  // Check if we have a new high score (fewer guesses or same guesses but faster time)
  if (guesses < scores[key].guesses || 
      (guesses === scores[key].guesses && timeInSeconds < scores[key].time)) {
    
    scores[key] = {
      guesses,
      time: timeInSeconds,
      date: new Date().toISOString()
    };
    
    saveHighScores(scores);
    return true;
  }
  
  return false;
}