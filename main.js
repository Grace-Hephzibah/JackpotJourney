// IMPORTS
//---------------------
const prompt = require("prompt-sync")()

// SLOT MACHINE ENTITIES
//---------------------------
const ROWS = 3
const COLS = 3

const SYMBOLS_COUNT = {
    "💎" : 2, 
    "💳" : 4, 
    "💰" : 6, 
    "🍌" : 8
}

const SYMBOL_VALUES = {
    "💎" : 5, 
    "💳" : 4, 
    "💰" : 3, 
    "🍌" : 2
}


// 1. DEPOSIT SOME MONEY
//---------------------------------------------
const deposit = () => {
    while(true){
        const depositAmount = parseInt(prompt("Enter a deposit amount: "))

        if (isNaN(depositAmount) || depositAmount<=0)
            console.log("Invalid Deposit Amount. Try Again!")
        else
            return depositAmount
    }
}

// 2. DETERMINE THE NUMBER OF LINES TO BET ON
//---------------------------------------------
const getNumberOfLines = () => {
    while(true){
        const numberOfLines  = parseInt(prompt("Enter the number of lines to bet on (1-3): "))

        if (isNaN(numberOfLines) || numberOfLines<1 || numberOfLines>3)
            console.log("Invalid Number Of Lines. Try Again!")
        else
            return numberOfLines
    }
}

// 3. COLLECT THE BET AMOUNT
//---------------------------------------------
const getBet = (balance, number) => {
    while(true){
        const bet  = parseInt(prompt("Enter the bet per line: "))

        if (isNaN(bet) || bet<1 || bet>(balance/number))
            console.log("Invalid Bet. Try Again!")
        else
            return bet
    }
}

// 4. SPIN THE SLOT MACHINE
//---------------------------------------------
const spin = () => {
    const symbols = []
    for  (const [symbol, count] of Object.entries(SYMBOLS_COUNT))
    {
        for (let i=0; i<count; i++)
            symbols.push(symbol)
    }  
    const reels = [[], [], []]
    for (let i=0; i<COLS; i++){
        const reelSymbols = [...symbols]
        for (let j=0; j<ROWS; j++){
            const randomIndex = Math.floor(Math.random() * reelSymbols.length)
            const selectedSymbol = reelSymbols[randomIndex]
            reels[i].push(selectedSymbol)
            reelSymbols.splice(randomIndex, 1)
        }
    }
    return reels
}

// 5. CHECK IF THE USER WON
//---------------------------------------------
const transpose = (reels) => {
    const rows = []

    for (let i=0; i<ROWS; i++)
    {
        rows.push([])
        for (let j=0; j<COLS; j++)
            rows[i].push(reels[j][i])
    }
    return rows
}

const printRows = (rows) => {
    for(const row of rows) {
        let rowString = ""
        for (const[i, symbol] of row.entries()){
            rowString += symbol
            if (i != row.length-1)
                rowString += ' | '
        }
        console.log(rowString)
    }
}

const getWinnings = (rows, bet, lines) => {
    let winnings = 0
    for (let row=0;  row<lines; row++)
    {
        const symbols = rows[row];
        let allSame = true

        for (const symbol of symbols){
            if (symbol != symbols[0]){
                allSame = false
                break
            }
        }

        if (allSame){
            winnings += bet * SYMBOL_VALUES[symbols[0]]
        }
    }

    return winnings
}

// 6. THE MAIN GAME (LOOP)
//---------------------------------------------
const game = () => {
    let balance = deposit()
    while (true){
        console.log("You have a balance of $", balance)
        const numberOfLines = getNumberOfLines()

        const bet = getBet(balance, numberOfLines)
        balance -= bet * numberOfLines

        const reels = spin()
        const rows = transpose(reels)
        printRows(rows)

        const winnings = getWinnings(rows, bet, numberOfLines)
        balance += winnings

        console.log("You won, $" + winnings.toString())

        if (balance <=0 ){
            console.log("You Ran Out Of Money!")
            break
        }

        const playAgain = prompt("Do You Want to Continue Playing? (y/n) ")
        if (playAgain != 'y') break
    }
}

//---------------------------------------------
game()
//---------------------------------------------