import { AppBar, Box, Button } from "@mui/material";
import React from "react";
import logo from "../../images/bike-logo.jpg";
import { Link } from "react-router-dom";

function NavBar({ backendOn, darkMode }) {
  return (
    <div className="nav-bar">
      <AppBar
        color={darkMode ? "secondary" : "success"}
        position="fixed"
        style={{ zIndex: "9" }}
      >
        <Box>
          <Link to="/">
            <Button>
              <img src={logo} alt="Cartoon Bike Logo" />
            </Button>
            <Button id="home" style={{ color: "black", fontWeight: "1000" }}>
              Home
            </Button>
          </Link>
          <Link to="/Adventure">
            <Button
              id="adventure"
              style={{ color: "black", fontWeight: "1000" }}
            >
              Adventure
            </Button>
          </Link>
          <Link to="/Calendar">
            <Button
              id="calendar"
              style={{ color: "black", fontWeight: "1000" }}
            >
              Calendar
            </Button>
          </Link>
          <Link to="/Games">
            <Button id="games" style={{ color: "black", fontWeight: "1000" }}>
              Games
            </Button>
          </Link>
          <Link to="/Jokes">
            <Button id="jokes" style={{ color: "black", fontWeight: "1000" }}>
              Jokes
            </Button>
          </Link>
          <Link to="/Quotes">
            <Button id="quotes" style={{ color: "black", fontWeight: "1000" }}>
              Quotes
            </Button>
          </Link>
          {backendOn && (
            <>
              <Link to="/Notes">
                <Button
                  id="notes"
                  style={{ color: "black", fontWeight: "1000" }}
                >
                  Notes
                </Button>
              </Link>
              <Link to="/Recipes">
                <Button
                  id="recipes"
                  style={{ color: "black", fontWeight: "1000" }}
                >
                  Recipes
                </Button>
              </Link>
              <Link to="/Bikes">
                <Button
                  id="bikes"
                  style={{ color: "black", fontWeight: "1000" }}
                >
                  Bikes
                </Button>
              </Link>
            </>
          )}
        </Box>
      </AppBar>
    </div>
  );
}
export default NavBar;
