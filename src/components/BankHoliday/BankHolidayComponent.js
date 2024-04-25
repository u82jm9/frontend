import axios from "axios";
import React, { useEffect, useState } from "react";
import Logger from "../Logger";

const BANK_HOLIDAY_API = "https://www.gov.uk/bank-holidays.json";
const today = new Date();
const BankHolidayComponent = () => {
  const [showHoliday, setShowHoliday] = useState(false);
  const [nextBankDay, setNextBankDay] = useState();
  const [findNextDate, setFindNextDate] = useState(true);
  useEffect(() => {
    getBankHolidays();
  }, []);

  async function getBankHolidays() {
    Logger.infoLog("Getting Bank Holidays from ONLINE!!");
    try {
      let b = await axios.get(BANK_HOLIDAY_API);
      const tempDays = b.data.scotland.events.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB;
      });
      getNextDay(tempDays);
    } catch (err) {
      Logger.errorLog(err);
    }
  }

  function getNextDay(days) {
    for (let i = 0; i < days.length; i++) {
      const eventDate = new Date(days[i].date);
      if (eventDate >= today && findNextDate) {
        Logger.infoLog("Next Bank Holiday event set!!");
        setNextBankDay(days[i]);
        setFindNextDate(false);
        break;
      }
    }
    setShowHoliday(true);
  }

  return (
    <div className="bank-holiday">
      <div className="top-sticker">
        {showHoliday && (
          <div>
            <h2>Bank Holiday</h2>
            <h3>{nextBankDay.title}</h3>
            <h1>{nextBankDay.date.split("-").reverse().join("/")}</h1>
          </div>
        )}
      </div>
      {showHoliday && nextBankDay.bunting && (
        <div className="bottom-sticker">
          <div>
            <h1>GET OUT THE BUNTING!!</h1>
          </div>
        </div>
      )}
    </div>
  );
};
export default BankHolidayComponent;
