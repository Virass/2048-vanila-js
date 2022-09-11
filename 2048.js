const gameFieldSize = 4; // Game field size
let gameCells = []; // Array all cells on game field
const gameField = document.getElementById('game-field');
const numBlocks = []; // Array all num block on game field

/* Matrix game cells for moving numeral blocks */
const shiftLeftMatrix = [];
const shiftRightMatrix = [];
const shiftTopMatrix = [];
const shiftBottomMatrix = [];

let score = 0; //You score in the game
let idCounter = 1; //Counter for id numeral blocks

function gameOver() {
  window.alert('Game Over');
  location.reload();
}

function youWin() {
  setTimeout(function () {
    window.alert(`Congratulations, you win! You score: ${score}`);
    location.reload();
  }, 150);
}

function generateGameCells() {
  /* Generate game cells field */
  for (let i = 0; i < (gameFieldSize ** 2); i++) {
    gameCells.push(
      {
        id: i,
        x: i % gameFieldSize,
        y: Math.floor(i / gameFieldSize),
        left: i % gameFieldSize * 100,
        top: Math.floor(i / gameFieldSize) * 100,
        empty: true,
      }
    )
  }
}

function drawCell() {
  /* Render empty cells on the monitor */
  gameField.innerHTML = ''; //Clear all random element in game zone div
  for (let i = 0; i < gameCells.length; i++) {
    const cell = document.createElement('div'); //Create new div class in the game field

    cell.style.left = `${gameCells[i].left}px`; //Set position for new cell
    cell.style.top = `${gameCells[i].top}px`; //Set position for new cell
    cell.classList.add("cell");

    gameField.appendChild(cell); //Add new cell to array for game field
  }
}

class GameNumeralBlock {
  /* Constructor for new object numeral block */
  constructor(id, cellId, x, y) {
    this.blockId = id; //Unique id for block
    this.fieldCellId = cellId; //Id cell for block
    this.value = (Math.random() * 100) <= 70 ? 2 : 4; //Set value for numeral block 2 or 4
    this.left = x * 100; // Left margin
    this.top = y * 100; // Top margin
    this.x = x;
    this.y = y;
  }
}

function getRandomEmptyPosition() {

  const randomId = Math.floor(Math.random() * gameCells.length);
  const suggestedCell = gameCells[randomId]; //Get random candidate cell in game field

  if (suggestedCell.empty) { // Check empty status for cell
    gameCells[randomId].empty = false;
    return [suggestedCell, randomId];
  } else {
    //Restart search empty position in game field if current cell in not empty
    return getRandomEmptyPosition();
  }

}

function randomBlock() {

  const randomPosition = getRandomEmptyPosition(); //Get random empty cell on game field

  const newBlock = new GameNumeralBlock(
    idCounter,
    randomPosition[0].id,
    randomPosition[0].x,
    randomPosition[0].y
  ); //Create a new number block in the empty cell from the previous step
  idCounter++; //Change unique id for next new numeral block
  numBlocks.push(newBlock); //Put generate block in array all numeral block
  drawBlock(newBlock); //Draw block on the game field
}

function drawBlock(inputBlock) {
  const block = document.createElement('div'); //Create new div element
  const numElement = document.createElement('div'); //Create new 'p' element for number
  numElement.classList.add(`block--${inputBlock.value}`);


  block.style.left = `${inputBlock.left}px`; //Set X coord for numeral block on the game field
  block.style.top = `${inputBlock.top}px`; //Set Y coord for numeral block on the game field
  block.classList.add("block"); //Set div class for numeral block
  block.id = inputBlock.blockId;

  gameField.appendChild(block)
  block.appendChild(numElement);
}

