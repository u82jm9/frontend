import React, { useState, useEffect } from "react";

const BikePartsTable = ({ parts }) => {
  const [linkOutOfDate, setLinkOutOfDate] = useState(false);
  useEffect(() => {
    setLinkOutOfDate(false);
    checkLinksAreInDate();
  }, [parts.listOfParts]);

  function checkLinksAreInDate() {
    if (parts.listOfParts.some((part) => !part.isUpToDate)) {
      setLinkOutOfDate(true);
    }
  }

  return (
    <div>
      <h1>Parts Table!</h1>
      <div className="bike-table">
        <h3>Total: {parts.totalPriceAsString}</h3>
        <table>
          <thead>
            <tr>
              <th>Component</th>
              <th>Part Name</th>
              <th>Price</th>
              <th>Link</th>
              {linkOutOfDate && <th>Last Updated</th>}
            </tr>
          </thead>
          <tbody>
            {parts.listOfParts.map((part, i) => (
              <tr key={i}>
                <td>{part.component}</td>
                <td>{part.name}</td>
                {part.isUpToDate ? <td>£{part.price}</td> : <td>NA</td>}
                <td>
                  <a href={part.link}>{part.link}</a>
                </td>
                {linkOutOfDate && <td>{part.dateLastUpdated}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BikePartsTable;
