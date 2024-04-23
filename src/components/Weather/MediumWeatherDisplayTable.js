import React from "react";
import moment from "moment/moment";

const MediumWeatherDisplayTable = ({ data }) => {
  return (
    <div className="medium-table">
      <table>
        <thead>
          <tr>
            <th rowSpan={2}>Day</th>
            <th rowSpan={2}>Sunrise</th>
            <th rowSpan={2}>Sunset</th>
            <th colSpan={5}>Brief Hourly Breakdown</th>
            <th rowSpan={2}>
              Max
              <br />
              Temp (°C)
            </th>
            <th rowSpan={2}>
              Min
              <br />
              Temp (°C)
            </th>
          </tr>
          <tr>
            <th>9am</th>
            <th>Noon</th>
            <th>3pm</th>
            <th>6pm</th>
            <th>9pm</th>
          </tr>
        </thead>
        <tbody>
          {data.map((data, i) => (
            <tr key={i}>
              <td>{moment(data.date).format("dddd")}</td>
              <td>{data.astro.sunrise}</td>
              <td>{data.astro.sunset}</td>
              <td>
                <img
                  src={require(`../../gifs/${data.hour[8].condition.text}.gif`)}
                  alt={data.hour[8].condition.text}
                />
                <br />
                {data.hour[8].condition.text}
              </td>
              <td>
                <img
                  src={require(`../../gifs/${data.hour[11].condition.text}.gif`)}
                  alt={data.hour[11].condition.text}
                />
                <br />
                {data.hour[11].condition.text}
              </td>
              <td>
                <img
                  src={require(`../../gifs/${data.hour[14].condition.text}.gif`)}
                  alt={data.hour[14].condition.text}
                />
                <br />
                {data.hour[14].condition.text}
              </td>
              <td>
                <img
                  src={require(`../../gifs/${data.hour[17].condition.text}.gif`)}
                  alt={data.hour[17].condition.text}
                />
                <br />
                {data.hour[17].condition.text}
              </td>
              <td>
                <img
                  src={require(`../../gifs/${data.hour[20].condition.text}.gif`)}
                  alt={data.hour[20].condition.text}
                />
                <br />
                {data.hour[20].condition.text}
              </td>
              <td>{data.day.maxtemp_c}</td>
              <td>{data.day.mintemp_c}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MediumWeatherDisplayTable;
