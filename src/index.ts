/**
 * Number Guessing Game - Main Entry Point
 * 
 * This file initializes and starts the game.
 * 
 * @author Your Name
 * @version 1.0.0
 */
import { NumberGuessingGame } from './game';

/**
 * Initialize and start the game
 */
async function main(): Promise<void> {
  try {
    const game = new NumberGuessingGame();
    await game.start();
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Start the game
main(); 