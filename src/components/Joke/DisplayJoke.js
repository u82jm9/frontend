import React from "react";

const DisplayJoke = ({ joke }) => {
  return (
    <div className="display-joke">
      <h1>{joke.category} Joke</h1>
      {joke.type === "single" ? (
        <h2>{joke.joke}</h2>
      ) : (
        <>
          <h2>{joke.setup}</h2>
          <h3>{joke.delivery}</h3>
        </>
      )}
    </div>
  );
};

export default DisplayJoke;
