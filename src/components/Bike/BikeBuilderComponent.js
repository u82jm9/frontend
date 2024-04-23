import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import "../../css/Bike.css";
import "../../css/App.css";
import dragonBallGif from "../../gifs/dragon_ball_form.gif";
import BikeMenuComponent from "./BikeMenuComponent";
import BikePartsTable from "./BikePartsTable";
import DisplayBikeImages from "./DisplayBikeImages";
import Logger from "../Logger";

const BIKE_OPTIONS_API_URL = "http://localhost:8088/demo/Options/";
const BIKE_BUILDER_API_URL = "http://localhost:8088/demo/FullBike/";
function BikeBuilderComponent(backendOn) {
  const [isLoading, setIsLoading] = useState(false);
  const [databaseBikes, setDatabaseBikes] = useState([]);
  const [updateBikeList, setUpdateBikeList] = useState(true);
  const [displayingBike, setDisplayingBike] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [bikeOnDisplay, setBikeOnDisplay] = useState({});
  const [options, setOptions] = useState({});
  const [parts, setParts] = useState({});
  const [showParts, setShowParts] = useState(false);

  useEffect(() => {
    getDatabaseBikes();
    setUpdateBikeList(false);
  }, [backendOn]);

  useEffect(() => {
    if (updateBikeList) {
      getDatabaseBikes();
      setUpdateBikeList(false);
    }
  }, [updateBikeList]);

  function updateBikeAndOptions(b, o) {
    updateBike(b);
    updateOptions(b, o);
  }

  async function updateBike(methodBike) {
    Logger.infoLog("Updating Design Bike!");
    try {
      let b = await axios.post(BIKE_BUILDER_API_URL + "UpdateBike", methodBike);
      Logger.warnLog("Update bike: ", b.data);
      changeBike(b.data);
    } catch (err) {
      Logger.errorLog(err);
    }
  }

  async function updateOptions(methodBike, methodOptions) {
    Logger.infoLog("Updating Options!");
    try {
      let combinedData = {
        bike: methodBike,
        options: methodOptions,
      };
      let b = await axios.post(
        BIKE_OPTIONS_API_URL + "GetOptions",
        combinedData
      );
      Logger.warnLog("Updated Options: ", b.data);
      setOptions(b.data);
    } catch (err) {
      Logger.errorLog(err);
    }
  }

  async function getDatabaseBikes() {
    Logger.infoLog("Getting all Bikes on DB");
    try {
      let b = await axios.get(BIKE_BUILDER_API_URL + "GetAll");
      Logger.warnLog("Got ", b.data.length, " built Bikes");
      setDatabaseBikes(b.data);
    } catch (err) {
      Logger.errorLog(err);
    }
  }

  async function changeBike(b) {
    setShowParts(false);
    setBikeOnDisplay(b);
    setDisplayingBike(true);
  }

  async function handleCreateBikeClick() {
    setEditMode(true);
    startNewBike();
    getOptionsForNewBike();
  }

  async function getOptionsForNewBike() {
    Logger.infoLog("Getting Options for a new Bike");
    try {
      let b = await axios.get(BIKE_OPTIONS_API_URL + "StartNewBike");
      setOptions(b.data);
      Logger.warnLog("Options for new Bike: ", b.data);
    } catch (err) {
      Logger.errorLog(err);
    }
  }

  async function startNewBike() {
    Logger.infoLog("Starting to design a new Bike!");
    try {
      let b = await axios.get(BIKE_BUILDER_API_URL + "StartNewBike");
      changeBike(b.data);
      Logger.warnLog("Starting new Bike: ", b.data);
    } catch (err) {
      Logger.errorLog(err);
    }
  }

  async function handleGetPartsClick() {
    setIsLoading(true);
    await getParts();
    setShowParts(true);
  }

  async function getParts() {
    Logger.infoLog("Getting Parts for Bike!");
    try {
      Logger.warnLog("Get parts for Bike: ", bikeOnDisplay);
      let b = await axios.post(
        BIKE_BUILDER_API_URL + "GetAllParts",
        bikeOnDisplay
      );
      Logger.warnLog("Parts returned: ", b.data);
      setParts(b.data);
    } catch (err) {
      Logger.errorLog(err);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  }

  function resetOptions(bike) {
    Logger.infoLog("Resetting Design bike.");
    deleteBike(bike);
    handleCreateBikeClick();
  }

  function deleteBike(bike) {
    try {
      Logger.infoLog("Deleting single Design bike");
      axios.delete(BIKE_BUILDER_API_URL + "DeleteBike", bike);
    } catch (err) {
      Logger.errorLog(err);
    }
  }

  return (
    <>
      {isLoading && (
        <div className="loading-img-container">
          <img src={dragonBallGif} alt="Sweet leveling up gif!" />
        </div>
      )}
      <div className={isLoading ? "dark" : "light"}>
        <h1>Welcome to the bike Builder</h1>
        {editMode && (
          <BikeMenuComponent
            resetOptions={resetOptions}
            updateBikeAndOptions={updateBikeAndOptions}
            options={options}
            url={BIKE_OPTIONS_API_URL}
            bike={bikeOnDisplay}
          />
        )}
        <Button variant="contained" onClick={() => handleCreateBikeClick()}>
          Create New Bike
        </Button>

        {displayingBike && (
          <Button variant="contained" onClick={() => handleGetPartsClick()}>
            Get Parts!
          </Button>
        )}
        {displayingBike && <DisplayBikeImages bike={bikeOnDisplay} />}
        {showParts && <BikePartsTable parts={parts} />}
        <h3>Check out some of our stock bikes</h3>
        <h3>Built Bikes:</h3>
        <div className="bike-menu">
          <ul>
            {databaseBikes.map((b, i) => (
              <div
                className="menu-item clickable"
                key={i}
                onClick={() => changeBike(b)}
              >
                {b.bikeName}
              </div>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default BikeBuilderComponent;
