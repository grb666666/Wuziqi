import React, { useState } from 'react';
import './App.css';

const BOARD_SIZE = 15;

function calculateWinner(squares) {
  const directions = [
    [0, 1], // horizontal
    [1, 0], // vertical
    [1, 1], // diagonal down-right
    [1, -1] // diagonal down-left
  ];

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const player = squares[row * BOARD_SIZE + col];
      if (!player) continue;
      for (const [dr, dc] of directions) {
        let count = 1;
        for (let step = 1; step < 5; step++) {
          const newRow = row + dr * step;
          const newCol = col + dc * step;
          if (
            newRow >= 0 && newRow < BOARD_SIZE &&
            newCol >= 0 && newCol < BOARD_SIZE &&
            squares[newRow * BOARD_SIZE + newCol] === player
          ) {
            count++;
          } else {
            break;
          }
        }
        if (count >= 5) return player;
      }
    }
  }
  return null;
}

function Square({ value, onClick }) {
  return (
    <div className={`square ${value}`} onClick={onClick}>
      {value && <div className="stone" />}
    </div>
  );
}

function Board({ squares, onClick }) {
  const renderSquare = (row, col) => {
    return (
      <Square
        key={`${row}-${col}`}
        value={squares[row * BOARD_SIZE + col]}
        onClick={() => onClick(row, col)}
      />
    );
  };

  const rows = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    const cols = [];
    for (let col = 0; col < BOARD_SIZE; col++) {
      cols.push(renderSquare(row, col));
    }
    rows.push(
      <div key={row} className="board-row">
        {cols}
      </div>
    );
  }

  return (
    <div className="board">
      {rows}
    </div>
  );
}

function Game() {
  const [history, setHistory] = useState([{ squares: Array(BOARD_SIZE * BOARD_SIZE).fill(null) }]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);

  const current = history[stepNumber];
  const winner = calculateWinner(current.squares);

  const handleClick = (row, col) => {
    const historySlice = history.slice(0, stepNumber + 1);
    const currentSquares = historySlice[stepNumber].squares.slice();
    if (calculateWinner(currentSquares) || currentSquares[row * BOARD_SIZE + col]) {
      return;
    }
    currentSquares[row * BOARD_SIZE + col] = xIsNext ? 'black' : 'white';
    setHistory(historySlice.concat([{ squares: currentSquares }]));
    setStepNumber(historySlice.length);
    setXIsNext(!xIsNext);
  };

  const jumpTo = (step) => {
    setStepNumber(step);
    setXIsNext((step % 2) === 0);
  };

  const moves = history.map((step, move) => {
    const desc = move ?
      '回到第' + move +'步' :
      '开始';
    return (
      <li key={move}>
        <button className="move-button" onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  let status;
  if (winner) {
    status = '胜者： ' + (winner === 'black' ? '黑棋' : '白棋');
  } else {
    status = '下一步： ' + (xIsNext ? '黑棋' : '白棋');
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={current.squares}
          onClick={(row, col) => handleClick(row, col)}
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <h1>五子棋</h1>
      <Game />
    </div>
  );
}

export default App;
