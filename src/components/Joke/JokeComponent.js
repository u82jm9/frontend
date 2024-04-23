import axios from "axios";
import { useState, useEffect } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemText,
  Button,
} from "@mui/material";
import RandomJoke from "./RandomJoke";
import CategoryJoke from "./CategoryJoke";
import Logger from "../Logger";

const RANDOM_JOKE_API_URL = "https://dad-jokes.p.rapidapi.com/random/joke";
const GET_JOKE_BY_CATEGORY_API_URL =
  "https://world-of-jokes1.p.rapidapi.com/v1/jokes/jokes-by-category";
const GET_CATEGORIES_API_URL =
  "https://world-of-jokes1.p.rapidapi.com/v1/jokes/categories";
const api = axios.create({
  headers: {
    "X-RapidAPI-Key": "2e1ecbe8d9msh8883e96a112d435p1360e2jsn1d90503594e6",
    "X-RapidAPI-Host": "world-of-jokes1.p.rapidapi.com",
  },
});

function JokeComponent() {
  const [joke, setJoke] = useState(null);
  const [displayingJoke, setDisplayingJoke] = useState(false);
  const [jokeType, setJokeType] = useState(false);
  const [listOfCategoryJokes, setListOfCategoryJokes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showCategories, setShowCategories] = useState(false);

  useEffect(() => {
    if (!displayingJoke) {
      getRandomJoke();
    }
  }, [displayingJoke]);

  useEffect(() => {
    Logger.infoLog("Joke Component did mount.");
    async function fetchData() {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (err) {
        Logger.errorLog(err);
      }
    }
    fetchData();
  }, []);

  async function getRandomJoke() {
    try {
      Logger.infoLog("Getting Random Joke!");
      const options = {
        method: "GET",
        url: RANDOM_JOKE_API_URL,
        headers: {
          "X-RapidAPI-Key":
            "2e1ecbe8d9msh8883e96a112d435p1360e2jsn1d90503594e6",
          "X-RapidAPI-Host": "dad-jokes.p.rapidapi.com",
        },
      };
      let j = await axios.request(options);
      Logger.infoLog("Setting Joke to Random Joke");
      setJokeType(true);
      setJoke(j.data.body[0]);
      Logger.warnLog("Joke Returned: ", j.data);
    } catch (err) {
      Logger.errorLog(err);
    } finally {
      setDisplayingJoke(true);
    }
  }

  async function getCategories() {
    try {
      Logger.infoLog("Getting Categories!");
      const r = await api.get(GET_CATEGORIES_API_URL);
      Logger.warnLog("Categories returned: ", r.data);
      if (r.data.message && r.data.message.includes("exceeded")) {
        Logger.errorLog(
          "Returning empty array due to reaching limit on Categories API"
        );
        return [];
      } else {
        return r.data;
      }
    } catch (err) {
      Logger.errorLog(err);
      return [];
    }
  }

  async function getJokeByCategory(category) {
    try {
      Logger.infoLog("Getting joke in Category.");
      const r = await api.get(GET_JOKE_BY_CATEGORY_API_URL, {
        params: {
          limit: "100",
          page: "1",
          category: category,
          sortBy: "score:desc",
        },
      });
      Logger.warnLog("Got " + r.data.results.length + " category Jokes!");
      setListOfCategoryJokes(r.data.results);
      Logger.warnLog("Category Jokes returned: ", r.data.results);
    } catch (err) {
      Logger.errorLog(err);
    } finally {
      pickCategoryJoke();
    }
  }

  async function pickCategoryJoke() {
    Logger.infoLog("Setting joke to category Joke");
    const numberOfJokes = listOfCategoryJokes.length;
    let r = 0 + Math.floor(Math.random() * numberOfJokes);
    setJoke(listOfCategoryJokes[r]);
    Logger.warnLog("Setting category joke to: " + listOfCategoryJokes[r]);
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
                    setJokeType(false);
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
          {jokeType ? (
            <div>
              <RandomJoke joke={joke} />
              <Button
                variant="contained"
                onClick={() => {
                  setDisplayingJoke(false);
                }}
              >
                Surprise me!
              </Button>
            </div>
          ) : (
            <div>
              <CategoryJoke joke={joke} />
              <Button
                variant="contained"
                onClick={() => {
                  pickCategoryJoke();
                }}
              >
                Next in category!
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  setDisplayingJoke(false);
                }}
              >
                Surprise me!
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
export default JokeComponent;
