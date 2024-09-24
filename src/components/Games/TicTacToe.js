import { Button } from "@mui/material";
import { useState, useEffect } from "react";

function TicTacToe() {
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlayer1, setIsPlayer1] = useState(true);
  const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
  const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  useEffect(() => {
    checkWin();
  }, [board]);

  useEffect(() => {
    if (gameOver) {
      setTimeout(() => {
        resetBoard();
      }, 2500);
    }
  }, [gameOver]);

  function boxClick(e) {
    const index = parseInt(e.target.id);
    if (board[index] !== "" || gameOver) return;
    const newBoard = [...board];
    newBoard[index] = isPlayer1 ? "X" : "O";
    setBoard(newBoard);
    setIsPlayer1(!isPlayer1);
  }

  function resetBoard() {
    setIsPlayer1(true);
    setBoard(["", "", "", "", "", "", "", "", ""]);
    setGameOver(false);
  }

  function checkWin() {
    let player1Moves = [];
    let player2Moves = [];
    try {
      board.forEach((element, index) => {
        if (element === "X") {
          player1Moves.push(index);
        } else if (element === "O") {
          player2Moves.push(index);
        }
      });
    } finally {
      console.log("Player 1 Moves: ", player1Moves);
      console.log("Player 2 Moves: ", player2Moves);
      for (let i = 0; i <= 7; i++) {
        const winningOption = WINNING_COMBINATIONS[i];
        console.log("Winning Option: ", winningOption);
        if (winningOption.every((index) => player1Moves.includes(index))) {
          console.log("Player 1 Wins");
          setGameOver(true);
          setPlayer1Score(player1Score + 1);
        } else if (
          winningOption.every((index) => player2Moves.includes(index))
        ) {
          console.log("Player 2 Wins");
          setGameOver(true);
          setPlayer2Score(player2Score + 1);
        }
      }
    }
  }

  return (
    <div className="display-game">
      <h1>Tic Tac Toe</h1>
      <Button
        variant="contained"
        onClick={() => {
          resetBoard();
        }}
      >
        Reset Board
      </Button>
      {gameOver && <h2>The Winner is Player {isPlayer1 ? <>2</> : <>1</>}</h2>}
      <div className="tic-tac-toe">
        <div className="tic-tac-line">
          <div
            className="tic-tac-box"
            id="0"
            onClick={(event) => {
              boxClick(event);
            }}
          >
            {board[0]}
          </div>
          <div
            className="tic-tac-box"
            id="1"
            onClick={(event) => {
              boxClick(event);
            }}
          >
            {board[1]}
          </div>
          <div
            className="tic-tac-box"
            id="2"
            onClick={(event) => {
              boxClick(event);
            }}
          >
            {board[2]}
          </div>
        </div>
        <div className="tic-tac-line">
          <div
            className="tic-tac-box"
            id="3"
            onClick={(event) => {
              boxClick(event);
            }}
          >
            {board[3]}
          </div>
          <div
            className="tic-tac-box"
            id="4"
            onClick={(event) => {
              boxClick(event);
            }}
          >
            {board[4]}
          </div>
          <div
            className="tic-tac-box"
            id="5"
            onClick={(event) => {
              boxClick(event);
            }}
          >
            {board[5]}
          </div>
        </div>
        <div className="tic-tac-line">
          <div
            className="tic-tac-box"
            id="6"
            onClick={(event) => {
              boxClick(event);
            }}
          >
            {board[6]}
          </div>
          <div
            className="tic-tac-box"
            id="7"
            onClick={(event) => {
              boxClick(event);
            }}
          >
            {board[7]}
          </div>
          <div
            className="tic-tac-box"
            id="8"
            onClick={(event) => {
              boxClick(event);
            }}
          >
            {board[8]}
          </div>
        </div>
      </div>
      <h3>Player 1 Score: {player1Score}</h3>
      <h3>Player 2 Score: {player2Score}</h3>
    </div>
  );
}

export default TicTacToe;
