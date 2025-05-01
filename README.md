# Number Guessing Game

A CLI-based number guessing game built with TypeScript following enterprise-level best practices.

## Features

- Three difficulty levels (Easy, Medium, Hard)
- High score tracking
- Timer to measure guessing speed
- Hint system
- Input validation
- Detailed feedback during gameplay

## Project Structure

```
number-guessing-game/
├── src/
│   ├── config.ts        # Game configuration and constants
│   ├── game.ts          # Core game logic
│   ├── index.ts         # Main entry point
│   ├── types.ts         # Type definitions
│   └── utils.ts         # Utility functions
├── data/
│   └── highscores.json  # High score storage (created automatically)
├── package.json
├── tsconfig.json
├── .eslintrc.json
└── README.md
```

## Installation

1. Clone the repository
2. Install dependencies
   ```
   npm install
   ```

## Running the Game

### Development Mode
```
npm run dev
```

### Production Mode
```
npm run build
npm start
```

## Game Rules

1. The computer randomly selects a number between 1 and 100
2. Player selects a difficulty level:
   - Easy: 10 chances
   - Medium: 5 chances
   - Hard: 3 chances
3. Player guesses the number
4. Feedback is provided after each guess
5. Game ends when the player guesses correctly or runs out of chances
6. High scores are tracked for each difficulty level

## Commands

- Enter a number between 1-100 to make a guess
- Type "hint" to receive a clue (costs one chance)
- After the game, type "y" or "yes" to play again

## Development

### Linting
```
npm run lint
```

### Testing
```
npm test
```

### Cleaning Build Files
```
npm run clean
```

## License

MIT