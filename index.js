//Lets make blackjack! The rules of blackjack are that you get cards with either a value of 2-9, 10, or 11/1(Depending on the context.), each with a set ratio depending on the decks. We can default to two decks. What's the cycle of the game? First, you have betting funds and THEN you decide what your bet amount is from: 1/5/25/50/100. Afterwards, the cycle of "Hit/Stand", then the house plays and you're both compared to each other. That decides on the winner. If you lose, you don't get any of your money. If you win, you get twice your money back.

//Lets pesudo it

//Have a betfunds amount + its HTML equivalence.
//Get betAmount from bet buttons.
//Make bet buttons and funds disappear.
//Make betAmount appear.

//Now, we've started the game.

//Give 2 cards to each player.

//Let player Hit or Stand.
//If on hit = over 21 => Lose.
//If on hit = below 21 => Simply update sum.
//If on hit = 21 => Update sum and move to House.
//On stand - Move to house, house plays. If house gets over 21, you instantly win. If house gets 21, instantly compare. Otherwise, house follows its conditions when to take another or compare.

//Before the BEFORE, define players.
const player = 0;
const house = 1;
//Before anything, define cards.
const deck = 52;
const decks = 2;
const cards = deck*decks; 
//Now, percentage chances for each card.
const numCardsPerc = 32/deck;
const faceCardsPerc = 16/deck;
const aceCardsPerc = 4/deck;
// console.log(`PERCENTAGE OF NUMBER: ${numCardsPerc*100}%`)
//Now, range of numbers
const numCardsRange = [2, 9];
const faceCardsRange = [10, 10];
const aceCardsRange = [[11, 11], [1, 1]]; //Option 1 and option 2 of ace behavior.


//Start by assigning ALL the buttons.

//All the pre-start buttons declared here:
let startBtn = document.getElementById("start-btn") //Start button - We already have it.
//Start button availability
let canStart = false;
function startAvailability(){
    if (betAmount <= 0) //If 0 or less, make unavailable.
    {startBtn.classList.add("unavailable"); canStart = false;}
    else{startBtn.classList.remove("unavailable"); canStart = true;}
}

let betBtns = document.querySelectorAll(".bet-btns") //Bet buttons

//All the post-start buttons declared here:
let actBtns = document.querySelectorAll(".act-btns")


//All the displays declared here:
let betFunds = 500; //Starting funds
let betFundsHtml = document.getElementById("bet-funds");
let betAmount = 0;
let betAmountHtml = document.getElementById("bet-amount");
let playerCards = [[], []];
let playerSums = [0, 0];
let playerCardsHtml = document.querySelectorAll(".player-cards")
let player1CardsDisplay = document.getElementById("player-cards")
let player2CardsDisplay = document.getElementById("house-cards")


function updateDisplay(){   //Reflect bet values in HTML
    betFundsHtml.textContent = `Bet funds: $${betFunds}`    //Initiate values.
    betAmountHtml.textContent = `Bet amount: $${betAmount}`    //Initiate values.
}
updateDisplay();    //Initiate update on run.
startAvailability();

//Make an event listener for each bet button.
betBtns.forEach(element => {
    element.addEventListener('click', function(event) {
        let num = Number(event.currentTarget.textContent);  //The amount to add/subtract.
        if (betAmount + num < 0) //Can't bet below 0 - Clamp to 0.
        {betAmount = 0; updateDisplay();}
        else if (betAmount + num > betFunds)//Can't exceed funds
        {betAmount = betFunds; updateDisplay();} else {
        betAmount += num;   //Add/subtract properly.
        updateDisplay();  //project in html.
        }
        
        //Start availability.
        startAvailability();
    });
});

//Good. We've finished pre-round preparation. Now, To keep the flow going, I want to decide what happens on a win or lose, since this is the CORE and TARGET of the game.
//Every time a round ends, reset to a default state. What is the default state? Bet amount at 0, bet buttons showing up again, bet funds showing up again. All those disappear on start. So we could say instead of reset - start and end.

//At the start, they get cards. So first, lets give them cards.
//How do we give them cards? Well, a function that gives cards in a set percentage and behavior for each card.
//Note: This acts on an assumption that playerSums and playerCards are empty.
//refresh: playerSums = [0, 0] |  playerCards = [[], []]  |
//Percentage chances for each card:  
console.log(`${numCardsPerc} ${faceCardsPerc} ${aceCardsPerc}`)
//We need a helper function to push the right card.

function pushedCard(min, max){    //This pushes. Alternatively, return.
    //Get a number random between min and max, including. Then, return it.
    const cardPushed = (Math.floor(Math.random() * (max - min+1) +min)); //+1 Includes max.
    return cardPushed;
};
function pushCardAndSum(player, cardToPush){
    playerCards[player].push(cardToPush);
    playerSums[player] += cardToPush
};

