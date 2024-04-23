import React, { useState } from "react";
import { Box, Input, InputLabel, Button, FormControl } from "@mui/material";

const WeatherSearch = ({ getWeather }) => {
  const [tempCity, setTempCity] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    getWeather(tempCity);
    setTempCity("");
  };

  return (
    <div className="weather-search">
      <Box component="form" onSubmit={handleSubmit}>
        <FormControl>
          <InputLabel>City</InputLabel>
          <Input
            type="text"
            id="city-search"
            value={tempCity}
            onChange={(e) => {
              setTempCity(e.target.value);
            }}
          />
        </FormControl>
        <Button variant="contained" type="submit">
          Search
        </Button>
      </Box>
    </div>
  );
};
export default WeatherSearch;
