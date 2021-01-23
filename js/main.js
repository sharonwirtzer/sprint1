'use strict'

const mines = '💣';

const FLAG = '🚩';

var glives = 0;

const life = '❤️';

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
let boardSize = 4;

//initGame()

function initGame() {

    glives = 3;

    renderLives();

    gBoard = buildBoard();

    setMinesNegsCount(gBoard)

    renderBoard(gBoard);

    document.getElementById('happy').innerText = '😀';

}

function renderLives() {

    const elLives = document.getElementById('lives')
    elLives.innerText = '';
    for (let i = 0; i < glives; i++)
        elLives.innerText += life;
}

function setSize(size) {

    console.log(size);
    boardSize = size
    initGame()
}

function setMins(mins) {

    console.log(mins);
    minesCount = mins
    initGame()
}

let hour = 0;
let minute = 0;
let second = 0;
let millisecond = 0;
let input;
let cron;

function start() {
    pause();
    cron = setInterval(() => { timer(); }, 10);
}

function pause() {
    clearInterval(cron);
}

function reset() {

    hour = 0;
    minute = 0;
    second = 0;
    millisecond = 0;

    document.getElementById('hour').innerText = '00';
    document.getElementById('minute').innerText = '00';
    document.getElementById('second').innerText = '00';
    document.getElementById('millisecond').innerText = '000';
}

function timer() {

    if ((millisecond += 10) == 1000) {
        millisecond = 0;
        second++;
    }
    if (second == 60) {
        second = 0;
        minute++;
    }
    if (minute == 60) {
        minute = 0;
        hour++;
    }
    document.getElementById('hour').innerText = returnData(hour);
    document.getElementById('minute').innerText = returnData(minute);
    document.getElementById('second').innerText = returnData(second);
    document.getElementById('millisecond').innerText = returnData(millisecond);
}

function returnData(input) {
    return input > 10 ? input : `0${input}`
}

function buildBoard() {

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

            strHTML += '<td class="cell" id="cell-' + i + '-' + j + '" oncontextmenu="cellMarked(this, ' + i + ', ' + j + ')" onClick="cellClicked(this, ' + i + ', ' + j + '); " >';

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

    var rowLimit = board.length - 1;
    var columnLimit = board[0].length - 1;
    let count = 0

    for (var x = Math.max(0, i - 1); x <= Math.min(i + 1, rowLimit); x++) {
        for (var y = Math.max(0, j - 1); y <= Math.min(j + 1, columnLimit); y++) {
            if (x !== i || y !== j) {
                if (board[x][y].isMine)
                    count++;
            }
        }
    }
    return count
}

function showNeighbours(board, i, j) {

    var rowLimit = board.length - 1;
    var columnLimit = board[0].length - 1;


    for (var x = Math.max(0, i - 1); x <= Math.min(i + 1, rowLimit); x++) {
        for (var y = Math.max(0, j - 1); y <= Math.min(j + 1, columnLimit); y++) {

            if (!board[x][y].isMine)
                if (board[x][y].minesAroundCount === 0) {
                    const elCell = document.getElementById("cell-" + x + '-' + y)
                    // elCell.innerText = board[x][y].minesAroundCount
                    elCell.classList.add("cell-opened")
                    board[x][y].isShown = true;


                }
                else {
                    const elCell = document.getElementById("cell-" + x + '-' + y)
                    elCell.innerText = board[x][y].minesAroundCount
                    elCell.classList.add("cell-opened")
                    board[x][y].isShown = true;
                }

        }
    }
}

function cellClicked(elCell, i, j) {

    start();

    var currCell = gBoard[i][j];

    if (currCell.isShown) return;

    if (currCell.isMine) {

        elCell.innerText = mines;

        var audio = new Audio('pop.wav');
        audio.play();

        glives--;

        renderLives()

        if (glives === 0) {
            setTimeout(gameOver, 300)
        }

        return;
    }

    if (currCell.minesAroundCount !== 0)
        elCell.innerText = currCell.minesAroundCount
    else
        elCell.classList.add("cell-opened")
    gBoard[i][j].isShown = true;
    showNeighbours(gBoard, i, j);

    checkGameOver()

}

function gameOver() {

    pause();
    reset();
    initGame();

    document.getElementById('happy').innerText = '🤯';

    if (setTimeout(confirm, 500, 'You Loserrrr, wanna play again?') === true) {
        initGame();

        reset();
    }

}

function cellMarked(elCell, i, j) {

    window.event.preventDefault()

    var currCell = gBoard[i][j];

    if (!currCell.isMarked) {
        elCell.innerText = FLAG;
        gBoard[i][j].isMarked = true;

        setTimeout(checkGameOver, 300)
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

        reset();
        pause();
        initGame();

        document.getElementById('happy').innerText = '😎';

        if (setTimeout(confirm, 500, 'You wonnnnnnnn, wanna play again?')=== true ) {

            pause();
            initGame();

        }

    }
}



