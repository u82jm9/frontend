import axios from "axios";

const LOGGER_API = "http://localhost:8088/demo/Test/LogThis";
const stamp = new Date().toISOString();
const Logger = {
  infoLog: async (m) => {
    const log = {
      level: "INFO",
      message: m,
      timeStamp: stamp,
    };
    try {
      await axios.post(LOGGER_API, log);
    } catch (err) {
      console.error(err);
    }
  },

  warnLog: async (m) => {
    const log = {
      level: "WARN",
      message: m,
      timeStamp: stamp,
    };
    try {
      logToLocalStorage(log);
    } catch (err) {
      console.error(err);
    }
  },

  errorLog: async (m) => {
    console.error(m);
    let log = {
      level: "ERROR",
      message: m,
      timeStamp: stamp,
    };
    try {
      await axios.post(LOGGER_API, log);
      logToLocalStorage(log);
    } catch (err) {
      console.error(err);
    }
  },
};

function logToLocalStorage(l) {
  const existingLogs = JSON.parse(localStorage.getItem("logs")) || [];
  const updatedLogs = [...existingLogs, l];
  localStorage.setItem("logs", JSON.stringify(updatedLogs));
}

export default Logger;
