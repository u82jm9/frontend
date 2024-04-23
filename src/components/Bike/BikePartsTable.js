import React from "react";

const BikePartsTable = ({ parts }) => {
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
            </tr>
          </thead>
          <tbody>
            {parts.listOfParts.map((part, i) => (
              <tr key={i}>
                <td>{part.component}</td>
                <td>{part.name}</td>
                <td>£{part.price}</td>
                <td>
                  <a href={part.link}>{part.link}</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BikePartsTable;
