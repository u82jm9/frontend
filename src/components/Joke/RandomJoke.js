import React from "react";

const RandomJoke = ({ joke }) => {
  return (
    <div>
      <h1>Random Joke</h1>
      <h2>{joke.setup}</h2>
      <h3>{joke.punchline}</h3>
    </div>
  );
};

export default RandomJoke;
