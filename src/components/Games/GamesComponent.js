import TicTacToe from "./TicTacToe";
import WordSearch from "./WordSearch";

function GamesComponent(alertMethod) {
  return (
    <>
      <h1>Games games games !!!!</h1>
      <TicTacToe />
      <WordSearch displayAlert={alertMethod} />
    </>
  );
}

export default GamesComponent;
