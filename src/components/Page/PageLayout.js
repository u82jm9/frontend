import { useEffect, useState } from "react";
import GoogleSearch from "../Google/GoogleSearch";
import { Button, Switch } from "@mui/material";
import NavBar from "../NavBar/NavBar";

function PageLayout({ children, backendOn }) {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    logBackEndOnToLocalStorage();
  }, [backendOn]);

  useEffect(() => {
    logDarkModeToLocalStorage();
  }, [darkMode]);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function logBackEndOnToLocalStorage() {
    localStorage.setItem("backEndOn", JSON.stringify(backendOn));
  }

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
          className={`component ${darkMode ? "component-dark" : "component-light"
            }`}
        >
          <div className="dark-toggle">
            <h3>Dark Mode</h3>
            <Switch
              className="toggle-button"
              onClick={() => {
                setDarkMode(!darkMode);
              }}
            />
          </div>
          <NavBar darkMode={darkMode} backendOn={backendOn} />
          <GoogleSearch />

          <div
            className={`display-component ${darkMode ? "display-component-dark" : "display-component-light"
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
