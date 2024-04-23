import { useEffect, useState } from "react";
import BankHolidayComponent from "../BankHoliday/BankHolidayComponent";
import WeatherBaseComponet from "../Weather/WeatherBaseComponent";
import dragonBallGif from "../../gifs/dragon_ball_form.gif";

function HomePage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <>
      {isLoading && (
        <div className="component">
          <div className="loading-img-container">
            <img src={dragonBallGif} alt="Sweet leveling up gif!" />
          </div>
        </div>
      )}
      <BankHolidayComponent />
      <div className={isLoading ? "loading" : "loadingComplete"}>
        <WeatherBaseComponet />
      </div>
    </>
  );
}

export default HomePage;
