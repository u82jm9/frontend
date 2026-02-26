import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import { GiBroadsword, GiCheckedShield } from "react-icons/gi";

function TicTacToe({ displayAlert }) {
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlayer1, setIsPlayer1] = useState(true);
  const [winner, setWinner] = useState(null);
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
      const winnerString = "The Winner is Player " + String(winner);
      displayAlert("success", winnerString);
      setTimeout(() => {
        resetBoard();
      }, 2000);
      setWinner(null);
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
      for (let i = 0; i <= 7; i++) {
        const winningOption = WINNING_COMBINATIONS[i];
        if (winningOption.every((index) => player1Moves.includes(index))) {
          setGameOver(true);
          setPlayer1Score(player1Score + 1);
          setWinner(1);
        } else if (
          winningOption.every((index) => player2Moves.includes(index))
        ) {
          setGameOver(true);
          setPlayer2Score(player2Score + 1);
          setWinner(2);
        }
      }
    }
  }

  return (
    <div className="display-game">
      <h1>Tic Tac Toe</h1>
      <div className="game-board">
        <div className="board-line">
          <div
            className="tic-tac-box"
            id="0"
            onClick={(event) => {
              boxClick(event);
            }}
          >
            <h1>
              {board[0] === "" ? null : board[0] === "X" ? (
                <GiBroadsword />
              ) : (
                <GiCheckedShield />
              )}
            </h1>
          </div>
          <div
            className="tic-tac-box"
            id="1"
            onClick={(event) => {
              boxClick(event);
            }}
          >
            <h1>
              {board[1] === "" ? null : board[1] === "X" ? (
                <GiBroadsword />
              ) : (
                <GiCheckedShield />
              )}
            </h1>
          </div>
          <div
            className="tic-tac-box"
            id="2"
            onClick={(event) => {
              boxClick(event);
            }}
          >
            <h1>
              {board[2] === "" ? null : board[2] === "X" ? (
                <GiBroadsword />
              ) : (
                <GiCheckedShield />
              )}
            </h1>
          </div>
        </div>
        <div className="board-line">
          <div
            className="tic-tac-box"
            id="3"
            onClick={(event) => {
              boxClick(event);
            }}
          >
            <h1>
              {board[3] === "" ? null : board[3] === "X" ? (
                <GiBroadsword />
              ) : (
                <GiCheckedShield />
              )}
            </h1>
          </div>
          <div
            className="tic-tac-box"
            id="4"
            onClick={(event) => {
              boxClick(event);
            }}
          >
            <h1>
              {board[4] === "" ? null : board[4] === "X" ? (
                <GiBroadsword />
              ) : (
                <GiCheckedShield />
              )}
            </h1>
          </div>
          <div
            className="tic-tac-box"
            id="5"
            onClick={(event) => {
              boxClick(event);
            }}
          >
            <h1>
              {board[5] === "" ? null : board[5] === "X" ? (
                <GiBroadsword />
              ) : (
                <GiCheckedShield />
              )}
            </h1>
          </div>
        </div>
        <div className="board-line">
          <div
            className="tic-tac-box"
            id="6"
            onClick={(event) => {
              boxClick(event);
            }}
          >
            <h1>
              {board[6] === "" ? null : board[6] === "X" ? (
                <GiBroadsword />
              ) : (
                <GiCheckedShield />
              )}
            </h1>
          </div>
          <div
            className="tic-tac-box"
            id="7"
            onClick={(event) => {
              boxClick(event);
            }}
          >
            <h1>
              {board[7] === "" ? null : board[7] === "X" ? (
                <GiBroadsword />
              ) : (
                <GiCheckedShield />
              )}
            </h1>
          </div>
          <div
            className="tic-tac-box"
            id="8"
            onClick={(event) => {
              boxClick(event);
            }}
          >
            <h1>
              {board[8] === "" ? null : board[8] === "X" ? (
                <GiBroadsword />
              ) : (
                <GiCheckedShield />
              )}
            </h1>
          </div>
        </div>
      </div>
      <h3>Player 1 Score: {player1Score}</h3>
      <h3>Player 2 Score: {player2Score}</h3>
      <Button
        variant="contained"
        onClick={() => {
          resetBoard();
        }}
      >
        Reset Board
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          setPlayer1Score(0);
          setPlayer2Score(0);
        }}
      >
        Reset Score
      </Button>
    </div>
  );
}

export default TicTacToe;
