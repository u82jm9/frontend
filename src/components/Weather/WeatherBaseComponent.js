import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import WeatherSearch from "./WeatherSearch";
import SmallWeatherDisplay from "./SmallWeatherDisplayTable";
import MediumWeatherDisplay from "./MediumWeatherDisplayTable";
import LargeWeatherDisplay from "./LargeWeatherDisplayTable";
import Logger from "../Logger";
import NavBar from "../NavBar/NavBar";

const WEATHER_API = "https://weatherapi-com.p.rapidapi.com/forecast.json";
function WeatherBaseComponent() {
  const [city, setCity] = useState("Edinburgh");
  const [forecast, setForecast] = useState([]);
  const [tableSize, setTableSize] = useState(1);
  const [hottestHours, setHottestHours] = useState([]);
  const [coldestHours, setColdestHours] = useState([]);

  useEffect(() => {
    if (forecast.length === 0) {
      getWeatherForecast("Edinburgh");
    }
  }, []);

  function changeTableSize(command) {
    if (command === "up") {
      if (tableSize === 3) {
        setTableSize(1);
      } else {
        setTableSize(tableSize + 1);
      }
    } else {
      if (tableSize === 1) {
        setTableSize(3);
      } else {
        setTableSize(tableSize - 1);
      }
    }
  }

  async function getWeatherForecast(c) {
    Logger.infoLog("Getting Forecast for: " + c);
    try {
      const options = {
        method: "GET",
        url: WEATHER_API,
        params: { q: c, days: "3" },
        headers: {
          "X-RapidAPI-Key":
            "2e1ecbe8d9msh8883e96a112d435p1360e2jsn1d90503594e6",
          "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
        },
      };
      let w = await axios.request(options);
      setCity(w.data.location.name);
      changeDaysText(w.data.forecast.forecastday);
    } catch (err) {
      Logger.errorLog("Failed to get Forecast");
      Logger.errorLog(err);
    }
  }

  function changeDaysText(forecastDays) {
    let tempHottestHours = [];
    let tempColdestHours = [];
    const updatedForecast = forecastDays.map((day) => {
      tempHottestHours.push(calculateHottestHour(day.hour));
      tempColdestHours.push(calculateColdestHour(day.hour));
      changeHoursText(day.hour);
      if (day.day.avgtemp_c > 25) {
        day.day.condition.text = "Hot";
      } else if (day.day.avgtemp_c < 5 && day.day.avgtemp_c > -3) {
        day.day.condition.text = "Cold";
      } else if (day.day.avgtemp_c < -3) {
        day.day.condition.text = "Freezing";
      } else if (day.day.daily_chance_of_snow > 75) {
        day.day.condition.text = "Snow";
      } else if (day.day.condition.text.includes("rain")) {
        day.day.condition.text = "Rain";
      } else if (
        day.day.condition.text.includes("sun") ||
        day.day.condition.text.includes("Sun")
      ) {
        day.day.condition.text = "Sunny";
      } else if (
        day.day.condition.text.includes("wind") ||
        day.day.condition.text.includes("Wind")
      ) {
        day.day.condition.text = "Windy";
      } else {
        day.day.condition.text = "Fine";
      }
      return day;
    });
    setForecast(updatedForecast);
    setHottestHours(tempHottestHours);
    setColdestHours(tempColdestHours);
    Logger.warnLog("Set Weather info to State variables");
  }

  function changeHoursText(allHours) {
    allHours.map((hour) => {
      if (hour.temp_c > 25) {
        hour.condition.text = "Hot";
      } else if (hour.temp_c < 5 && hour.temp_c > -3) {
        hour.condition.text = "Cold";
      } else if (hour.temp_c < -3) {
        hour.condition.text = "Freezing";
      } else if (hour.condition.text.includes("rain")) {
        hour.condition.text = "Rain";
      } else if (
        hour.condition.text.includes("sun") ||
        hour.condition.text.includes("Sun")
      ) {
        hour.condition.text = "Sunny";
      } else if (
        hour.condition.text.includes("wind") ||
        hour.condition.text.includes("Wind")
      ) {
        hour.condition.text = "Windy";
      } else {
        hour.condition.text = "Fine";
      }
      return hour;
    });
  }

  function calculateHottestHour(hours) {
    let hotHour = { time: "", temp: -20 };
    hours.map((h) => {
      if (h.temp_c > hotHour.temp) {
        hotHour.time = changeTimeFormat(h.time);
        hotHour.temp = h.temp_c;
      }
      return h;
    });
    return hotHour;
  }

  function calculateColdestHour(hours) {
    let coldHour = { time: "", temp: 100 };
    hours.map((h) => {
      if (h.temp_c < coldHour.temp) {
        coldHour.time = changeTimeFormat(h.time);
        coldHour.temp = h.temp_c;
      }
      return h;
    });
    return coldHour;
  }

  function changeTimeFormat(time) {
    time = time.slice(11);
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    if (time.length > 1) {
      time = time.slice(1);
      time[5] = +time[0] < 12 ? " AM" : " PM";
      time[0] = +time[0] % 12 || 12;
    }
    time = time.join("");
    return time;
  }

  return (
    <div className="component">
      <div className="display-component">
        <h1>Weather Forecast!!</h1>
        <h2>{city}</h2>
        <WeatherSearch getWeather={getWeatherForecast} />
        <div className="weather-table">
          {tableSize === 1 ? (
            <SmallWeatherDisplay data={forecast} />
          ) : tableSize === 2 ? (
            <MediumWeatherDisplay data={forecast} />
          ) : (
            <LargeWeatherDisplay
              data={forecast}
              hotHours={hottestHours}
              coldHours={coldestHours}
            />
          )}
        </div>
        <Button
          variant="contained"
          onClick={() => {
            changeTableSize("up");
          }}
        >
          {tableSize === 3 ? "Least" : "More"}
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            changeTableSize("down");
          }}
        >
          {tableSize === 1 ? "Most" : "Less"}
        </Button>
      </div>
    </div>
  );
}
export default WeatherBaseComponent;
