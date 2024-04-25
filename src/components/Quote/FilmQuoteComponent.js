import React, { useState } from "react";
import { Button } from "@mui/material";
import QuoteDisplayer from "./QuoteDisplayer";
import DisplayListsOfQuotes from "./DisplayListsOfQuotes";
import quotes from "./quotes.json";

function FilmQuoteComponent() {
  const quoteList = quotes.quotes;
  const [randomQuote, setRandomQuote] = useState(quotes.quotes[0]);
  const [showList, setShowList] = useState(false);

  function getRandomQuote() {
    setRandomQuote(
      quotes.quotes[Math.floor(Math.random() * quotes.quotes.length)]
    );
  }
  return (
    <div>
      <h1>Quotes!</h1>
      {showList ? (
        <div>
          <DisplayListsOfQuotes allQuotes={quoteList} />
          <Button
            variant="contained"
            onClick={() => {
              getRandomQuote();
              setShowList(false);
            }}
          >
            Show Single Quote
          </Button>
        </div>
      ) : (
        <div>
          <QuoteDisplayer quote={randomQuote} />
          <Button variant="contained" onClick={() => setShowList(true)}>
            Show all Quotes
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              getRandomQuote();
            }}
          >
            Surprise me!
          </Button>
        </div>
      )}
    </div>
  );
}

export default FilmQuoteComponent;
