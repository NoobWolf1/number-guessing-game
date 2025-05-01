/**
 * Configuration constants for the Number Guessing Game
 */
import { DifficultyConfig, DifficultyLevel, Hint } from './types';

/**
 * Main game configuration parameters
 */
export const GAME_CONFIG = {
  /**
   * Minimum possible number in the guessing range
   */
  MIN_NUMBER: 1,

  /**
   * Maximum possible number in the guessing range
   */
  MAX_NUMBER: 100,
  
  /**
   * Path to store high scores
   */
  HIGH_SCORES_PATH: './data/highscores.json'
};

/**
 * Input validation constants
 */
export const INPUT_VALIDATION = {
  /**
   * Valid responses for "yes" prompts
   */
  YES_RESPONSES: ['y', 'yes'],
  
  /**
   * Command to request a hint
   */
  HINT_COMMAND: 'hint'
};

/**
 * Difficulty settings for each level
 */
export const DIFFICULTIES: Record<DifficultyLevel, DifficultyConfig> = {
  '1': {
    name: 'Easy',
    chances: 10,
    message: 'Great! You have selected the Easy difficulty level.'
  },
  '2': {
    name: 'Medium',
    chances: 5,
    message: 'Great! You have selected the Medium difficulty level.'
  },
  '3': {
    name: 'Hard',
    chances: 3,
    message: 'Great! You have selected the Difficult difficulty level.'
  }
};

/**
 * User interface text messages
 */
export const MESSAGES = {
  WELCOME: 'Welcome to the Number Guessing Game!',
  THINKING: `I'm thinking of a number between ${GAME_CONFIG.MIN_NUMBER} and ${GAME_CONFIG.MAX_NUMBER}.`,
  SELECT_DIFFICULTY: 'Please select the difficulty level:',
  GAME_START: "Let's start the game!",
  INVALID_DIFFICULTY: 'Invalid selection. Please enter 1, 2, or 3.',
  INVALID_GUESS: `Please enter a valid number between ${GAME_CONFIG.MIN_NUMBER} and ${GAME_CONFIG.MAX_NUMBER}.`,
  OUT_OF_CHANCES: 'You are out of chances.',
  CORRECT_NUMBER: (attempts: number) => `Congratulations! You guessed the correct number in ${attempts} attempt${attempts === 1 ? '' : 's'}.`,
  INCORRECT_HIGHER: (guess: number) => `Incorrect! The number is greater than ${guess}.`,
  INCORRECT_LOWER: (guess: number) => `Incorrect! The number is less than ${guess}.`,
  TIME_TAKEN: (seconds: string) => `Time taken: ${seconds} seconds`,
  NUMBER_WAS: (num: number) => `The number was: ${num}`,
  NEW_HIGH_SCORE: 'New high score!',
  PLAY_AGAIN: 'Do you want to play again (y/n)?',
  THANKS: 'Thanks for playing!',
  CHANCES_LEFT: (chances: number) => `You have ${chances} chance${chances === 1 ? '' : 's'} left.`,
  HINT_COST: 'Using a hint costs one chance.',
  HINT_PROMPT: (chances: number) => `Enter your guess (${chances} chances left) or type 'hint' for a clue: `
};

/**
 * Available hints for the game
 */
export const HINTS: Hint[] = [
  {
    description: 'Even/Odd',
    generator: (num: number) => `The number is ${num % 2 === 0 ? 'even' : 'odd'}.`
  },
  {
    description: 'Digit Sum',
    generator: (num: number) => {
      const sum = num.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
      return `The sum of the digits is ${sum}.`;
    }
  },
  {
    description: 'Range',
    generator: (num: number) => {
      const nearestTen = Math.floor(num / 10) * 10;
      return `The number is between ${nearestTen} and ${nearestTen + 10}.`;
    }
  },
  {
    description: 'Multiple',
    generator: (num: number) => {
      // Find a small divisor
      for (let i = 2; i <= 5; i++) {
        if (num % i === 0) {
          return `The number is a multiple of ${i}.`;
        }
      }
      return `The number is not a multiple of any number between 2 and 5.`;
    }
  }
];