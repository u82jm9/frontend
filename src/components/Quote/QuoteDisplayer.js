const QuoteDisplayer = ({ quote }) => {
  return (
    <div className="display-quote">
      <h1>Quote: "{quote.line}"</h1>
      <h2>In Film: {quote.film}</h2>
      <h3>By Actor: {quote.actor}</h3>
    </div>
  );
};

export default QuoteDisplayer;
