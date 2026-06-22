import { useState, useEffect } from "react";
import Logger from "../Logger";
import axios from "axios";
import { Button } from "@mui/material";
import OutsideClickHandler from "react-outside-click-handler";

const ADVENTURE_API_URL = "http://localhost:8088/demo/Test/";
function AdventureComponent({ backendOn, alertMethod }) {
  const [imageToDisplay, setImageToDisplay] = useState();
  const [showImageOnly, setShowImageOnly] = useState(false);
  const [displayFile, setDisplayFile] = useState([]);
  const [directoryFiles, setDirectoryFiles] = useState([]);
  const [directory, setDirectory] = useState("");
  const [tileId, setTileId] = useState("");
  const [showDragBox, setShowDragBox] = useState(false);
  const [dragEnter, setDragEnter] = useState(false);
  const [grid, setGrid] = useState([]);
  const numberOfLines = 9;
  const getMapping = directory + tileId;
  const MAX_SIZE = 1 * 1024 * 1024; // 1MB

  useEffect(() => {
    Logger.infoLog("I'm on the Adventure Component Page!");
    createGrid();
  }, []);

  useEffect(() => {
    if (showDragBox && tileId) {
      getFilesForTile();
      return;
    }

    if (!showDragBox) {
      setDirectoryFiles([]);
      setDisplayFile([]);
      setShowImageOnly(false);
    }
  }, [showDragBox, tileId]);

  useEffect(() => {
    if (directoryFiles.length > 0) {
      directoryFiles.forEach((f) => getFileToDisplay(f));
    }
  }, [directoryFiles]);

  function createGrid() {
    const tempGrid = Array.from({ length: numberOfLines }, () =>
      Array(numberOfLines).fill(""),
    );
    setGrid(tempGrid);
  }

  function tileClicked(tile, line) {
    const nextTileId = `${line}-${tile}`;
    setDirectory("rsr_2026/");
    setTileId(nextTileId);

    if (backendOn) {
      Logger.infoLog("Tile " + nextTileId + " Clicked!");
      setShowDragBox(true);
    } else {
      Logger.errorLog("Backend Off\nTile " + nextTileId + " Clicked!");
    }
  }

  async function getFilesForTile() {
    if (tileId === "" || tileId === null) {
      setDirectoryFiles([]);
      setDisplayFile([]);
      return;
    }
    try {
      let response = await axios.get(
        ADVENTURE_API_URL + "GetFilesFromDirectory/" + getMapping,
      );
      await setDirectoryFiles(response.data);
    } catch (e) {
      Logger.errorLog("Error retrieving files: " + e);
      setDirectoryFiles([]);
      setDisplayFile([]);
    }
  }

  async function getFileToDisplay(file) {
    const url =
      ADVENTURE_API_URL + "GetSpecificFile/" + getMapping + "/" + file;
    try {
      let response = await axios.get(url, {
        responseType: "blob",
      });
      const blobUrl = URL.createObjectURL(response.data);
      setDisplayFile((prev) => [...prev, blobUrl]);
    } catch (e) {
      Logger.errorLog("Error retrieving display file: " + e);
      setDisplayFile(null);
    }
  }

  function fileDrop(e) {
    handleBrowserDrag(e);
    sendFile(e.dataTransfer.files[0]);
    setDragEnter(false);
    setShowDragBox(false);
  }

  async function resizeImage(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const canvas = document.createElement("canvas");
        const { width, height } = img;

        const tryResize = (scale, quality) => {
          canvas.width = Math.round(width * scale);
          canvas.height = Math.round(height * scale);
          const ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Canvas toBlob failed"));
                return;
              }
              if (blob.size <= MAX_SIZE) {
                const resizedName = file.name.replace(/\.[^/.]+$/, ".jpg");
                resolve(new File([blob], resizedName, { type: "image/jpeg" }));
              } else if (quality > 0.2) {
                tryResize(scale, Math.round((quality - 0.1) * 10) / 10);
              } else if (scale > 0.2) {
                tryResize(Math.round((scale - 0.1) * 10) / 10, 0.9);
              } else {
                reject(new Error("Unable to resize image below 1MB"));
              }
            },
            "image/jpeg",
            quality,
          );
        };

        tryResize(1.0, 0.9);
      };

      img.onerror = () =>
        reject(new Error("Failed to load image for resizing"));
      img.src = objectUrl;
    });
  }

  async function sendFile(file) {
    let fileToUpload = file;
    if (file.size > MAX_SIZE) {
      alertMethod(
        "warning",
        `File is ${(file.size / 1024 / 1024).toFixed(2)}MB — attempting to resize...`,
      );
      Logger.warnLog(
        `File ${file.name} exceeds 1MB (${file.size} bytes), attempting resize.`,
      );
      try {
        fileToUpload = await resizeImage(file);
        alertMethod(
          "info",
          `Resized to ${(fileToUpload.size / 1024).toFixed(1)}KB — uploading...`,
        );
      } catch (err) {
        Logger.errorLog("Failed to resize image: " + err);
        alertMethod(
          "error",
          "File exceeds 1MB and could not be resized for upload.",
        );
        return;
      }
    }
    Logger.infoLog(
      "Sending file " + fileToUpload.name + " to backend for tile " + tileId,
    );
    const formData = new FormData();
    formData.append("file", fileToUpload);
    formData.append("tileName", directory + tileId);

    try {
      await axios.post(ADVENTURE_API_URL + "UploadFile", formData);
      setTileId("");
      alertMethod("success", "Successfully uploaded " + file.name);
    } catch (err) {
      Logger.errorLog("Error uploading file: " + err);
      alertMethod("error", "Failed to upload file.");
    }
  }

  function handleBrowserDrag(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  return (
    <>
      <h1>Adventures!</h1>
      <h2>
        Will code a backend to support this. Idea is to have an image over a
        grid, each tile on grid is linked to a separate directory in the back
        end to show photo, ideas from that area.
      </h2>

      {showDragBox ? (
        <div className="adventure-display">
          <OutsideClickHandler onOutsideClick={() => setShowDragBox(false)}>
            <h1>Drag Images here to Upload</h1>

            {showImageOnly ? (
              <div className = "adventure-image">
                <h1>Showing Image</h1>
                <img src={imageToDisplay} alt="I'm an image from the BE" />
              </div>
            ) : (
              <div
                className={`file-drag-box
                  ${dragEnter && "drag-enter"}`}
                onDragEnter={(e) => {
                  e.preventDefault();
                  setDragEnter(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setDragEnter(false);
                }}
                onDrop={(e) => fileDrop(e)}
                onDragOver={(e) => handleBrowserDrag(e)}
              >
                {directoryFiles.length > 0 ? (
                  <div>
                    <h2>{directoryFiles.length} files in this directory</h2>

                    {displayFile.map((file, index) => (
                      <div
                        key={index}
                        className="file-display-box hover"
                        onClick={() => {
                          setShowImageOnly(true);
                          setImageToDisplay(file);
                        }}
                      >
                        <img src={file} alt="I'm an image from the BE" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <h3>No files found for this tile yet.</h3>
                )}
              </div>
            )}

            <Button variant="contained" onClick={() => setShowDragBox(false)}>
              Hide
            </Button>
          </OutsideClickHandler>
        </ div>
      ) : (
        <div className="game-board">
          {grid.map((line, lineIndex) => (
            <div className="board-line" key={lineIndex}>
              {line.map((tile, tileIndex) => (
                <div
                  onClick={() => tileClicked(tileIndex, lineIndex)}
                  className={`wordsearch-box
                  ${backendOn && "hover"}
                  `}
                  key={lineIndex + "," + tileIndex}
                >
                  {lineIndex},{tileIndex}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
export default AdventureComponent;
