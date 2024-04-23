import React, { useState } from "react";
import Logger from "../Logger";
import { Box, Button, FormControl, Input, InputLabel } from "@mui/material";

const StickyNoteForm = ({ addNote }) => {
  const [data, setData] = useState({
    title: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    submitForm();
  };

  function handle(e) {
    const newData = { ...data };
    newData[e.target.id] = e.target.value;
    setData(newData);
  }

  function submitForm() {
    Logger.warnLog("Submitting Note Form: " + data);
    addNote(data);
    setData({ title: "", message: "" });
  }

  return (
    <div className="component">
      <div className="form">
        <Box component="form" className="card" onSubmit={handleSubmit}>
          <FormControl className="form-field">
            <InputLabel>Title</InputLabel>
            <Input
              autoFocus={true}
              type="text"
              id="title"
              value={data.title}
              placeholder="Title"
              onChange={(e) => handle(e)}
            />
          </FormControl>
          <FormControl className="form-field">
            <InputLabel>Message</InputLabel>
            <Input
              type="text"
              id="message"
              placeholder="Message..."
              onChange={(e) => handle(e)}
            />
          </FormControl>
          <Button variant="contained" type="submit">
            Add Note!
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default StickyNoteForm;