function giveCard(player){  //player takes player or house
    //Get a random number 0-1
    let ranNum = Math.random()
    //Have ifs for every type of card according to percentages.
    if (ranNum < numCardsPerc)      //numCards% chance to get numCards
    {pushCardAndSum(player, pushedCard(numCardsRange[0], numCardsRange[1]))
    }  
    else if (ranNum < numCardsPerc + faceCardsPerc) //faceCards% chance to get faceCards
    {pushCardAndSum(player, pushedCard(faceCardsRange[0], faceCardsRange[1]))
    }
    else if (ranNum < numCardsPerc + faceCardsPerc + aceCardsPerc)//aceCards% chance to get aceCards
    {
        let pushedAceCard = pushedCard(aceCardsRange[0][0], aceCardsRange[0][1])
        //Implement Ace logic
        if (pushedAceCard + playerSums[player] <= 21) //If ace would give less than or 21, add 11.
        {pushCardAndSum(player, pushedCard(aceCardsRange[0][0], aceCardsRange[0][1]))} else{
            pushCardAndSum(player, pushedCard(aceCardsRange[1][0], aceCardsRange[1][1])) //add 1.
        }
    }
}

function assignStartingCards(){
    giveCard(player); //Give two cards to player.
    giveCard(player);
    
    giveCard(house); //Give two cards to house.
    giveCard(house);
    updateCards()
    //CHECK FOR BLACKJACK!!! IF SO, STAND!
    if (playerSums[player] === 21)
    {
        stand(player);
    }
};


//After being assigned, change them.
function updateCards(){
    //Update player display
    player1CardsDisplay.textContent = `Player Cards: \n${playerCards[player].join("+")}. Sum:${playerSums[player]}.` 
    //Update house display
    player2CardsDisplay.textContent = `House Cards: \n${playerCards[house].join("+")}. Sum:${playerSums[house]}.` 
}




//Core game flow goes here:


function start(){
    //Hide, betBtns, startBtn, cards. - add .inactive
    betBtns.forEach(element => {
        element.classList.add("inactive")
    });
    startBtn.classList.add("inactive")
    playerCardsHtml.forEach(element =>{
       element.classList.remove("inactive") 
    });
    //Deduct betAmount from betFunds.
    betFunds -= betAmount;
    //Give 2 cards to each player.
    assignStartingCards() //getCard(); twice and assign to txt.
    //Show Hit, Double, Stand buttons.
    actBtns.forEach(element => {
    element.classList.remove("inactive")
    })
    //Update betfunds.
    betFundsHtml.textContent = `Bet funds: $${betFunds}`
    updateCards()
}

startBtn.addEventListener('click', () => {
        if (canStart)  //Can only bet more than 0
        {start();};
});


function end(results){
    //Compare playerSums, decide on winner, update funds and Amt.
    if (results === 'win')
    {
        win();
    }
    else if (results === 'lose')
    {
        lose();
    }
    else if (didWin === 'tie')
    {
        //Give money back
        betFunds += betAmount;
        console.log("TIE! NOBODY WINS!")
    }
    betAmount = 0;
    // betAmountHtml.textContent = `Bet amount: $${betAmount}` //Reset bet amount text.
    // betFundsHtml = `Bet funds: $${betFunds}`        //Reset bet funds text.
    updateDisplay();
    updateCards();
    
    //Reset cards and sums for the next round:
    //SET A LITTLE DELAY CUZ OF BUGS - Update happens after
    setTimeout(() => {
        playerCards = [[], []];
        playerSums = [0, 0];
    }, 15); // 15 milliseconds

    
    // updateDisplay();
    // updateCards();
    //Hide actBtns + player1cards + player2cards.
    actBtns.forEach(element => {
       element.classList.add("inactive") 
    });
    // player1CardsDisplay.classList.add("inactive")
    // player2CardsDisplay.classList.add("inactive")
    //Show betBtns and startBtn
    betBtns.forEach(element => {
        element.classList.remove("inactive")
    });
    startBtn.classList.remove("inactive")
    
    // start();
    //I think it's finished.
    //NOW I NEED TO FINISH THIS THING AND GO BACK TO STAND.
}
function lose(){
    //Don't give money back. Infact, don't do shit for now.
}
function win(){
    //Give back double the betAmount.
    betFunds += betAmount*2;
}
// function decideWinner()
// {
//     //Firstly, are over 21 cases already accounted for? Yes, in hit();
//     //Now, compare between 
// }

//Now that we're during the game, we have to actualize each of the actBtns and house's play.
//Hit, Double, Stand.     Then, house can use the same functions but automatically.
//Note: The order is according to the visual order on the screen.
//Another note: We already have a listener for each button. Keep a mental note.
let hitBtn = document.getElementById("hit-btn");
let doubleBtn = document.getElementById("double-btn");
let standBtn = document.getElementById("stand-btn");


