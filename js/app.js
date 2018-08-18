
/* Initializing variables */
const deck = document.querySelector('.deck');
let toggledCards = [];
let moves = 0;
let timerOn = false;
let time = 0;
let clockId;
let starsNumber = 3;
let matched = 0;

/*
* Creates an array of all cards, shuffles them, loops through each card and
* creates it's HTML
*/
 function shuffleDeck() {
   const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
   const shuffledCards = shuffle(cardsToShuffle);
   for (card of shuffledCards) {
     deck.appendChild(card);
   }
 }
 shuffleDeck();

/* Shuffle function from http://stackoverflow.com/a/2450976 */
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

/* This function is executed when the user clicks on a card (EventListener).
*   - it checks if the click is valid, using the isClickValid function
*   - it then checks if the timer is already on, if not it starts it
*   - it calls the toggleCard-function on the clicked element
*   - it calls the addToggleCard-function on the clicked element
*   - it checks if two cards are turned open, if yes
*     - the addMove-function is called to count the moves
*     - the removeStar-function is called to keep track of the number of stars displayed
*     - it calls the checkForMatch-function on the clicked element
*/
deck.addEventListener('click', event => {
    const clickTarget = event.target;
    if (isClickValid(clickTarget)) {
      if (timerOn === false) {
        startTimer();
        timerOn = true;
      }
      toggleCard(clickTarget);
      addToggleCard(clickTarget);
      if (toggledCards.length === 2) {
        addMove();
        removeStar();
        checkForMatch(clickTarget);
      }
    }
});

/*
* Checks if a click is valid by verifying if
*   - the clicked element contains the class 'card'
*   - the card wasn't already matched
*   - only one card is open
*   - the clicked card isn't already open
*/
function isClickValid(clickTarget) {
  return (
    clickTarget.classList.contains('card') &&
    !clickTarget.classList.contains('match') &&
    toggledCards.length < 2 &&
    clickTarget != toggledCards[0]
  );
}

/* Toggles the classes for opening and showing to the card */
function toggleCard(card) {
  card.classList.toggle('open');
  card.classList.toggle('show');
}

/* Adds the opened cards to the array 'toggledCards'*/
function addToggleCard (clickTarget) {
  toggledCards.push(clickTarget);
  console.log(toggledCards);
}

/*
*  This function checks if the opened cards match. If yes:
*   - it adds the class 'match' to the cards
*   - it clears the 'toggledCards'-array
*   - it increases the number of matched cards by one
*   - if the number of matched cards is 8, it calls the gameOver function.
*  If they do not match:
*   - it turns the cards and clears the 'toggledCards'-array within 1 second
*/
function checkForMatch() {
  if (
    toggledCards[0].firstElementChild.className ===
    toggledCards[1].firstElementChild.className
  ) {
    toggledCards[0].classList.toggle('match');
    toggledCards[1].classList.toggle('match');
    toggledCards = [];
    matched++;
      if (matched === 8) {
        gameOver();
      }
  } else {
      setTimeout(() => {
        toggleCard(toggledCards[0]);
        toggleCard(toggledCards[1]);
        toggledCards = [];
      }, 2000);
  }
}

/*
*  This function increases the number of moves by one and adds that number to
*  the display
*/
function addMove () {
  moves++;
  const movesDisplay = document.querySelector('.moves');
  movesDisplay.textContent = moves;
}

/*
* This function checks if the count of moves is 32 or 64. If yes:
*   - it reduces the number of stars by one
*   - it goes through each star-element and checks if it isn't already set to 'none'. If not:
*   - it set's it to 'none' anf by that, "removes" the star from the display
*/
function removeStar() {
  if (moves === 16 || moves === 32) {
    const starList = document.querySelectorAll('.stars li');
    starsNumber--;
    for (star of starList) {
      if (star.style.display !== 'none') {
        star.style.display = 'none';
        break;
      }
    }
  }
}

