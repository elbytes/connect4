// DOM Elements
const allCells = document.querySelectorAll('.cell:not(.row-top)');
const topCells = document.querySelectorAll('.cell.row-top');
const resetButton = document.querySelector('.reset');
const statusSpan = document.querySelector('.status');

// columns
const column0 = [allCells[35], allCells[28], allCells[21], allCells[14], allCells[7], allCells[0], topCells[0]];
const column1 = [allCells[36], allCells[29], allCells[22], allCells[15], allCells[8], allCells[1], topCells[1]];
const column2 = [allCells[37], allCells[30], allCells[23], allCells[16], allCells[9], allCells[2], topCells[2]];
const column3 = [allCells[38], allCells[31], allCells[24], allCells[17], allCells[10], allCells[3], topCells[3]];
const column4 = [allCells[39], allCells[32], allCells[25], allCells[18], allCells[11], allCells[4], topCells[4]];
const column5 = [allCells[40], allCells[33], allCells[26], allCells[19], allCells[12], allCells[5], topCells[5]];
const column6 = [allCells[41], allCells[34], allCells[27], allCells[20], allCells[13], allCells[6], topCells[6]];
const columns = [column0, column1, column2, column3, column4, column5, column6];


// rows
const topRow = [topCells[0], topCells[1], topCells[2], topCells[3], topCells[4], topCells[5], topCells[6]];
const row0 = [allCells[0], allCells[1], allCells[2], allCells[3], allCells[4], allCells[5], allCells[6]];
const row1 = [allCells[7], allCells[8], allCells[9], allCells[10], allCells[11], allCells[12], allCells[13]];
const row2 = [allCells[14], allCells[15], allCells[16], allCells[17], allCells[18], allCells[19], allCells[20]];
const row3 = [allCells[21], allCells[22], allCells[23], allCells[24], allCells[25], allCells[26], allCells[27]];
const row4 = [allCells[28], allCells[29], allCells[30], allCells[31], allCells[32], allCells[33], allCells[34]];
const row5 = [allCells[35], allCells[36], allCells[37], allCells[38], allCells[39], allCells[40], allCells[41]];
const rows = [row0, row1, row2, row3, row4, row5, topRow];

////vars
let gameActive = true;
let yellowNext = true; //yellow goes first

////util funcs
const getClassList = (cell) => {
    return [... cell.classList]
};

const getRowAndCol = (cell) => {
    const cellClassList = getClassList(cell);
    const row = cellClassList.find(className => className.includes('row'));
    const col = cellClassList.find(className => className.includes('col'));
    const rowIndex = parseInt(row[4], 10);
    const colIndex = parseInt(col[4], 10);

    return [rowIndex, colIndex];
};

//find first availble cell of col
const getFirstOpenCellInCol = (colIndex) => {
    const col = columns[colIndex].slice(0, 6); //remove the top cell from col
    for(const cell of col){
        const cellClassList = getClassList(cell);
        if(!cellClassList.includes('yellow') && !cellClassList.includes('red')){//it's a first empty cell
            return cell;
        } 
    }
    return null;
};

const clearTopCellClass = (colIndex) => {
    const topCell = topCells[colIndex];
    topCell.classList.remove('yellow');
    topCell.classList.remove('red');
};

const getColorOfCell = (cell) =>{
    return getClassList(cell).includes('red') ? 'red' : getClassList(cell).includes('yellow') ? 'yellow' : null;
}


const checkWinningCells = (cells) =>{
    if(cells.length < 4) return false;
    gameActive = false; //we have a horizonal winner
    for(const cell of cells){
        cell.classList.add('win')
    };
    statusSpan.textContent = `${yellowNext ? 'Yellow' : 'Red'} Won!`;
    return true;
};

const checkGameState = (cell) =>{
    //check to see if there are 4 or more in a row, horizontally or diagonally
    const color = getColorOfCell(cell);
    console.log('>>>color' + color);
    if(!color) return;

    //check horizontally
    const [rowIndex, colIndex] = getRowAndCol(cell);
    let winningCells = [cell];
    let rowToCheck = rowIndex;
    let colToCheck = colIndex -1; //check left col
    while(colToCheck>=0){
        const cellToCheck = rows[rowToCheck][colToCheck];
        if(getColorOfCell(cellToCheck) === color){
            console.log('gets here');
            winningCells.push(cellToCheck);
            colToCheck--; //go left
        } else {
            break;
        }
    }
    //check right
    colToCheck = colIndex+1;
    while(colToCheck<= 6){
        const cellToCheck = rows[rowToCheck][colToCheck];
        if(getColorOfCell(cellToCheck) === color){
            winningCells.push(cellToCheck);
            colToCheck++; //move right
        } else{
            break;
        }
    }

    let isWinningStatus = checkWinningCells(winningCells);
    if(isWinningStatus) return;

    //check vertically
    winningCells = [cell];
    rowToCheck = rowIndex-1;
    colToCheck = colIndex;
    while(rowToCheck >=0){
        const cellToCheck = rows[rowToCheck][colToCheck];
        if(getColorOfCell(cellToCheck) === color){
            winningCells.push(cellToCheck);
            rowToCheck--;
        } else {
        break;
    }
    }
    rowToCheck = rowIndex+1;
    while(rowToCheck <= 5){
        const cellToCheck = rows[rowToCheck][colToCheck];
        if(getColorOfCell(cellToCheck)=== color){
            winningCells.push(cellToCheck);
            rowToCheck++
        } else {
            break;
        }
    }

    if(checkWinningCells(winningCells)){
        return;
    }
};

////event handlers
const handleHover = (e) => {
    console.log(gameActive)

    if(!gameActive) return;
    const cell = e.target;
    const [rowIndex, colIndex] = getRowAndCol(cell);

    const topCell = topCells[colIndex];
    topCell.classList.add( yellowNext ? 'yellow': 'red')
}

const handleMouseOut = (e) => {
    const cell = e.target;
    const [rowIndex, colIndex] = getRowAndCol(cell);
    clearTopCellClass(colIndex);
};


const handleCellClick = (e) => {
    console.log(gameActive)
    if(!gameActive) return;
    const cell = e.target;
    const [rowIndex, colIndex] = getRowAndCol(cell);
    
    const openCell = getFirstOpenCellInCol(colIndex);

    if(!openCell){ //returns null, no open cells
        console.log('end of col');
        return;
    } 

    openCell.classList.add(yellowNext ? 'yellow' : 'red');
    //TODO: check game state
    checkGameState(openCell);
    //turn flip
    yellowNext = !yellowNext;

    //change top puck color based on turn
    clearTopCellClass(colIndex);
    const topCell = topCells[colIndex];
    topCell.classList.add(yellowNext ? 'yellow' : 'red')
    
};

//event listeners
for(const row of rows){
    for(const cell of row){
        cell.addEventListener('mouseover', handleHover);
        cell.addEventListener('mouseout', handleMouseOut);
        cell.addEventListener('click', handleCellClick);

    }
}

resetButton.addEventListener('click', () => {
    console.log(gameActive)

    for(const row of rows){
        for(const cell of row){
            cell.classList.remove('red');
            cell.classList.remove('yellow');
            cell.classList.remove('win');
        }
    }
    gameActive = true;
    yellowNext = true;
     statusSpan.textContent = '';

});

