import { Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Logger from "../Logger";

const BIKE_IMAGES_API_URL = "http://localhost:8088/demo/Image/";
const DisplayBikeImages = ({ bike }) => {
  const [imageRef, setImageRef] = useState(0);
  const [listOfImages, setListOfImages] = useState([]);

  useEffect(() => {
    chooseImages();
  }, [bike]);

  async function chooseImages() {
    Logger.infoLog("Getting Images for Bike.");
    try {
      let tempList = await axios.post(BIKE_IMAGES_API_URL + "GetImages", bike);
      Logger.warnLog("Images returned: ", tempList.data);
      setListOfImages(tempList.data);
    } catch (err) {
      Logger.errorLog(err);
    }
  }

  return (
    <div>
      {listOfImages.length > 1 && (
        <div className="bike-display">
          <div className="image-container slider">
            <h1>{listOfImages[imageRef].altText}</h1>
            <div className="images">
              <img
                src={require(`../../images/${listOfImages[imageRef].src}`)}
                alt={listOfImages[imageRef].altText}
              />
            </div>
          </div>
          <div className="controls">
            <Button
              variant="contained"
              onClick={() => {
                if (imageRef !== 0) {
                  setImageRef(imageRef - 1);
                } else {
                  setImageRef(listOfImages.length - 1);
                }
              }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                if (imageRef === listOfImages.length - 1) {
                  setImageRef(0);
                } else {
                  setImageRef(imageRef + 1);
                }
              }}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayBikeImages;