/* This function
*   - initializes a clock
*   - increases the time-variable by one and calls the displayTime-function every second
*/
function startTimer() {
  time = 0;
  clockId = setInterval(() => {
    time++;
    console.log(time);
    displayTime();
  }, 1000);
}

/* This function
*   - sets up the format of the variabel minutes by using the Math.floor-function
*   - sets up the format of the variabel seconds by using the %-operator
*   - connects the two variables in the appropriate format using a conditional statement
*/
function displayTime() {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const timer = document.querySelector('.timer');
  console.log(timer);
  if (seconds < 10) {
    timer.innerHTML = minutes + ':0' + seconds;
  } else {
    timer.innerHTML = minutes + ':' + seconds;
  }
}

/* Stops the timer by using the clearInterval-function*/
function stopTimer() {
  clearInterval(clockId);
}

/*
* Makes the Modal invisible by adding the class 'invisible' to it's mother-element,
* the 'modal-background'
*/
function toggleModal() {
  const modal = document.querySelector('.modal_background');
  modal.classList.toggle('invisible');
}

/*
* This function creates the stats for the Modal (modal_time, modal_moves,
* modal_stars) by changing their HTML according to the existing variables Time,
* Moves and Stars
*/
function createModalStats() {
  const timeStat = document.querySelector('.modal_time');
  const timerTime = document.querySelector('.timer').innerHTML;
  const movesStat = document.querySelector('.modal_moves');
  const starsStat = document.querySelector('.modal_stars');
  timeStat.innerHTML = `Time = ${timerTime}`;
  movesStat.innerHTML = `Moves = ${moves}`;
  starsStat.innerHTML = `Stars = ${starsNumber}`;
}

/* Closes the modal if you click on the "x" by calling the toggleModal-function */
document.querySelector('.modal_close').addEventListener('click', () => {
  toggleModal();
});

/* Closes the modal if you click on the "cancel"-button by calling the toggleModal-function */
document.querySelector('.modal_cancel').addEventListener('click', () => {
  toggleModal();
});

/*
* Starts the game again if you click on the "replay"-button of the modal by calling
* the replayGame-funtion
*/
document.querySelector('.modal_replay').addEventListener('click', replayGame);

/* Restarts the game if you click on the restart-symbol by calling the resetGame-function */
document.querySelector('.restart').addEventListener('click', resetGame);

/*
* This function resets the game by:
*   - setting the 'timerOn'-variable to false, so the timer stops
*   - setting the 'time'-variable to 0
*   - setting the 'moves'-variable to 0
*   - setting the 'starsNumber'-variable to 3 (at the beginning of each game you have 3 stars, which you can loose)
*   - setting the 'matched'-variable, which keeps track of the matched cards to 0
*   - calling the stopTimer-function
*   - calling the displayTime-function
*   - looping through each star and adding the inline class back to it, so it is visible
*   - calling the shuffleDeck-function
*   - calling the rotateCards-function
*/
function resetGame() {
  timerOn = false;
  time = 0;
  moves = 0;
  document.querySelector('.moves').innerHTML = moves;
  starsNumber = 3;
  const starList = document.querySelectorAll('.stars li');
  matched = 0;
  stopTimer();
  displayTime();
  for (star of starList) {
    star.style.display = 'inline';
  shuffleDeck();
  rotateCards();
  }
}

/*
* This function is executed when the user wins the game.
*   - it calls the stopTimer function
*   - it calls the createModalStats-function, so the Stats are added to the modal
*   - it calls the toggleModal-function, so the modal shows up
*/
function gameOver() {
  stopTimer();
  createModalStats();
  toggleModal();
}

/* This function is executed when the user clicks on the "Replay"-button of the modal.
*   - it calls the resetGame-function
*   - it calls the toggleModal-function, so the modal dissapears
*/
function replayGame() {
  resetGame();
  toggleModal();
}

/* This function loops through each card and turns them backwards again */
function rotateCards () {
  const cards = document.querySelectorAll('.deck li');
  for (let card of cards) {
    card.className = 'card';
  }
}