function generateShiftMatrix(vector, tempCounter, tempArray) {
  /* Generate matrix for shifting blocks. Cols and rows
  [
    [0,  1,  2,  3]
    [4,  5,  6,  7]
    [8,  9,  10, 11]
    [12, 13, 14, 15]
  ]
  Anyway this magic is work fine :D
  */
  for (let i = 0; i < gameFieldSize; i++) {
    let secondTempCounter = tempCounter;

    for (let p = 0; p < gameFieldSize; p++) { //Generate one line in the matrix for game field
      tempArray.push(gameCells[tempCounter]);
      if (vector === 'left') tempCounter++;
      if (vector === 'right') tempCounter--;
      if (vector === 'top') tempCounter += gameFieldSize;
      if (vector === 'bottom') tempCounter -= gameFieldSize;
    }
    /* Push one complete line to the matrix for game field */
    if (vector === 'left') { shiftLeftMatrix.push(tempArray) };
    if (vector === 'right') { shiftRightMatrix.push(tempArray) };
    if (vector === 'top') {
      shiftTopMatrix.push(tempArray);
      tempCounter = secondTempCounter + 1;
    }
    if (vector === 'bottom') {
      shiftBottomMatrix.push(tempArray);
      tempCounter = secondTempCounter - 1;
    }

    tempArray = [];
  }
}

document.addEventListener("keydown", handleKeyPress); //Detect press keys
function handleKeyPress(event) {
  /* Call function to respond to a key press */
  switch (event.keyCode) {
    case 37:
      shift('left');
      break;
    case 38:
      shift('up');
      break;
    case 39:
      shift('right');
      break;
    case 40:
      shift('down');
      break;
  }
}

/* Creating technic variables for use in detecting touch gestures  */
let pageWidth = window.innerWidth || document.body.clientWidth;
let threshold = Math.max(1, Math.floor(0.01 * (pageWidth)));
let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;
const limit = Math.tan(45 * 1.5 / 180 * Math.PI);

/* Detect touch gestures */
document.addEventListener('touchstart', function (event) {
  touchstartX = event.changedTouches[0].screenX;
  touchstartY = event.changedTouches[0].screenY;
}, false);

document.addEventListener('touchend', function (event) {
  touchendX = event.changedTouches[0].screenX;
  touchendY = event.changedTouches[0].screenY;
  handleGesture(event);
}, false);

/* Call function to respond to a touchscreen */
function handleGesture(e) {
  let x = touchendX - touchstartX;
  let y = touchendY - touchstartY;
  let xy = Math.abs(x / y);
  let yx = Math.abs(y / x);
  if (Math.abs(x) > threshold || Math.abs(y) > threshold) {
    if (yx <= limit) {
      if (x < 0) {
        shift('left');
      } else {
        shift('right');
      }
    }
    if (xy <= limit) {
      if (y < 0) {
        shift('up');
      } else {
        shift('down');
      }
    }
  }
}

