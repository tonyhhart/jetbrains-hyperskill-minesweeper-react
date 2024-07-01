import React, {useEffect, useState} from 'react';
import Cell from './Cell';

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function generateMinePositions() {
    const rows = 9;
    const cols = 8;
    const totalMines = 10;

    // Create an empty field with no mines
    const field = Array.from({length: rows}, () => Array(cols).fill(false));

    // Place mines randomly
    let minesPlaced = 0;
    while (minesPlaced < totalMines) {
        const rowIndex = Math.floor(Math.random() * rows);
        const colIndex = Math.floor(Math.random() * cols);

        // Place a mine only if there isn't one already
        if (!field[rowIndex][colIndex]) {
            field[rowIndex][colIndex] = true;
            minesPlaced++;
        }
    }

    return field;
}

function countMines(field, row, col) {
    let mineCount = 0;
    for (let i = Math.max(row - 1, 0); i <= Math.min(row + 1, field.length - 1); i++) {
        for (let j = Math.max(col - 1, 0); j <= Math.min(col + 1, field[0].length - 1); j++) {
            if (field[i][j].isMine) mineCount++;
        }
    }
    return mineCount;
}

function openCells(field, row, col, setGameOver) {
    if (field[row][col].isMine) {
        setGameOver(true);
        return field.map(row => row.map(cell => ({...cell, isOpen: true}))); // Open all cells if a mine is clicked
    }

    let updatedField = [...field];
    updatedField[row][col] = {...updatedField[row][col], isFlagged: false, isOpen: true};

    if (updatedField[row][col].minesAround === 0) {
        for (let i = Math.max(row - 1, 0); i <= Math.min(row + 1, field.length - 1); i++) {
            for (let j = Math.max(col - 1, 0); j <= Math.min(col + 1, field[0].length - 1); j++) {
                if (!updatedField[i][j].isOpen) {
                    updatedField = openCells(updatedField, i, j, setGameOver);
                }
            }
        }
    }

    return updatedField;
}

function toggleFlag(field, row, col, flagsLeft, setFlagsLeft) {
    const updatedField = [...field];
    const cell = updatedField[row][col];
    if (!cell.isOpen) {
        if (cell.isFlagged && flagsLeft < 10) {
            updatedField[row][col] = {...cell, isFlagged: false};
            setFlagsLeft(flagsLeft + 1);
        } else if (!cell.isFlagged && flagsLeft > 0) {
            updatedField[row][col] = {...cell, isFlagged: true};
            setFlagsLeft(flagsLeft - 1);
        }
    }
    return updatedField;
}


function GameBoard() {
    const [field, setField] = useState([]);
    const [timer, setTimer] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [flagsLeft, setFlagsLeft] = useState(10);
    const [gameOver, setGameOver] = useState(false);

    // Initializes the minefield with mines placed randomly
    useEffect(() => {
        initializeField();
    }, []);

    useEffect(() => {
        let interval = null;
        if (gameStarted && !gameOver) {
            interval = setInterval(() => {
                setTimer(timer => timer + 1);
            }, 1000);
        } else if (gameOver) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [gameStarted, gameOver]);

    const onReset = () => {
        setGameStarted(false);
        setFlagsLeft(10)
        setGameOver(false)
        setTimer(0);
        initializeField();
    }

    const initializeField = () => {
        const newField = [];
        const minePositions = generateMinePositions(); // Implement this function to randomly place mines
        for (let i = 0; i < 9; i++) {
            newField[i] = [];
            for (let j = 0; j < 8; j++) {
                newField[i][j] = {
                    isMine: minePositions[i][j],
                    isOpen: false,
                    isFlagged: false
                };
            }
        }

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 8; j++) {
                newField[i][j].minesAround =  countMines(newField, i, j);
            }
        }

        setField(newField);

        return newField;
    };

    const handleCellClick = (row, col) => {
        let updatedField = [...field];
        if (!gameStarted) {
            setGameStarted(true);
        }

        while (updatedField.every(row => row.every(cell => !cell.isOpen)) && updatedField[row][col].isMine) {
            updatedField = initializeField();
        }

        updatedField = openCells(updatedField, row, col, setGameOver);
        setField(updatedField);
    };

    const handleCellRightClick = (row, col, event) => {
        event.preventDefault();
        if (!gameStarted) {
            setGameStarted(true);
        }
        const updatedField = toggleFlag(field, row, col, flagsLeft, setFlagsLeft);
        setField(updatedField);
    };


    return (
        <>
            <div className="header">
                <h1>Minesweeper</h1>
                <div>{flagsLeft}</div>
                <div>{formatTime(timer)}</div>
            </div>
            <div className="game-board">
                {field.map((row, rowIndex) => row.map((cell, colIndex) => (
                    <Cell
                        key={`${rowIndex}-${colIndex}`}
                        data={cell}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                        onContextMenu={(event) => handleCellRightClick(rowIndex, colIndex, event)}
                    />
                )))}
            </div>
            <button onClick={onReset}>Reset</button>
        </>
    );
}

export default GameBoard;

