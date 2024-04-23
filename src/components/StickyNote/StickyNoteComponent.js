import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import axios from "axios";
import dragonBallGif from "../../gifs/dragon_ball_form.gif";
import StickyNoteForm from "./StickyNoteForm";
import StickyNoteCard from "./StickyNoteCard";
import Logger from "../Logger";

const STICKY_NOTE_API_URL = "http://localhost:8088/demo/StickyNotes/";
function StickyNoteComponent(backendOn) {
  const [stickyNotes, setStickyNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    getStickyNotes();
  }, [backendOn]);

  async function getStickyNotes() {
    Logger.infoLog("Getting all Sticky Notes!");
    try {
      let r = await axios.get(STICKY_NOTE_API_URL + "GetAll");
      Logger.warnLog("Sticky Notes returned: " + r.data);
      setStickyNotes(r.data);
    } catch (err) {
      Logger.errorLog(err);
    }
  }

  async function editStickyNote(note) {
    Logger.infoLog("Editing Sticky note");
    try {
      await axios.post(STICKY_NOTE_API_URL + "EditNote", {
        stickyNoteId: note.stickyNoteId,
        title: note.title,
        messageMap: note.messageMap,
        complete: note.complete,
      });
      getStickyNotes();
    } catch (err) {
      Logger.errorLog(err);
    }
  }

  async function deleteStickyNote(note) {
    Logger.infoLog("Deleting note!!");
    try {
      await axios.delete(
        STICKY_NOTE_API_URL + "DeleteNote/" + note.stickyNoteId
      );
      getStickyNotes();
    } catch (err) {
      Logger.errorLog(err);
    }
  }

  async function deleteAllNotes() {
    Logger.infoLog("Deleting all notes!!!");
    Logger.errorLog("Deleting all notes!!!");
    try {
      await axios.delete(STICKY_NOTE_API_URL + "DeleteAllNotes");
      getStickyNotes();
    } catch (err) {
      Logger.errorLog(err);
    }
  }

  async function createNewNote(data) {
    setIsLoading(true);
    setShowForm(false);
    Logger.infoLog("Creating new note!!");
    try {
      await axios.post(STICKY_NOTE_API_URL + "AddNote", {
        noteTitle: data.title,
        noteMessage: data.message,
        noteComplete: false,
      });
      getStickyNotes();
    } catch (err) {
      Logger.errorLog(err);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  }

  const showAlertMessage = (message) => {
    setShowAlert(true);
    setAlertMessage(message);
    setTimeout(() => {
      setShowAlert(false);
      setAlertMessage("");
    }, 2000);
  };

  return (
    <>
      {isLoading && (
        <div className="loading-img-container">
          <img src={dragonBallGif} alt="Sweet leveling up gif!" />
        </div>
      )}
      <h1>Sticky Notes!</h1>
      <div className={isLoading ? "dark" : "light"}>
        <div>
          <Button
            variant="contained"
            onClick={() => {
              setShowForm(true);
            }}
          >
            Create Note
          </Button>
          <Button variant="contained" onClick={() => deleteAllNotes()}>
            Delete All
          </Button>
        </div>
        {showAlert ? (
          <div className="alert">
            <h1>{alertMessage}</h1>
            <Button
              className="dismiss-button"
              onClick={() => setShowAlert(false)}
            >
              X
            </Button>
          </div>
        ) : null}
        {showForm ? (
          <StickyNoteForm addNote={createNewNote} />
        ) : (
          <div className="note-component">
            {stickyNotes.map((note, i) => (
              <StickyNoteCard
                deleteNote={deleteStickyNote}
                updateNote={editStickyNote}
                note={note}
                key={i}
                showAlert={showAlertMessage}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default StickyNoteComponent;
