import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import NavBar from "../NavBar/NavBar";

function PageLayout({ children, backendOn }) {
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setShowScrollButton(false);
  }
  function handleScroll() {
    if (window.scrollY > 0) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  }
  return (
    <div className="App">
      <div className="page">
        <div className="component">
          <NavBar backendOn={backendOn} />
          <div className="display-component">{children}</div>
        </div>
        {showScrollButton && (
          <div className="scroll-button">
            <Button
              variant="contained"
              onClick={() => {
                scrollToTop();
              }}
            >
              ^
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PageLayout;
