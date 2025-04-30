import readline from "node:readline";

const DIFFICULTY_MESSAGE = {
    "1": "Great! You have selected the Easy difficulty level.",
    "2": "Great! You have selected the Medium difficulty level.",
    "3": "Great! You have selected the Difficult difficulty level."
} as const;
const DIFFICULTY_CHANCES = {
    "1": 10,
    "2": 5,
    "3": 3
} as const;

const rl =  readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

function guessingGame() {
  console.log("Welcome to the Number Guessing Game!");
  console.log("I'm thinking of a number between 1 and 100.");
  console.log("Please select the difficulty level:");

  rl.question(
    `1. Easy (10 chances)
2. Medium (5 chances)
3. Hard (3 chances)

Enter your choice: `,
    (data: string) => {
        if (!["1", "2", "3"].includes(data)) {
            console.log("Invalid selection. Please enter 1, 2, or 3.");
            return guessingGame();
        }
        const inputVal = data as keyof typeof DIFFICULTY_CHANCES;
        let chances = DIFFICULTY_CHANCES[inputVal];
        let number = Math.floor(Math.random() * 100) + 1;
        
        const outputMessage = data as keyof typeof DIFFICULTY_MESSAGE;
        console.log(DIFFICULTY_MESSAGE[inputVal]);
        console.log("Let's start the game!");
        let guesses = 0;
        handleGuess(number, chances, guesses);
        
    }
  );
}
function handlePlayAgain() {
    rl.question(`Do you want to play again (y/n)?`, (input: string) => {
        if(input === 'y' || input === 'Y') {
            guessingGame();
        } else {
            rl.close();
        }
    });
}

function handleGuess(number: number, chances : number, guesses: number) {
    if(chances < 1) {
        console.log("You are out of chances.");
        console.log("The number was: "+number);
        return handlePlayAgain();
    }
    rl.question(`Enter your choice (${chances} chances left):`, (guessedValue: string) => {
        const guess = parseInt(guessedValue);
        if(isNaN(guess) || guess < 1 || guess > 100)
            {
                console.log("Please enter a valid number under 1 and 100.")
                return(handleGuess(number, chances, guesses));
            }
            guesses++;
        if(guessedValue === number.toString()) {
            console.log(`Congratulations! You guessed the correct number in ${guesses} attempts.`);
            return handlePlayAgain();
        } else {
            console.log(`Incorrect! The number is`+  `${+guessedValue > +number ? ' lesser ' : ' greater '}` + `than ${guessedValue}.`);
        return handleGuess(number, chances - 1, guesses);
        }
    });
    
  }
  

guessingGame();
