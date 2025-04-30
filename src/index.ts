import readline from "node:readline";

const DIFFICULTY_MESSAGE = {
    "1": "Great! You have selected the Easy difficulty level.",
    "2": "Great! You have selected the Medium difficulty level.",
    "3": "Great! You have selected the Difficult difficulty level."
} as const;
//console.log(DIFFICULTY_MESSAGE)
const DIFFICULTY_CHANCES = {
    "1": 10,
    "2": 5,
    "3": 3
} as const;

function guessingGame() {
  console.log("Welcome to the Number Guessing Game!");
  console.log("I'm thinking of a number between 1 and 100.");
  console.log("You have 5 chances to guess the correct number.");
  console.log("Please select the difficulty level:");

  const rl =  readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question(
    `1. Easy (10 chances)
2. Medium (5 chances)
3. Hard (3 chances)`,
    (data: string) => {
        const inputVal = data as keyof typeof DIFFICULTY_CHANCES;
        let chances = DIFFICULTY_CHANCES[inputVal];
        let number = Math.floor(Math.random() * 100) + 1;
        const outputMessage = data as keyof typeof DIFFICULTY_MESSAGE;
        console.log(outputMessage[inputVal]);
        console.log("Let's start the game!");
        let guesses = 0;
        handleGuess(rl, number, chances, guesses);
        
    }
  );
}

function handleGuess(rl : readline.Interface, number: number, chances : number, guesses: number) {
    if(chances < 1) {
        console.log("You are out of chances.")
        console.log("The number was: "+number)
        rl.close();
        return;
    }
    rl.question(`Enter your choice:`, (guessedValue: string) => {
        guesses++;
        chances--;
            if(guessedValue === number.toString()) {
                console.log(`Congratulations! You guessed the correct number in ${guesses} attempts.`);
                rl.close(); 
                return;
            } else {
                console.log(`Incorrect! The number is`+  `${+guessedValue > +number ? ' lesser ' : ' greater '}` + `than ${guessedValue}.`);
                return handleGuess(rl, number, chances, guesses);
            }
    });
    
  }
  

guessingGame();
