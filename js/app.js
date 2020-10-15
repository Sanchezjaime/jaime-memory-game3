/*
 * Create a list that holds all of your cards
 */
// list of cards in game
const icons = ["fa fa-diamond", "fa fa-diamond", "fa fa-paper-plane-o",
"fa fa-paper-plane-o", "fa fa-anchor", "fa fa-anchor", "fa fa-bolt",
"fa fa-bolt", "fa fa-cube", "fa fa-cube", "fa fa-leaf", "fa fa-leaf",
"fa fa-bicycle", "fa fa-bicycle", "fa fa-bomb", "fa fa-bomb"];


//global variables
let openCards = [];

let matchedCards = [];

let moves = 0;



/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
* initialize the game
*/

const cardsContainer = document.querySelector(".deck");

function init() {
    //shuffle deck
    shuffle(icons);
    //loop goes through card icons to create html
    for (let i = 0; i < icons.length; i++) {
        const card = document.createElement("li");
        card.classList.add("card");
        card.innerHTML = "<i class='" + icons[i] + "'</i>";
        cardsContainer.appendChild(card);



        //add click event to each card
        click(card);
    }
}


/*
* click event
*/
//first click indacator
let isFirstClick = true;

//click function
function click(card) {

    //card event listener
    card.addEventListener("click", function() {

        /*
        *at first click condition will be true,
        *code will get executed then set 'isfirstClick' to false
        *no else condition
        */
        if(isFirstClick) {
            //start timer
            startTimer();
            //change value to false
            isFirstClick = false;
        }


        const currentCard = this;
        const previousCard = openCards[0];

        //we have an existing opened card
        if(openCards.length === 1) {

            card.classList.add("open", "show", "disable");
            openCards.push(this);

            //compares cards
            compare(currentCard, previousCard);

        } else {
        // we dont have an opened card
            card.classList.add("open", "show", "disable");
            openCards.push(this);
        }
    });
}

/*
*compare the 2 cards
*/
function compare(currentCard, previousCard){

    //matcher
    if(currentCard.innerHTML === previousCard.innerHTML) {

        //matched cards
        currentCard.classList.add("match");
        previousCard.classList.add("match");

        matchedCards.push(currentCard, previousCard);
        openCards = [];



    } else {

        //wait 500ms then, do this
        setTimeout(function() {
            currentCard.classList.remove("open", "show", "disable");
            previousCard.classList.remove("open", "show", "disable");

        }, 500);

        openCards = [];

    }

    //add new move
    addMove();
    //check if game is over
    isOver();
}

/*
*check if the game is over
*/
function isOver() {
    if(matchedCards.length === icons.length) {

        //stop our timer
        stopTimer();

        //opens game over message and gives score and time
        openModal();
    }
}


/*
*add move
*/
const movesContainer = document.querySelector(".moves");
//let moves = 0;
movesContainer.innerHTML = 0;
function addMove(){
    moves++;
    movesContainer.innerHTML = moves;

    //set rating
    rating();
}

/*
*rating
*/
const starContainer = document.querySelector(".stars");
starContainer.innerHTML ='<li class="fa fa-star"></li><li class="fa fa-star"></li><li class="fa fa-star"></li>';

function rating(){
    switch(moves) {
        case 17:
            starContainer.innerHTML ='<li class="fa fa-star"></li><li class="fa fa-star"></li>';
            break;
        case 24:
            starContainer.innerHTML ='<li class="fa fa-star"></li>';
    }
}


/*
*timer
*/
const timerContainer = document.querySelector(".timer");
let liveTimer,
    totalSeconds = 0;

//set the default value to the timers container
timerContainer.innerHTML = totalSeconds + 's';

/*
*call this function to start timer
*total seconds will be increased by 1 after 1000ms
*function called once when players clicks first card
*/
function startTimer() {
    liveTimer = setInterval(function() {
        //increase the totalSeconds by 1
        totalSeconds++;
        //update the HTML container
        timerContainer.innerHTML = totalSeconds + 's';
    }, 1000);
}

/*
*function to stop timer
*will be called at end of 'isOver' function
*/
function stopTimer() {
    clearInterval(liveTimer);
}

/*
*restart button
*/
const restartButton = document.querySelector(".restart");
restartButton.addEventListener("click", function() {
    //delete all cards
    cardsContainer.innerHTML = "";

    //call init to create new cards
    init();

    //reset the game
    reset();

})

/*
*reset all game variables
*/
function reset() {
    //reset matched cards array
    matchedCards = [];

    //empty the openCards array
    openCards = [];

    //reset moves
    moves = 0;
    movesContainer.innerHTML = moves;

    //reset rating
    starContainer.innerHTML = '<li class="fa fa-star"></li><li class="fa fa-star"></li><li class="fa fa-star"></li>';

    /*
    *reset the timer
    *stop it first
    *then, reset the 'isFirstClick' to 'true' to start the timer again
    *reset the 'totalSeconds' to 0
    *update the HTML timers container
    */
    stopTimer();
    isFirstClick = true;
    totalSeconds = 0;
    timerContainer.innerHTML = totalSeconds + "s";
}

/*
*function to open game over modal
*function called in isOver function
*/
//get modal element
const modal = document.querySelector("#gameOver");
const modalBodyContainer = document.querySelector(".modal-body");
//create <p> element for modal message
const modalMessage = document.createElement("P");

function openModal(){
    modal.style.display = 'block';
    //function adds <p> element to modal body with score and time of player
    modalMessage.innerHTML = "You finished the game in " + totalSeconds + " seconds, with " + movesContainer.innerHTML + " moves and a rating of  " + starContainer.innerHTML + ".";
    modalBodyContainer.appendChild(modalMessage);
}

/*
*function to close modal
*/
//get close button
const closeBtn = document.querySelector(".closeBtn");
//listen for close click
closeBtn.addEventListener("click", closeModal);

function closeModal(){
    modal.style.display = 'none';
}




init();

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
