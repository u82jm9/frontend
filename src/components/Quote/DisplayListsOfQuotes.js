import { useEffect, useState } from "react";
import {
  Box,
  Input,
  InputLabel,
  Button,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import QuoteDisplayer from "./QuoteDisplayer";
import Logger from "../Logger";

const DisplayListsOfQuotes = ({ allQuotes }) => {
  const totalPages = allQuotes.sort(() => Math.random() - 0.5);
  const [displayList, setDisplayList] = useState([]);
  const [numberOfLists, setNumberOfLists] = useState(0);
  const [smallerLists, setSmallerLists] = useState([]);
  const [listRef, setListRef] = useState(0);
  const [filterSubject, setFilterSubject] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchBar, setShowSearchBar] = useState(false);

  useEffect(() => {
    setDisplayList(allQuotes.sort(() => Math.random() - 0.5));
  }, [allQuotes]);
  useEffect(() => {
    setListRef(0);
    createSmallerLists(displayList);
  }, [displayList]);

  function createSmallerLists(fullQuoteList) {
    Logger.infoLog("Creating smaller Quote lists for displaying");
    setNumberOfLists(Math.ceil(fullQuoteList.length / 5));
    let sl = [];
    for (let index = 0; index < Math.ceil(fullQuoteList.length / 5); index++) {
      let start = index * 5;
      let end = start + 5;
      sl.push(fullQuoteList.slice(start, end));
    }
    setSmallerLists(sl);
    Logger.warnLog("Smaller lists created");
  }

  function handleSortClick(s) {
    Logger.infoLog("Sorting Quotes by: " + s);
    let sortedList = [...displayList];
    if (s === "film") {
      Logger.warnLog("Sorting quotes by Film");
      sortedList.sort(function (a, b) {
        return a.film.localeCompare(b.film);
      });
    } else if (s === "actor") {
      Logger.warnLog("Sorting quotes by Actor");
      sortedList.sort(function (a, b) {
        return a.actor.localeCompare(b.actor);
      });
    } else if (s === "quote") {
      Logger.warnLog("Sorting quotes by Quote");
      sortedList.sort(function (a, b) {
        return a.line.localeCompare(b.line);
      });
    } else {
      Logger.warnLog("No sorting completed");
    }
    setDisplayList(sortedList);
    Logger.warnLog("Sorted Quotes");
  }

  function handleSearch() {
    if (filterSubject === "quote") {
      setDisplayList(
        displayList.filter((quote) =>
          quote.line.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else if (filterSubject === "film") {
      setDisplayList(
        displayList.filter((quote) =>
          quote.film.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else if (filterSubject === "actor") {
      setDisplayList(
        displayList.filter((quote) =>
          quote.actor.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      Logger.warnLog("No filtering completed");
    }
    setFilterSubject("");
    setSearchTerm("");
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
    setShowSearchBar(false);
  };

  return (
    <div>
      <div className="filter-sort">
        {showSearchBar && (
          <Box component="form" onSubmit={handleSubmit}>
            <FormControl style={{ marginBottom: "15px" }}>
              <InputLabel>Search</InputLabel>
              <Input
                type="text"
                id="filter"
                onChange={(e) => setSearchTerm(e.target.value)}
                onBlur={() => {
                  setTimeout(() => {
                    setShowSearchBar(false);
                  }, 2500);
                }}
              ></Input>
            </FormControl>
          </Box>
        )}
        <FormControl style={{ minWidth: "125px" }}>
          <InputLabel id="filter-select-label">Filter by:</InputLabel>
          <Select
            labelId="filter-select-label"
            id="filter-select"
            value={filterSubject}
            onChange={(e) => {
              setFilterSubject(e.target.value);
              setShowSearchBar(true);
            }}
          >
            <MenuItem value="quote">Quote</MenuItem>
            <MenuItem value="film">Film</MenuItem>
            <MenuItem value="actor">Actor</MenuItem>
          </Select>
        </FormControl>
        <FormControl style={{ minWidth: "125px" }}>
          <InputLabel id="sort-select-label">Sort by:</InputLabel>
          <Select labelId="sort-select-label" id="sort-select">
            <MenuItem onClick={() => handleSortClick("quote")} value="quote">
              Quote
            </MenuItem>
            <MenuItem onClick={() => handleSortClick("film")} value="film">
              Film
            </MenuItem>
            <MenuItem onClick={() => handleSortClick("actor")} value="actor">
              Actor
            </MenuItem>
          </Select>
        </FormControl>
      </div>
      <div>
        <div>
          {smallerLists[listRef] &&
            smallerLists[listRef].map((quote, i) => {
              return (
                <div key={i}>
                  <QuoteDisplayer quote={quote} />
                </div>
              );
            })}
        </div>
        <h6>
          Page {listRef + 1} of {numberOfLists}
        </h6>
        {numberOfLists > 1 && (
          <div className="controls">
            <Button
              variant="contained"
              onClick={() => {
                if (listRef !== 0) {
                  setListRef(listRef - 1);
                } else {
                  setListRef(smallerLists.length - 1);
                }
              }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                if (listRef === smallerLists.length - 1) {
                  setListRef(0);
                } else {
                  setListRef(listRef + 1);
                }
              }}
            >
              Next
            </Button>
          </div>
        )}
        {numberOfLists < totalPages && (
          <Button
            variant="contained"
            onClick={() => {
              setDisplayList(allQuotes.sort(() => Math.random() - 0.5));
            }}
          >
            Show All Quotes
          </Button>
        )}
      </div>
    </div>
  );
};
export default DisplayListsOfQuotes;
