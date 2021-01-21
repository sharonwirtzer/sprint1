'use strict'

const mines = '💣';

const FLAG = '🚩';

const EMPTY = ' '

let gBoard = {};




function createMat(ROWS, COLS) {
    var mat = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}

let minesCount = 2;
let boardSize=4;

initGame()

function initGame() {
    let seconds = 0;

/*     const timer = document.querySelector('.timer');
    setInterval(function () {
        seconds++;

        timer.innerText = seconds;
    }, 1000);  */

    gBoard = buildBoard();

    setMinesNegsCount(gBoard)

    renderBoard(gBoard);
}

function setSize(size) {

    console.log(size);
    boardSize=size
    initGame()
}


function setMins(mins) {
    
    console.log(mins);
    minesCount=mins
    initGame()
}





function buildBoard() {

    //const minesCount = 4
    const size = boardSize
    var board = createMat(size, size)

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {

            var cell = {

                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            };
            board[i][j] = cell;
        }
    }


    for (let i = 0; i < minesCount; i++) {

        const x = Math.floor(Math.random() * size);
        const y = Math.floor(Math.random() * size);
        board[x][y].isMine = true;
    }

    return board;
}

function renderBoard(board) {

    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];

            // var cellClass = getClassName({ i: i, j: j })

            strHTML += '<td class="cell" oncontextmenu="cellMarked(this,' + i + ',' + j + ')" onClick="cellClicked(this,' + i + ',' + j + ');" >';


            // if (currCell.isMine) {
            // strHTML += mines;
            // }

            //    else{
            //  strHTML += '' ;
            // } 


            strHTML += "</td>"


        }
        strHTML += "</tr>"
    }


    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}



function getClassName(location) {

    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;
}


function cellClicked(elCell, i, j) {

    var cell = gBoard[i][j]

    if (cell.isShown) return
    
    if (cell.mines) gameOver()
    var neighbors = countAllNeighbors(elCell, i, j)
    if (gBoard[i][j].isMine) {
        cell.innerText = MINE;
    } else {
        cell.innerText = neighbors;
    }

}



/* function stopTimer() {
    clearInterval(gTimerInterval);
    gStartGameTime = null;
}

 */

function setMinesNegsCount(board) {

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            var cell = board[i][j];
            if (cell.isMine) continue
            var numOfNegs = countAllNeighbors(board, i, j)
            cell.minesAroundCount = numOfNegs;

            board[i][j] = cell;

        }
    }
    return board;
}



function countAllNeighbors(board, i, j) {

    var rowLimit = board.length-1;
    var columnLimit = board[0].length-1;
    let count=0
    for(var x = Math.max(0, i-1); x <= Math.min(i+1, rowLimit); x++) {
      for(var y = Math.max(0, j-1); y <= Math.min(j+1, columnLimit); y++) {
        if(x !== i || y !== j) {
          if(board[x][y].isMine) 
            count++;
        }
      }
    }
    return count
  }



function cellClicked(elCell, i, j) {

    var currCell = gBoard[i][j];

    if (currCell.isShown)
        return;

    if (currCell.isMine) {

        elCell.innerText = mines;

        setTimeout(gameOver, 300)

        return;
    }

    elCell.innerText = currCell.minesAroundCount
    gBoard[i][j].isShown = true;
    // if (currCell.minesAroundCount) {

    // }

    checkGameOver()
   

}



function gameOver() {

    if (confirm('You Loserrrr, wanna play again?')) {

        // Save it!
       
        initGame()
    }


}


function cellMarked(elCell, i, j) {

    window.event.preventDefault()



    var currCell = gBoard[i][j];

    if (!currCell.isMarked) {
        elCell.innerText = FLAG;
        gBoard[i][j].isMarked = true;

        setTimeout(checkGameOver, 300)
        //checkGameOver()
    }

    else {

        elCell.innerText = '';
        gBoard[i][j].isMarked = false;
    }

}


function checkGameOver() {

    let win = true;

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {

            var currCell = gBoard[i][j];

            if ((currCell.isMine && currCell.isMarked) || (!currCell.isMine && currCell.isShown)) {
                continue;
            }
            win = false;
        }
    }

    if (win) {

        

        if (confirm('You wonnnnnnnn, wanna play again?')) {
           
            initGame()
        }

    }


}