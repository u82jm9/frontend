import React, { useState } from "react";
import { GiCartwheel } from "react-icons/gi";
import { Box, FormControl, InputLabel, Input } from "@mui/material";
import Logger from "../Logger";

const BikeMenuComponent = ({
  resetOptions,
  updateBikeAndOptions,
  options,
  bike,
}) => {
  const [showChangeName, setShowChangeName] = useState(true);
  const [selectionMade, setSelectionMade] = useState(false);
  let timer = null;

  async function handleNameChange(e) {
    Logger.infoLog("Changing Bike name.");
    try {
      const { id, value } = e.target;
      const tempBike = await { ...bike, [id]: value };
      Logger.warnLog("Bike Name change method! Bike: ", tempBike);
      updateBikeAndOptions(tempBike, options);
      clearTimeout(timer);
      timer = setTimeout(() => {
        setShowChangeName(false);
      }, 3000);
    } catch (err) {
      Logger.errorLog(err);
    }
  }

  async function handleFrameClick(e) {
    setSelectionMade(true);
    try {
      const fieldId = e.target.id;
      const fieldValue = e.target.value;
      const tempFrame = await {
        ...bike.frame,
        [fieldId]: fieldValue.toUpperCase().replace(" ", "_"),
      };
      const tempBike = await { ...bike, frame: tempFrame };
      Logger.warnLog("Frame option clicked Bike: ", tempBike);
      updateBikeAndOptions(tempBike, options);
    } catch (err) {
      Logger.errorLog(err);
    }
  }

  async function handleClick(e) {
    setSelectionMade(true);
    Logger.infoLog("Updating Bike design.");
    try {
      const { id, value } = e.target;
      const tempBike = await {
        ...bike,
        [id]: value.toUpperCase().replace(" ", "_"),
      };
      updateBikeAndOptions(tempBike, options);
    } catch (err) {
      Logger.errorLog(err);
    }
  }

  return (
    <div>
      <div className="bike-menu">
        <div
          onClick={() => {
            setShowChangeName(true);
            resetOptions();
          }}
          className="icon menu-item"
        >
          <GiCartwheel />
        </div>
        {showChangeName && (
          <div className="menu-item text-box">
            <Box component="form">
              <FormControl>
                <InputLabel>Bike Name</InputLabel>
                <Input
                  type="text"
                  id="bikeName"
                  value={bike.bikeName}
                  onChange={(e) => handleNameChange(e)}
                  onBlur={() => setShowChangeName(false)}
                ></Input>
              </FormControl>
            </Box>
          </div>
        )}
        {options.showFrameStyles && (
          <div className="frame menu-item clickable">
            <ul>
              <select
                name="frame-style"
                id="frameStyle"
                onChange={(e) => {
                  handleFrameClick(e);
                  options = { ...options, showFrameStyles: false };
                }}
              >
                <option value="">Choose Your Frame</option>
                {options.frameStyles.map((f, i) => (
                  <option value={f} key={i}>
                    {f}
                  </option>
                ))}
              </select>
            </ul>
          </div>
        )}
        {options.showFrameSizes && (
          <div className="frame-size menu-item clickable">
            <ul>
              <select
                name="framesize"
                id="size"
                onChange={(e) => {
                  handleFrameClick(e);
                  options = { ...options, showFrameSizes: false };
                }}
              >
                <option value="">Choose Your Size</option>
                {options.frameSizes.map((g, i) => (
                  <option value={g} key={i}>
                    {g}
                  </option>
                ))}
              </select>
            </ul>
          </div>
        )}
        {options.showBarStyles && (
          <div className="bars menu-item clickable">
            <ul>
              <select
                name="bar-type"
                id="handleBarType"
                onChange={(e) => {
                  handleClick(e);
                  options = { ...options, showBarStyles: false };
                }}
              >
                <option value="">Choose Your Bars</option>
                {options.barStyles.map((b, i) => (
                  <option value={b} key={i}>
                    {b}
                  </option>
                ))}
              </select>
            </ul>
          </div>
        )}
        {options.showBrakeStyles && (
          <div className="brakes menu-item clickable">
            <ul>
              <select
                name="brake-type"
                id="brakeType"
                onChange={(e) => {
                  handleClick(e);
                  options = { ...options, showBrakeStyles: false };
                }}
              >
                <option value="">Choose Your Brakes</option>
                {options.brakeStyles.map((br, i) => (
                  <option value={br} key={i}>
                    {br}
                  </option>
                ))}
              </select>
            </ul>
          </div>
        )}
        {options.showWheelPreference && (
          <div className="wheels menu-item clickable">
            <ul>
              <select
                name="wheelPreference"
                id="wheelPreference"
                onChange={(e) => {
                  handleClick(e);
                  options = { ...options, showWheelPreference: false };
                }}
              >
                <option value="">Wheel Preference</option>
                {options.wheelPreference.map((g, i) => (
                  <option value={g} key={i}>
                    {g}
                  </option>
                ))}
              </select>
            </ul>
          </div>
        )}
        {options.showFrontGears && (
          <div className="front-gears menu-item clickable">
            <ul>
              <select
                name="front-gears"
                id="numberOfFrontGears"
                onChange={(e) => {
                  handleClick(e);
                  options = { ...options, showFrontGears: false };
                }}
              >
                <option value="">Gears at front</option>
                {options.numberOfFrontGears.map((g, i) => (
                  <option value={g} key={i}>
                    {g}
                  </option>
                ))}
              </select>
            </ul>
          </div>
        )}
        {options.showRearGears && (
          <div className="rear-gears menu-item clickable">
            <ul>
              <select
                name="rear-gears"
                id="numberOfRearGears"
                onChange={(e) => {
                  handleClick(e);
                  options = { ...options, showRearGears: false };
                }}
              >
                <option value="">Gears at rear</option>
                {options.numberOfRearGears.map((g, i) => (
                  <option value={g} key={i}>
                    {g}
                  </option>
                ))}
              </select>
            </ul>
          </div>
        )}

        {selectionMade && (
          <div
            className="menu-item clickable"
            onClick={() => {
              resetOptions(bike);
              setSelectionMade(false);
            }}
          >
            Restart
          </div>
        )}
      </div>
    </div>
  );
};

export default BikeMenuComponent;
