import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../css/App.css";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import PageLayout from "./PageLayout";
import HomePage from "./HomePage";
import JokeComponent from "../Joke/JokeComponent";
import FilmQuoteComponent from "../Quote/FilmQuoteComponent";
import StickyNoteComponent from "../StickyNote/StickyNoteComponent";
import BikeBuilderComponent from "../Bike/BikeBuilderComponent";
import Logger from "../Logger";

const BACK_END_API = "http://localhost:8088/demo/Test/";
const pagesRequireBackend = ["/Notes", "/Bikes"];
function App() {
  const [backendOn, setBackendOn] = useState(false);
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
      console.log("Back-End ON!!!");
    } catch (err) {
      setBackendOn(false);
      console.log("Back-End not on!");
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

  return (
    <React.StrictMode>
      <Routes>
        <Route
          index
          element={
            <PageLayout backendOn={backendOn}>
              <HomePage />
            </PageLayout>
          }
        />
        <Route
          path="/Jokes"
          element={
            <PageLayout backendOn={backendOn}>
              <JokeComponent />
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
              <StickyNoteComponent />
            </PageLayout>
          }
        />
        <Route
          path="/Bikes"
          element={
            <PageLayout backendOn={backendOn}>
              <BikeBuilderComponent />
            </PageLayout>
          }
        />
      </Routes>
    </React.StrictMode>
  );
}

export default App;