function shiftChange(matrix, vector, coord, line) {
  let checkChange = false; //Variable for check change position blocks on the game field
  let blocksOnLine = []; //Temporary array for 
  let pairsBlocks = [];

  for (key in matrix) {

    for (let p = 0; p < gameFieldSize; p++) { //Find all blocks in vector line
      const findBlocksOnLine = numBlocks.find(x => matrix[key][p].id === x.fieldCellId);
      if (findBlocksOnLine) blocksOnLine.push(findBlocksOnLine);
    }

    for (let i = 0; i < gameFieldSize; i++) { //Find pairs blocks
      if (!blocksOnLine[i]) break; //If block undefined then we break loop iteration
      let pairsBlocksBuffer = [];
      if (blocksOnLine.length > 1 && blocksOnLine[i + 1] !== undefined) {
        if (blocksOnLine[i].value === blocksOnLine[i + 1].value) { //Check if current block and next has same value
          pairsBlocksBuffer.push(blocksOnLine[i]);
          pairsBlocksBuffer.push(blocksOnLine[i + 1]);
          pairsBlocks.push(pairsBlocksBuffer);
          i++;
        }
      }
    }

    /* Join pair blocks to one block */
    if (pairsBlocks.length > 0) {

      for (pair in pairsBlocks) {
        const relieveCell = gameCells.findIndex(e => pairsBlocks[pair][1].fieldCellId === e.id);
        gameCells[relieveCell].empty = true;

        /* Shift second block in the pair and delete div on page */
        const changePositionPairBlock = document.getElementById(pairsBlocks[pair][1].blockId);
        pairsBlocks[pair][1].fieldCellId = null;
        changePositionPairBlock.style.zIndex = 3;
        changePositionPairBlock.style[vector] = `${pairsBlocks[pair][0][vector]}px`;
        setTimeout(function () { changePositionPairBlock.remove() }, 145);

        pairsBlocks[pair][0].value *= 2;
        score += pairsBlocks[pair][0].value;

        const newScore = document.getElementById('score');
        newScore.innerHTML = score;



        if (pairsBlocks[pair][0].value >= 2048) {
          youWin();
        }

        const changeStyleBlock = document.getElementById(pairsBlocks[pair][0].blockId);
        const newStyleForBlock = document.createElement('div');
        newStyleForBlock.classList.add(`block--${pairsBlocks[pair][0].value}`);
        setTimeout(function () {
          changeStyleBlock.innerHTML = '';
          changeStyleBlock.appendChild(newStyleForBlock);
        }, 140);

        changeStyleBlock.appendChild(newStyleForBlock);

        /* Search second block in the arrays and delete him */
        const removeInBlocksOnLine = blocksOnLine.findIndex(e => e.blockId === pairsBlocks[pair][1].blockId);
        const removeInNumBlocks = numBlocks.findIndex(e => e.blockId === pairsBlocks[pair][1].blockId);
        blocksOnLine.splice(removeInBlocksOnLine, 1);
        numBlocks.splice(removeInNumBlocks, 1);
        checkChange = true;
      }
    }
    pairsBlocks = [];

    for (let x = 0; x < gameFieldSize; x++) {
      if (!blocksOnLine[x]) break; //If block undefined then we break loop iteration
      let emptyCell = null;
      emptyCell = matrix[key].findIndex(e => e.empty === true); //Check line for empty cells
      if (emptyCell === undefined || emptyCell === -1) continue; //Skip loop iteration if line is empty

      if (line === 'line') {
        if (blocksOnLine[x].fieldCellId > matrix[key][emptyCell].id) {
          const changeEmptyStatus = matrix[key].findIndex(e => blocksOnLine[x].fieldCellId === e.id);
          matrix[key][changeEmptyStatus].empty = true;
          matrix[key][emptyCell].empty = false;
          blocksOnLine[x][coord] = matrix[key][emptyCell][coord];
          blocksOnLine[x][vector] = matrix[key][emptyCell][vector];
          blocksOnLine[x].fieldCellId = matrix[key][emptyCell].id;

          const changePositionBlock = document.getElementById(blocksOnLine[x].blockId);
          changePositionBlock.style[vector] = `${blocksOnLine[x][vector]}px`;
          checkChange = true;
        }
      }
      if (line === 'reverse') {
        if (blocksOnLine[x].fieldCellId < matrix[key][emptyCell].id) {
          const changeEmptyStatus = matrix[key].findIndex(e => blocksOnLine[x].fieldCellId === e.id);
          matrix[key][changeEmptyStatus].empty = true;
          matrix[key][emptyCell].empty = false;
          blocksOnLine[x][coord] = matrix[key][emptyCell][coord];
          blocksOnLine[x][vector] = matrix[key][emptyCell][vector];
          blocksOnLine[x].fieldCellId = matrix[key][emptyCell].id;

          const changePositionBlock = document.getElementById(blocksOnLine[x].blockId);
          changePositionBlock.style[vector] = `${blocksOnLine[x][vector]}px`;
          checkChange = true;
        }
      }

    }
    blocksOnLine = [];
  }



  const checkEmptyCell = gameCells.every(x => x.empty === false);
  if (checkEmptyCell) {
    gameOver();
  }

  if (checkChange) {
    randomBlock();
    checkChange = false;
  }

}


function shift(route) {
  if (route === 'left') shiftChange(shiftLeftMatrix, 'left', 'x', 'line');
  if (route === 'right') shiftChange(shiftRightMatrix, 'left', 'x', 'reverse');
  if (route === 'up') shiftChange(shiftTopMatrix, 'top', 'y', 'line');
  if (route === 'down') shiftChange(shiftBottomMatrix, 'top', 'y', 'reverse');
}

function init() {
  generateGameCells();
  drawCell();
  generateShiftMatrix('left', 0, []);
  generateShiftMatrix('right', (gameFieldSize ** 2 - 1), []);
  generateShiftMatrix('top', 0, []);
  generateShiftMatrix('bottom', (gameFieldSize ** 2 - 1), []);
  randomBlock();
  randomBlock();

};

init();
