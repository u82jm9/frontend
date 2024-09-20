import axios from "axios";
import DisplayJoke from "./DisplayJoke";
import { useState, useEffect } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemText,
  Button,
} from "@mui/material";
import Logger from "../Logger";

const BACKEND_JOKE_API = "http://localhost:8088/demo/Test/";
const JOKE_API_URL = "https://v2.jokeapi.dev/joke/";
const GET_CATEGORIES_API_URL = "https://v2.jokeapi.dev/categories";

function JokeComponent({ backendOn, alertMethod }) {
  const [joke, setJoke] = useState(null);
  const [displayingJoke, setDisplayingJoke] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showCategories, setShowCategories] = useState(false);
  const [isOneLiner, setIsOneLiner] = useState(null);
  const [savedJokes, setSavedJokes] = useState([]);

  useEffect(() => {
    if (!displayingJoke) {
      getJokeByCategory("Any");
    }
  }, [displayingJoke]);

  useEffect(() => {
    getCategories();
  }, []);

  async function getCategories() {
    try {
      Logger.infoLog("Getting Categories!");
      const r = await axios.get(GET_CATEGORIES_API_URL);
      Logger.warnLog("Categories returned: ", r.data);
      setCategories(r.data.categories);
    } catch (err) {
      Logger.errorLog(err);
      setCategories([]);
    }
  }

  async function getJokeByCategory(category) {
    try {
      Logger.infoLog("Getting joke in Category: " + category);
      const r = await axios.get(JOKE_API_URL + category);
      setJoke(r.data);
      if (r.data.type === "twopart") {
        setIsOneLiner(false);
      } else {
        setIsOneLiner(true);
      }
      Logger.warnLog("Joke returned: ", r.data);
      setDisplayingJoke(true);
    } catch (err) {
      Logger.errorLog(err);
    }
  }

  function saveJoke() {
    let j;
    if (isOneLiner) {
      j = {
        category: joke.category,
        joke: joke.joke,
        type: joke.type,
      };
    } else {
      j = {
        category: joke.category,
        setup: joke.setup,
        delivery: joke.delivery,
        type: joke.type,
      };
    }
    Logger.infoLog("Saving Joke!");
    try {
      axios.post(BACKEND_JOKE_API + "SaveThis", j);
      alertMethod("success", "Joke Saved!");
    } catch (err) {
      Logger.errorLog(err);
      alertMethod("error", "Sorry, could not save Joke :(");
    }
  }

  async function getSavedJokes() {
    try {
      const j = await axios.get(BACKEND_JOKE_API + "GetSavedJokes");
      setSavedJokes(j.data);
    } catch (err) {
      Logger.errorLog(err);
      alertMethod("error", "Sorry, could not retrieve saved Jokes");
    }
  }

  return (
    <>
      <h1>Jokes!</h1>
      {categories.length > 0 && (
        <List>
          <ListItemButton
            onClick={() => {
              setShowCategories(!showCategories);
            }}
          >
            <ListItemText primary="Select Joke Category" />
            {showCategories ? <FaAngleUp /> : <FaAngleDown />}
          </ListItemButton>
          <Collapse in={showCategories} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {categories.map((c, i) => (
                <ListItemButton
                  key={i}
                  onClick={() => {
                    Logger.warnLog("Option Clicked: " + c);
                    getJokeByCategory(c);
                    setShowCategories(false);
                  }}
                >
                  <ListItemText primary={c} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        </List>
      )}
      {displayingJoke && (
        <div>
          <div>
            <div>
              {savedJokes.length > 0 ? (
                savedJokes.map((j, i) => <DisplayJoke key={i} joke={j} />)
              ) : (
                <DisplayJoke joke={joke} />
              )}
            </div>
            <Button
              variant="contained"
              onClick={() => {
                getJokeByCategory("Any");
                setSavedJokes([]);
              }}
            >
              Surprise me!
            </Button>
            {joke.category !== "Any" && savedJokes.length === 0 && (
              <Button
                variant="contained"
                onClick={() => {
                  getJokeByCategory(joke.category);
                }}
              >
                Same Category
              </Button>
            )}
          </div>
          {backendOn && savedJokes.length === 0 && (
            <>
              <Button
                variant="contained"
                onClick={() => {
                  saveJoke();
                }}
              >
                I like it!
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  getSavedJokes();
                }}
              >
                Get Saved Jokes
              </Button>
            </>
          )}
        </div>
      )}
    </>
  );
}
export default JokeComponent;
