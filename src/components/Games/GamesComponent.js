import { useState, useEffect } from "react";
import Logger from "../Logger";
import TicTacToe from "./TicTacToe";

function GamesComponent({ alertMethod }) {
  return (
    <>
      <h1>Games games games !!!!</h1>
      <TicTacToe />
    </>
  );
}

export default GamesComponent;
