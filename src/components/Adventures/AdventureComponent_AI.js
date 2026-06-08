import { useState, useEffect, useRef, useCallback } from "react";
import Logger from "../Logger";
import { Filemanager, Willow } from "@svar-ui/react-filemanager";
import "@svar-ui/react-filemanager/all.css";
import OutsideClickHandler from "react-outside-click-handler";

// --- IndexedDB helpers for persisting FileSystemDirectoryHandles ---
const IDB_NAME = "adventure-tiles-db";
const IDB_STORE = "handles";

function openIDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = (e) => e.target.result.createObjectStore(IDB_STORE);
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = (e) => reject(e.target.error);
  });
}

async function idbGet(key) {
  const db = await openIDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(IDB_STORE, "readonly").objectStore(IDB_STORE).get(key);
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => reject(req.error);
  });
}

async function idbSet(key, value) {
  const db = await openIDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(IDB_STORE, "readwrite").objectStore(IDB_STORE).put(value, key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// --- File System Access API helpers ---

// In-memory cache for the current session
const dirHandleCache = {};

async function getOrPickRootHandle() {
  // 1. Already in memory this session
  if (dirHandleCache["root"]) return dirHandleCache["root"];

  // 2. Try to restore a previously saved handle from IndexedDB
  const saved = await idbGet("root");
  if (saved) {
    // Check if permission is still active — avoids re-prompting the picker
    const perm = await saved.queryPermission({ mode: "readwrite" });
    if (perm === "granted") {
      dirHandleCache["root"] = saved;
      return saved;
    }
    // Permission lapsed — ask the browser to re-grant it (small prompt, not a full picker)
    const newPerm = await saved.requestPermission({ mode: "readwrite" });
    if (newPerm === "granted") {
      dirHandleCache["root"] = saved;
      return saved;
    }
  }

  // 3. No saved handle (or permission permanently denied) — show the full directory picker
  const handle = await window.showDirectoryPicker({ mode: "readwrite" });
  dirHandleCache["root"] = handle;
  await idbSet("root", handle); // persist for next load
  return handle;
}

async function getOrCreateTileHandle(tileId) {
  if (dirHandleCache[tileId]) return dirHandleCache[tileId];
  const root = await getOrPickRootHandle();
  // Creates the subfolder if it doesn't exist
  const tileHandle = await root.getDirectoryHandle(tileId, { create: true });
  dirHandleCache[tileId] = tileHandle;
  return tileHandle;
}

async function readDirectoryIntoData(dirHandle, parentPath) {
  const entities = [];
  for await (const [name, handle] of dirHandle.entries()) {
    const id = `${parentPath}/${name}`;
    if (handle.kind === "directory") {
      entities.push({ id, type: "folder" });
      // Recursively read subdirectories
      const children = await readDirectoryIntoData(handle, id);
      entities.push(...children);
    } else {
      const file = await handle.getFile();
      entities.push({ id, type: "file", size: file.size, date: new Date(file.lastModified) });
    }
  }
  return entities;
}

// ---

function AdventureComponent({ alertMethod }) {
  const [showFileManager, setShowFileManager] = useState(false);
  const [grid, setGrid] = useState([]);
  const [fileData, setFileData] = useState([]);
  const [currentTileId, setCurrentTileId] = useState(null);
  const [error, setError] = useState(null);
  const tileHandleRef = useRef(null);
  const numberOfLines = 9;
  const isFSASupported = typeof window !== "undefined" && "showDirectoryPicker" in window;

  useEffect(() => {
    Logger.infoLog("I'm on the Adventure Component Page!");
    createGrid();
  }, []);

  function createGrid() {
    const tempGrid = Array.from({ length: numberOfLines }, () =>
      Array(numberOfLines).fill(""),
    );
    setGrid(tempGrid);
  }

  async function tileClicked(tile, line) {
    const tileId = `${line}${tile}`;
    console.log("Tile " + tileId + " Clicked!");
    setError(null);

    if (!isFSASupported) {
      setError("Your browser does not support the File System Access API. Please use Chrome or Edge.");
      return;
    }

    try {
      const tileHandle = await getOrCreateTileHandle(tileId);
      tileHandleRef.current = tileHandle;

      const tilePath = `/${tileId}`;
      const children = await readDirectoryIntoData(tileHandle, tilePath);
      const data = [{ id: tilePath, type: "folder" }, ...children];

      setFileData(data);
      setCurrentTileId(tileId);
      setShowFileManager(true);
    } catch (e) {
      if (e.name !== "AbortError") {
        console.error(e);
        setError("Could not open directory: " + e.message);
      }
    }
  }

  const handleInit = useCallback((api) => {
    // When a file is created via the FM UI, create it on disk too
    api.on("create-file", async ({ file, parent, newId }) => {
      try {
        const tileHandle = tileHandleRef.current;
        if (!tileHandle || !file.file) return;
        // Resolve the parent directory handle relative to tile root
        const parts = parent.split("/").filter(Boolean).slice(1); // strip tileId prefix
        let dirHandle = tileHandle;
        for (const part of parts) {
          dirHandle = await dirHandle.getDirectoryHandle(part, { create: true });
        }
        if (file.type === "folder") {
          await dirHandle.getDirectoryHandle(file.name, { create: true });
        } else {
          const fileHandle = await dirHandle.getFileHandle(file.name, { create: true });
          const writable = await fileHandle.createWritable();
          await writable.write(file.file);
          await writable.close();
        }
      } catch (e) {
        console.error("Failed to write file to disk:", e);
      }
    });

    // When files are deleted, remove them from disk
    api.on("delete-files", async ({ ids }) => {
      try {
        const tileHandle = tileHandleRef.current;
        if (!tileHandle) return;
        for (const id of ids) {
          const parts = id.split("/").filter(Boolean).slice(1);
          const name = parts.pop();
          let dirHandle = tileHandle;
          for (const part of parts) {
            dirHandle = await dirHandle.getDirectoryHandle(part);
          }
          await dirHandle.removeEntry(name, { recursive: true });
        }
      } catch (e) {
        console.error("Failed to delete from disk:", e);
      }
    });
  }, []);

  const panels = currentTileId ? [{ path: `/${currentTileId}` }] : undefined;

  return (
    <>
      <h1>Adventures!</h1>
      <h2>
        Click a tile to open its local directory. You will be asked to choose
        your root "Directory" folder the first time.
      </h2>

      {error && (
        <p style={{ color: "red" }}>{error}</p>
      )}

      {showFileManager ? (
        <OutsideClickHandler onOutsideClick={() => setShowFileManager(false)}>
          <h2>Tile {currentTileId}</h2>
          <Willow>
            <div style={{ height: "600px", width: "900px", maxWidth: "100%", textAlign: "left" }}>
              <Filemanager
                key={currentTileId}
                mode="cards"
                data={fileData}
                panels={panels}
                init={handleInit}
              />
            </div>
          </Willow>
        </OutsideClickHandler>
      ) : (
        <div className="game-board">
          {grid.map((line, lineIndex) => (
            <div className="board-line" key={lineIndex}>
              {line.map((tile, tileIndex) => (
                <div
                  onClick={() => tileClicked(tileIndex, lineIndex)}
                  className="wordsearch-box"
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
