import { useEffect, useState } from "react";
import axios from "axios";
import Logger from "../Logger";
import Checkbox from "@mui/material/Checkbox";

function FuelPriceComponent() {
  const [showDiesel, setShowDiesel] = useState(true);
  const [showPetrol, setShowPetrol] = useState(false);
  const [fuelPrices, setFuelPrices] = useState([]);
  const FUEL_API = "http://localhost:8088/demo/Test/GetFuelPrices";

  useEffect(() => {
    getFuelPrice();
  }, []);

  async function getFuelPrice() {
    Logger.infoLog("Getting Fuel Prices");
    try {
      let p = await axios.get(FUEL_API);
      console.log(p.data);
      setFuelPrices(p.data);
    } catch (err) {
      Logger.errorLog(err);
    }
  }

  return (
    <div className="component">
      <div className="fuel-price">
        <h1>Fuel Price Checker!!</h1>
        <Checkbox
          checked={showDiesel}
          onChange={() => setShowDiesel(!showDiesel)}
        />
        Diesel
        <Checkbox
          checked={showPetrol}
          onChange={() => setShowPetrol(!showPetrol)}
        />
        Petrol
        {showDiesel || showPetrol ? (
          <div className="weather-table">
            <table>
              <thead>
                <tr>
                  <th>Brand</th>
                  <th>Fuel</th>
                  <th>Price (pence)</th>
                  <th>Date Updated</th>
                </tr>
              </thead>
              <tbody>
                {fuelPrices
                  .filter((entry) => {
                    const fuelType = entry.fuelType?.toLowerCase();
                    if (fuelType === "diesel" && !showDiesel) return false;
                    if (fuelType === "petrol" && !showPetrol) return false;
                    return true;
                  })
                  .map((entry, i) => (
                    <tr key={i}>
                      <td>{entry.brand}</td>
                      <td>{entry.fuelType}</td>
                      <td>{entry.price}</td>
                      <td>{entry.dateUpdated}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default FuelPriceComponent;
