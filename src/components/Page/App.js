import React, { useState, useEffect } from "react";
import Alert from "@mui/material/Alert";
import axios from "axios";
import "../../css/App.css";
import "../../css/Background.css";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import PageLayout from "./PageLayout";
import GamesComponent from "../Games/GamesComponent";
import HomePage from "./HomePage";
import JokeComponent from "../Joke/JokeComponent";
import RecipeComponent from "../Recipe/RecipeComponent";
import FilmQuoteComponent from "../Quote/FilmQuoteComponent";
import StickyNoteComponent from "../StickyNote/StickyNoteComponent";
import BikeBuilderComponent from "../Bike/BikeBuilderComponent";
import Logger from "../Logger";
import GoogleCalendar from "../Google/GoogleCalendar";

const BACK_END_API = "http://localhost:8088/demo/Test/";
const pagesRequireBackend = ["/Notes", "/Bikes"];
function App() {
  const [backendOn, setBackendOn] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("");

  let location = useLocation();
  let navigate = useNavigate();

  useEffect(() => {
    checkBackend();
    const interval = setInterval(checkBackend, 5000);
    return () => clearInterval(interval);
  }, []);

  async function checkBackend() {
    try {
      let r = await axios.get(BACK_END_API + "IsThisThingOn");
      setBackendOn(r.data);
      const status = String(backendOn);
      console.log("Back-End ON!!! = " + status);
    } catch (err) {
      setBackendOn(false);
      const status = String(backendOn);
      console.log("Back-End not on!! = " + status);
    } finally {
      checkPage();
    }
  }

  function checkPage() {
    if (!backendOn && pagesRequireBackend.includes(location.pathname)) {
      navigate("/");
      Logger.warnLog("Back end off. Redirected to home page");
    }
  }

  function displayAlertMessage(severity, message) {
    setAlertSeverity(severity);
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      setAlertMessage("");
      setAlertSeverity("");
    }, 2500);
  }

  return (
    <React.StrictMode>
      <Routes>
        <Route
          index
          element={
            <PageLayout backendOn={backendOn}>
              {showAlert && (
                <Alert severity={alertSeverity}>{alertMessage}</Alert>
              )}
              <HomePage alertMethod={displayAlertMessage} />
            </PageLayout>
          }
        />
        <Route
          path="/Calendar"
          element={
            <PageLayout backendOn={backendOn}>
              {showAlert && (
                <Alert severity={alertSeverity}>{alertMessage}</Alert>
              )}
              <GoogleCalendar alertMethod={displayAlertMessage} />
            </PageLayout>
          }
        />
        <Route
          path="/Games"
          element={
            <PageLayout backendOn={backendOn}>
              {showAlert && (
                <Alert severity={alertSeverity}>{alertMessage}</Alert>
              )}
              <GamesComponent alertMethod={displayAlertMessage} />
            </PageLayout>
          }
        />
        <Route
          path="/Jokes"
          element={
            <PageLayout backendOn={backendOn}>
              {showAlert && (
                <Alert severity={alertSeverity}>{alertMessage}</Alert>
              )}
              <JokeComponent
                alertMethod={displayAlertMessage}
                backendOn={backendOn}
              />
            </PageLayout>
          }
        />
        <Route
          path="/Quotes"
          element={
            <PageLayout backendOn={backendOn}>
              <FilmQuoteComponent />
            </PageLayout>
          }
        />
        <Route
          path="/Notes"
          element={
            <PageLayout backendOn={backendOn}>
              {showAlert && (
                <Alert severity={alertSeverity}>{alertMessage}</Alert>
              )}
              <StickyNoteComponent alertMethod={displayAlertMessage} />
            </PageLayout>
          }
        />
        <Route
          path="/Recipes"
          element={
            <PageLayout backendOn={backendOn}>
              {showAlert && (
                <Alert severity={alertSeverity}>{alertMessage}</Alert>
              )}
              <RecipeComponent alertMethod={displayAlertMessage} />
            </PageLayout>
          }
        />
        <Route
          path="/Bikes"
          element={
            <PageLayout backendOn={backendOn}>
              {showAlert && (
                <Alert severity={alertSeverity}>{alertMessage}</Alert>
              )}
              <BikeBuilderComponent alertMethod={displayAlertMessage} />
            </PageLayout>
          }
        />
      </Routes>
    </React.StrictMode>
  );
}

export default App;
