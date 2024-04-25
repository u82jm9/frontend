import React, { useEffect, useState } from "react";
import { Button, Switch } from "@mui/material";
import NavBar from "../NavBar/NavBar";

function PageLayout({ children, backendOn }) {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    logDarkModeToLocalStorage();
  }, darkMode);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function logDarkModeToLocalStorage() {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }

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
    <div className={`App ${darkMode ? "App-dark" : "App-light"}`}>
      <div className={`page ${darkMode ? "page-dark" : "page-light"}`}>
        <div
          className={`component ${
            darkMode ? "component-dark" : "component-light"
          }`}
        >
          <NavBar darkMode={darkMode} backendOn={backendOn} />
          <div className="dark-toggle">
            <h3>Dark Mode</h3>
            <Switch
              onClick={() => {
                setDarkMode(!darkMode);
              }}
            />
          </div>
          <div
            className={`display-component ${
              darkMode ? "display-component-dark" : "display-component-light"
            }`}
          >
            {children}
          </div>
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