function hit(player){   //Recieves player or house.
    //Or here or in give cards: Check for 11 with indexOf - If found and you'd lose yada yada yada.
    
    //THIS SHOULD RUN SOME STAND INSTEAD OF END! MAKE SURE OF IT!
    //SECOND PROBLEM: DEALER BEHAVIOR IS NOT A LOOP!
    
    //Give card and update cards.
    giveCard(player); //Does this update ACTUAL cards and sum? Yes.
    updateCards()
    if (playerSums[player] === 21)  //If blackjack, automatically stand.
    {stand(player);}
    if (playerSums[player] > 21)    //If over blackjack, automatically lose. BUT THIS INCLUDES HOUSE
    {
        //check for soft hand
        let aceIndex = playerCards[player].indexOf(11) //returns -1 if not found
        if (aceIndex === -1) //If no ace
        {
            //Wtf both conditions do the same thing. Btw, something's wrong here, I win and not lose.
            if (player === 0) //Wtf 
            {stand(player);}//Lost - Calculated nextly.
            else if (player === 1) {stand(player);}//Won.
        }else //If ace
        {
            //We need to change the cards&sum as well as check the new sum doesn't go above 21.
            playerCards[player][aceIndex] = 1; //Change ace to 1.
            playerSums[player] -= 10; //Subtract from sum.
            updateCards();
        }
    }
}
function double(player){
    //If player has Bet funds equivalent to or more than of betAmount, allow. Else, unavailable.
    if (betAmount <= betFunds){
        //Double Amt, update Funds. Then, update both AmountHTML and FundsHTML. Lastly,  hit.
        betFunds -= betAmount;
        betAmount *= 2;
        betFundsHtml.textContent = `Bet funds: ${betFunds}`
        betAmountHtml.textContent = `Bet amount: ${betAmount}`
        hit(player) //Hit - player.
    }else{
        doubleBtn.classList.add("unavailable")
    }
}

function stand(player){
    //Let house play and decide on winner.
    //If it's house and if it's player. Why needed? Cuz else it's complicated.
    if (player === 0)
    {
        houseplay();
    }
    else{compareWinner();}
    
    // {console.log("Error - stand(player). unexpected function argument (player).")}
}
    
function houseplay()//If this has any variables that don't exist, move above stand.
{
    //Notes: Deal with holecard(the first dealer card) - This needs to be done around givecards/disp
    //so lets psuedo it:
    let aceIndex = playerCards[house].indexOf(11) //returns -1 if not found
    if (aceIndex === -1) 
    {
        if (playerSums[house] <= 16)
            {
                while (playerSums[house] <= 16)
                {
                    hit(house);
                }
                stand(house);
            }
        else
        {
            stand(house);
        }
    }
    else if (aceIndex != -1)
    {
        if (playerSums[house] <= 17)
        {
            while (playerSums[house] <= 17)
            {
                hit(house);
            }
            stand(house);
        }
        else 
        {stand(house);}
    }
}


function compareWinner(){
    if (playerSums[player] > 21)
    {end('lose');}
    else if (playerSums[player] > playerSums[house]) //If our sum is higher.
    {end('win');} //Won game
    else if (playerSums[player] === playerSums[house])
    {end('tie')}else
    {end('lose');} //Otherwise, we lost.
}

//HEY, I'M HERE! REMOVE ME AFTER! GOAL: MAKE DEALER'S FIRST CARD HIDDEN AND HIDE ME! THEN FIX TIE BEHAVIOR! IT DOESNT REALLY REMOVE SHIT! AND WHY DOES 21 LET ME PLAY? IT SHOULD LOOP OMG!

//Now lets listen for each button. Why not put it in the listen? Cuz we can re-use them for house.
//Here, we can also judge the win and loss requirements. Or do it in hit. I'll decide.

hitBtn.addEventListener('click', e => {
    hit(player);
});

doubleBtn.addEventListener('click', e => {
    double(player);
});

standBtn.addEventListener('click', e => {
    stand(player);
});














// let firstCard = 10
// let secondCard = 11
// let sum = firstCard + secondCard
// let hasBlackJack = false
// // 1. Create a variable called isAlive and assign it to true

// // 2. Flip its value to false in the appropriate code block 
// if (sum <= 20) {
//     console.log("Do you want to draw a new card? 🙂")
// } else if (sum === 21) {
//     console.log("Wohoo! You've got Blackjack! 🥳")
//     hasBlackJack = true
// } else {
//     console.log("You're out of the game! 😭")
// }

// // 3. Log it out to check that you're doing it right



    // playerCardsHtml.forEach(element => {
    //     let txtContFirst = element.textContent.split(" ")[0];
    //     if (txtContFirst === "Player")//For Player:
    //     {
    //         element.textContent = `Player Cards: \n${playerCards[player].join("+")}. Sum:${playerSums[player]}.`;
    //         console.log(element.textContent);
    //     } 
    //     else //For House:
    //     {
    //         element.textContent = `House Cards: \n${playerCards[house].join("+")}. Sum:${playerSums[house]}.`;
    //         console.log(element.textContent);
    //     };
    // });
    //MAKE AN ID VERSION
    
    
    
    //Add an event listener for each actBtn.
// actBtns.forEach(element => {
//    element.addEventListener('click', function(event) {
//         let currentTxt = event.currentTarget.textContent;
//         if (currentTxt == "Hit")   //Hit
//         {
//             //hit();
//         }else if(currentTxt == "Double"){ //Double
//             //Double();   
//         }else if(currentTxt == "Stand"){ //Stand
//             //Stand();
//         }
//    });
//  });