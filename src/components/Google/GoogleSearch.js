import { useEffect } from "react";

function GoogleSearch() {
  useEffect(() => {
    // Dynamically load the Google CSE script
    const script = document.createElement("script");
    script.src = "https://cse.google.com/cse.js?cx=f3b4099a2c3b14e80";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="google-search">
      <div className="gcse-search">
        <div>
          <div className="gcse-searchbox"></div>
        </div>
        <div>
          <div className="gcse-searchresults"></div>
        </div>
      </div>
    </div>
  );
}

export default GoogleSearch;