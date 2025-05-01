/**
 * Number Guessing Game - Core Game Logic
 */
import readline from 'readline';
import { performance } from 'perf_hooks';

import { 
  DifficultyLevel, 
  GameState 
} from './types';
import { 
  GAME_CONFIG, 
  DIFFICULTIES, 
  MESSAGES, 
  HINTS,
  INPUT_VALIDATION 
} from './config';
import { 
  generateRandomNumber, 
  formatTime, 
  updateHighScore 
} from './utils';

/**
 * Main game class that encapsulates all game functionality
 */
export class NumberGuessingGame {
  private rl: readline.Interface;
  private question: (prompt: string) => Promise<string>;
  private state: GameState | null = null;
  
  /**
   * Initializes a new game instance
   */
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    
    // Promisify the question method for cleaner async/await usage
    this.question = (prompt: string): Promise<string> => {
      return new Promise((resolve) => {
        this.rl.question(prompt, resolve);
      });
    };
  }
  
  /**
   * Starts the game
   */
  public async start(): Promise<void> {
    try {
      this.displayWelcomeMessage();
      await this.playGame();
    } catch (error) {
      console.error('Game error:', error);
    }
  }
  
  /**
   * Displays the welcome message and game instructions
   */
  private displayWelcomeMessage(): void {
    console.log(MESSAGES.WELCOME);
    console.log(MESSAGES.THINKING);
    console.log(MESSAGES.SELECT_DIFFICULTY);
  }
  
  /**
   * Main game loop
   */
  private async playGame(): Promise<void> {
    const difficulty = await this.getDifficulty();
    this.initializeGame(difficulty);
    
    if (!this.state) {
      throw new Error('Game state not initialized');
    }
    
    // Main game loop
    let gameOver = false;
    while (!gameOver) {
      gameOver = await this.processRound();
    }
    
    // After game is over, ask to play again
    const playAgain = await this.askToPlayAgain();
    
    if (playAgain) {
      await this.playGame();
    } else {
      console.log(MESSAGES.THANKS);
      this.rl.close();
    }
  }
  
  /**
   * Gets the difficulty level from the user
   * @returns The selected difficulty level
   */
  private async getDifficulty(): Promise<DifficultyLevel> {
    const difficultyPrompt = Object.entries(DIFFICULTIES)
      .map(([key, config]) => `${key}. ${config.name} (${config.chances} chances)`)
      .join('\n');
    
    let validDifficulty = false;
    let difficulty: string = '';
    
    while (!validDifficulty) {
      difficulty = await this.question(`${difficultyPrompt}\n\nEnter your choice: `);
      
      if (this.validateDifficulty(difficulty)) {
        validDifficulty = true;
      } else {
        console.log(MESSAGES.INVALID_DIFFICULTY);
      }
    }
    
    return difficulty as DifficultyLevel;
  }
  
  /**
   * Validates if the input is a valid difficulty level
   * @param input - The user input
   * @returns Whether the input is a valid difficulty level
   */
  private validateDifficulty(input: string): input is DifficultyLevel {
    return ['1', '2', '3'].includes(input);
  }
  
  /**
   * Initializes a new game state
   * @param difficulty - The selected difficulty level
   */
  private initializeGame(difficulty: DifficultyLevel): void {
    const difficultyConfig = DIFFICULTIES[difficulty];
    console.log(difficultyConfig.message);
    console.log(MESSAGES.GAME_START);
    
    this.state = {
      targetNumber: generateRandomNumber(GAME_CONFIG.MIN_NUMBER, GAME_CONFIG.MAX_NUMBER),
      remainingChances: difficultyConfig.chances,
      attemptsMade: 0,
      difficulty,
      startTime: performance.now()
    };
  }
  
  /**
   * Processes a single round of the game
   * @returns Whether the game is over
   */
  private async processRound(): Promise<boolean> {
    if (!this.state) {
      throw new Error('Game state not initialized');
    }
    
    // Check if player is out of chances
    if (this.state.remainingChances <= 0) {
      this.handleGameLoss();
      return true;
    }
    
    const prompt = MESSAGES.HINT_PROMPT(this.state.remainingChances);
    const input = await this.question(prompt);
    
    // Check if player asked for a hint
    if (input.toLowerCase() === INPUT_VALIDATION.HINT_COMMAND) {
      await this.provideHint();
      return false;
    }
    
    // Process player's guess
    const guess = this.validateGuess(input);
    
    if (guess === null) {
      console.log(MESSAGES.INVALID_GUESS);
      return false;
    }
    
    this.state.attemptsMade++;
    this.state.remainingChances--;
    
    if (guess === this.state.targetNumber) {
      this.handleCorrectGuess();
      return true;
    } else {
      this.provideGuessFeedback(guess);
      return false;
    }
  }
  
  /**
   * Validates if the input is a valid guess
   * @param input - The user input
   * @returns The parsed guess number or null if invalid
   */
  private validateGuess(input: string): number | null {
    const guess = parseInt(input);
    if (isNaN(guess) || guess < GAME_CONFIG.MIN_NUMBER || guess > GAME_CONFIG.MAX_NUMBER) {
      return null;
    }
    return guess;
  }
  
  /**
   * Provides a random hint to the player
   */
  private async provideHint(): Promise<void> {
    if (!this.state) {
      throw new Error('Game state not initialized');
    }
    
    console.log(MESSAGES.HINT_COST);
    this.state.remainingChances--;
    
    // Choose a random hint
    const randomHint = HINTS[Math.floor(Math.random() * HINTS.length)];
    console.log(randomHint.generator(this.state.targetNumber));
    
    console.log(MESSAGES.CHANCES_LEFT(this.state.remainingChances));
  }
  
  /**
   * Handles the case when the player guesses correctly
   */
  private handleCorrectGuess(): void {
    if (!this.state) {
      throw new Error('Game state not initialized');
    }
    
    const endTime = performance.now();
    const elapsedTime = endTime - this.state.startTime;
    const formattedTime = formatTime(elapsedTime);
    
    console.log(MESSAGES.CORRECT_NUMBER(this.state.attemptsMade));
    console.log(MESSAGES.TIME_TAKEN(formattedTime));
    
    // Check for high score
    const isNewHighScore = updateHighScore(
      this.state.difficulty, 
      this.state.attemptsMade, 
      elapsedTime
    );
    
    if (isNewHighScore) {
      console.log(MESSAGES.NEW_HIGH_SCORE);
    }
  }
  
  /**
   * Handles the case when the player loses
   */
  private handleGameLoss(): void {
    if (!this.state) {
      throw new Error('Game state not initialized');
    }
    
    console.log(MESSAGES.OUT_OF_CHANCES);
    console.log(MESSAGES.NUMBER_WAS(this.state.targetNumber));
  }
  
  /**
   * Provides feedback on the player's guess
   * @param guess - The player's guess
   */
  private provideGuessFeedback(guess: number): void {
    if (!this.state) {
      throw new Error('Game state not initialized');
    }
    
    if (guess < this.state.targetNumber) {
      console.log(MESSAGES.INCORRECT_HIGHER(guess));
    } else {
      console.log(MESSAGES.INCORRECT_LOWER(guess));
    }
    
    console.log(MESSAGES.CHANCES_LEFT(this.state.remainingChances));
  }
  
  /**
   * Asks the player if they want to play again
   * @returns Whether the player wants to play again
   */
  private async askToPlayAgain(): Promise<boolean> {
    const answer = await this.question(MESSAGES.PLAY_AGAIN);
    return INPUT_VALIDATION.YES_RESPONSES.includes(answer.toLowerCase());
  }
}