import axios from "axios";
import { useEffect, useState } from "react";
import { Box, Input, InputLabel, Button, FormControl } from "@mui/material";
import Logger from "../Logger";
import knifeFork from '../../images/knife_fork.png';

const BACKEND_RECIPE_API = "http://localhost:8088/demo/Recipes/";

function RecipeComponent({ backendOn, alertMethod }) {
  const [validSites, setValidSites] = useState([]);
  const [recipe, setRecipe] = useState(null);
  const [tempRecipe, setTempRecipe] = useState("");

  useEffect(() => {
    getValidSites();
  }
    , []);

  async function getValidSites() {
    Logger.infoLog("Getting valid sites for recipe processing");
    try {
      let b = await axios.get(BACKEND_RECIPE_API + "GetValidSites");
      setValidSites(b.data);
      let message = "Valid sites received: " + b.data.toString();
      Logger.infoLog(message);
    } catch (err) {
      Logger.errorLog("Get Valid Recipe sites failed!");
      alertMethod("error", "Sorry, could not get valid sites :(");
      Logger.errorLog(err);
    }
  }

  async function processRecipe() {
    let message = "Processing Recipe! " + tempRecipe.toString();
    Logger.infoLog(message);
    try {
      const DTORecipe = {
        recipeLink: tempRecipe
      }
      const r = await axios.post(BACKEND_RECIPE_API + "ProcessRecipe", DTORecipe);
      setRecipe(r.data);
      alertMethod("success", "Recipe Sent!");
    } catch (err) {
      Logger.errorLog(err);
      alertMethod("error", "Sorry, could not process Recipe :(");
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    processRecipe();
    setTempRecipe("");
  };

  return (
    <div className="recipe-component" >
      <div className="recipe-header">
        <h1>Recipe Processor!</h1>
        <p>
          Paste a link to a recipe below and it will be processed.
        </p>
        <h3>Sites that can be processed:</h3>
        {validSites.length > 0 && (<ul>
          {validSites.map((site, index) => (
            <li key={index}>
              <img
                src={knifeFork}
                alt={"Knife & Fork"}
              />
              <a
                href={`https://www.${site}`}
                target="_blank"
                rel="noopener noreferrer">{site}</a>
            </li>
          ))}
        </ul>)}
        <div className="recipe-search">
          <Box component="form" onSubmit={handleSubmit}>
            <FormControl>
              <InputLabel>Recipe</InputLabel>
              <Input
                type="text"
                id="recipe-search"
                value={tempRecipe}
                placeholder="Paste a recipe link here"
                onChange={(e) => {
                  setTempRecipe(e.target.value);
                }}
              />
            </FormControl>
            <Button variant="contained" type="submit">
              Search
            </Button>
          </Box>
        </div>
      </div>
      {recipe && (
        <div className="recipe-display">
          <div className="recipe-result">
            <h1>{recipe.recipeName}</h1>
            <div className="recipe-ingrdients">
              <h2>Ingredients:</h2>
              {Object.entries(recipe.ingredients).map(([key, items]) => (
                <div key={key}><h3>{key}</h3>
                  <ul>{items.map((item, i) => (
                    <li key={i}>{item}</li>))}</ul></div>
              ))}
            </div>
            <div className="recipe-instructions">
              <h2>Instructions:</h2>
              <ul>
                {recipe.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>))}
              </ul>
            </div>
            {recipe.additionalNotes && (
              <div className="recipe-notes">
                <h2>Notes:</h2>
                <p>{recipe.additionalNotes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default RecipeComponent;
