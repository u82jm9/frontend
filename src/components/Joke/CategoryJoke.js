import React from "react";

const CategoryJoke = ({ joke }) => {
  return (
    <div>
      <h1>Category Joke</h1>
      <h2>{joke.body}</h2>
    </div>
  );
};

export default CategoryJoke;
