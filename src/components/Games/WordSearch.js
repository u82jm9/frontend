import { useEffect, useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemText,
  Button,
} from "@mui/material";

function WordSearch({ displayAlert }) {
  const alphabet = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  const numberOfLines = 12;
  const cityCapitols = [
    ["E", "D", "I", "N", "B", "U", "R", "G", "H"],
    ["B", "R", "A", "T", "I", "S", "L", "A", "V", "A"],
    ["P", "A", "R", "I", "S"],
    ["R", "O", "M", "E"],
    ["B", "E", "R", "L", "I", "N"],
    ["L", "O", "N", "D", "O", "N"],
    ["M", "A", "D", "R", "I", "D"],
    ["B", "E", "I", "J", "I", "N", "G"],
    ["W", "E", "L", "L", "I", "N", "G", "T", "O", "N"],
    ["C", "A", "N", "B", "E", "R", "R", "A"],
    ["T", "H", "I", "M", "P", "H", "U"],
  ];
  const olympicSports = [
    ["B", "A", "S", "K", "E", "T", "B", "A", "L", "L"],
    ["S", "W", "I", "M", "M", "I", "N", "G"],
    ["F", "O", "O", "T", "B", "A", "L", "L"],
    ["R", "U", "G", "B", "Y"],
    ["T", "E", "N", "N", "I", "S"],
    ["V", "O", "L", "L", "E", "Y", "B", "A", "L", "L"],
    ["B", "O", "X", "I", "N", "G"],
    ["H", "O", "C", "K", "E", "Y"],
    ["G", "Y", "M", "N", "A", "S", "T", "I", "C", "S"],
    ["W", "R", "E", "S", "T", "L", "I", "N", "G"],
  ];
  const popularMountains = [
    ["E", "V", "E", "R", "E", "S", "T"],
    ["K", "I", "L", "I", "M", "A", "N", "J", "A", "R", "O"],
    ["F", "U", "J", "I"],
    ["M", "A", "T", "T", "E", "R", "H", "O", "R", "N"],
    ["M", "O", "N", "T", "B", "L", "A", "N", "C"],
    ["D", "E", "N", "A", "L", "I"],
    ["A", "C", "O", "N", "C", "A", "G", "U", "A"],
    ["E", "L", "B", "R", "U", "S"],
    ["M", "O", "N", "T", "E", "R", "O", "S", "A"],
    ["V", "I", "N", "S", "O", "N"],
  ];
  const famousInventions = [
    ["T", "E", "L", "E", "P", "H", "O", "N", "E"],
    ["C", "O", "M", "P", "U", "T", "E", "R"],
    ["L", "I", "G", "H", "T", "B", "U", "L", "B"],
    ["A", "I", "R", "P", "L", "A", "N", "E"],
    ["R", "A", "D", "I", "O"],
    ["I", "N", "T", "E", "R", "N", "E", "T"],
    ["B", "I", "C", "Y", "C", "L", "E"],
    ["S", "U", "B", "M", "A", "R", "I", "N", "E"],
    ["P", "E", "N", "I", "C", "I", "L", "L", "I", "N"],
  ];
  const availablePuzzles = [
    "Cities",
    "Olympic Sports",
    "Popular Mountains",
    "Famous Inventions",
  ];
  const [showPuzzles, setShowPuzzles] = useState(false);
  const [foundIndex, setFoundIndex] = useState(null);
  const [wordsToFind, setWordsToFind] = useState(cityCapitols);
  const [wordsAdded, setWordsAdded] = useState([]);
  const [puzzle, setPuzzle] = useState([]);
  const [selection, setSelection] = useState([]);

  useEffect(() => {
    fillPuzzle();
  }, [wordsToFind]);

  useEffect(() => {
    checkWordFound();
  }, [selection]);

  function fillPuzzle() {
    const tempPuzzle = Array.from({ length: numberOfLines }, () =>
      Array(numberOfLines).fill("")
    );
    addWords(tempPuzzle);
    addRestOfLetters(tempPuzzle);
    setPuzzle(tempPuzzle);
  }

  function changePuzzle(choice) {
    if (choice === "Cities") {
      setWordsToFind(cityCapitols);
    } else if (choice === "Olympic Sports") {
      setWordsToFind(olympicSports);
    } else if (choice === "Popular Mountains") {
      setWordsToFind(popularMountains);
    } else if (choice === "Famous Inventions") {
      setWordsToFind(famousInventions);
    }
  }

  function addWords(passedPuzzle) {
    let successfulWords = [];
    for (let i = 0; i < wordsToFind.length; i++) {
      let attempts = 0;
      let word = wordsToFind[i];
      let added = false;

      while (attempts < 6 && !added) {
        let startLine = Math.floor(Math.random() * numberOfLines);
        let startColumn = Math.floor(Math.random() * numberOfLines);
        let line = passedPuzzle[startLine];

        // Check if the word fits in the specified direction (right or left)
        if (word.length <= spaceToEndOfLine(startColumn)) {
          let canPlace = true;
          for (let j = 0; j < word.length; j++) {
            if (line[startColumn + j] !== "") {
              canPlace = false;
              break;
            }
          }

          if (canPlace) {
            for (let j = 0; j < word.length; j++) {
              line[startColumn + j] = word[j];
            }
            successfulWords.push(word.join(""));
            added = true;
          }
        }
        attempts++;
      }
    }
    setWordsAdded(successfulWords);
  }

  function spaceToEndOfLine(startColumn) {
    return numberOfLines - startColumn;
  }

  function addRestOfLetters(passedPuzzle) {
    passedPuzzle.forEach((line, lineIndex) => {
      line.forEach((element, columnIndex) => {
        if (element === "") {
          passedPuzzle[lineIndex][columnIndex] =
            alphabet[Math.floor(Math.random() * alphabet.length)];
        }
      });
    });
  }

  function tileClick(row, column) {
    const numberOfSelectedTiles = selection.length;
    const location = [row, column];
    let tempSelection = [...selection];

    if (numberOfSelectedTiles === 0) {
      tempSelection.push(location);
      setSelection(tempSelection);
      return;
    }

    const [lastRow, lastColumn] = tempSelection[tempSelection.length - 1];

    if (
      (Math.abs(lastRow - row) === 1 && lastColumn === column) || // Vertical neighbor
      (Math.abs(lastColumn - column) === 1 && lastRow === row) // Horizontal neighbor
    ) {
      tempSelection.push(location);
      setSelection(tempSelection); // Update the selection state
    } else {
      console.log("Invalid selection! Only adjacent tiles can be selected.");
    }
    setTimeout(() => {
      setSelection([]);
    }, 5000);
  }

  function checkWordFound() {
    let characters = selection.map(([r, c]) => puzzle[r][c]).join("");
    console.log("Characters: ", characters);
    const index = wordsAdded.findIndex((word) => word === characters);
    if (index !== -1) {
      console.log("Word found at index:", index, "Word:", wordsAdded[index]);
      displayAlert("success", "You found a word!!");
      setFoundIndex(index);
      setTimeout(() => {
        setSelection([]);
      }, 1500);
    }
  }

  return (
    <div className="display-game">
      <h1>Word Search</h1>

      <List>
        <ListItemButton
          onClick={() => {
            setShowPuzzles(!showPuzzles);
          }}
        >
          <ListItemText primary="Select Puzzle Category" />
          {showPuzzles ? <FaAngleUp /> : <FaAngleDown />}
        </ListItemButton>
        <Collapse in={showPuzzles} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {availablePuzzles.map((c, i) => (
              <ListItemButton
                key={i}
                onClick={() => {
                  changePuzzle(c);
                  setShowPuzzles(false);
                }}
              >
                <ListItemText primary={c} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      </List>

      <div className="game-board">
        {puzzle.map((line, lineIndex) => (
          <div className="board-line" key={lineIndex}>
            {line.map((tile, columnIndex) => {
              const isSelected = selection.some(
                ([selRow, selCol]) =>
                  selRow === lineIndex && selCol === columnIndex
              );
              return (
                <div
                  key={columnIndex}
                  onClick={() => {
                    tileClick(lineIndex, columnIndex);
                  }}
                  className={`wordsearch-box ${isSelected && "tile-selected"}`}
                >
                  {tile}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div>
        <h2>{selection.map(([r, c]) => puzzle[r][c]).join("")}</h2>
        <h2>Words to Find:</h2>

        {wordsAdded.map((w, i) => (
          <p
            key={i}
            className={`${i === foundIndex ? "word-strikethrough" : "word"}`}
          >
            {w}
          </p>
        ))}
      </div>
    </div>
  );
}

export default WordSearch;
