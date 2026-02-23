# Nonsense (frontend)

A small React demo app with a collection of independent UI widgets and mini-apps. This repository contains the frontend only and is structured as a playground for interactive components such as a bike builder, simple games, quote viewers, a sticky-note tool, weather display, and a few Google and utility helpers.

This README focuses on what the project does and where to find key functionality — not the Create React App boilerplate.

---

## High-level overview

The app is a single-page React application composed of many small components and pages. Each area demonstrates simple UI, state handling, and file-based assets (images/gifs). The goal is an approachable collection of useful and fun micro-apps you can explore, reuse, or extend. Some of the pages are built to run without the Back-End, meaning that the App stays live, with limited functionality, if the Back-End fails somehow.

Main features:

- Bike Builder: construct a bike from parts, preview images for parts and wheels, and inspect a parts table. 
- Games: small browser games including TicTacToe and a Word Search. 
- Quotes: view film quotes and lists of quotes (sample data in `quotes.json`).
- Weather: a weather display that uses GIFs and images to reflect conditions.
- Jokes: display jokes and a simple joke component.
- Google Helpers: small wrappers for searching and calendar helpers (UI-only in this repo).
- Recipes: simple display component for web based Recipes.

The site also includes a navigation bar and page layout components to route between the above features.
A dark mode built in that changes the colour scheme across all the pages.
A constant check on the Back-End to ensure that it is up and running. If the Back-End is not present then the relevant Pages are removed.

---

## Where to find things (important files & folders)

- `src/index.js` — app entry.
- `src/Page/App.js` — top-level app component / routes.
- `src/Page/HomePage.js` — central hub / landing page for the collection.
- `src/components/NavBar/NavBar.js` — global navigation.

Feature-specific folders inside `src/components/`:
- `Bike/` — `BikeBuilderComponent.js`, `BikeMenuComponent.js`, `BikePartsTable.js`, `DisplayBikeImages.js` (bike builder UI and assets in `src/images`).
- `Games/` — `GamesComponent.js`, `TicTacToe.js`, `WordSearch.js`.
- `Quote/` — `DisplayListsOfQuotes.js`, `FilmQuoteComponent.js`, `QuoteDisplayer.js`, `quotes.json`.
- `Weather/` — weather display components and `src/gifs/` for condition animations.
- `StickyNote/` — `StickyNoteComponent.js`, `StickyNoteForm.js`, `StickyNoteCard.js`.
- `Joke/` — `JokeComponent.js`, `DisplayJoke.js`.
- `Google/` — `GoogleSearch.js`, `GoogleCalendar.js` (UI helpers).
- `BankHoliday/`, `Recipe/` — small demo components showing lists/details.

Assets:
- `src/images/` — bike parts and generic UI images.
- `src/gifs/` — weather-related animated GIFs.

Styles:
- `src/css/` — app-wide and feature-specific CSS files (e.g. `App.css`, `Bike.css`).

---

## Running the app (developer quick-start)

1. Install dependencies:

   npm install

2. Start the development server:

   npm start

3. Run tests:

   npm test

Notes: this project was created with Create React App, so standard CRA scripts work as expected.

---

## Usage highlights / Where to look for functionality

- Bike Builder: open the Bike page from the NavBar. There you can choose parts, see a parts table, and view assembled-bike images driven by your selections. Images live in `src/images` and missing parts fall back to a `no_image.png` placeholder. All parts are retrieved using web scrapers in the back end, pricing reflects real world prices, or shows the date the price was last updated.

- Games: open the Games page. `TicTacToe.js` contains a compact, interactive tic-tac-toe implementation; `WordSearch.js` demonstrates a simple word search UI. Additional word Searches can be built by the user.

- Quotes: the Quote page reads sample quotes from `src/components/Quote/quotes.json` and presents them via `QuoteDisplayer.js` and `FilmQuoteComponent.js`.

- Weather: the Weather component maps condition names to GIFs in `src/gifs` and displays a visual summary. This is UI-only and is tranlated from an external free-to-use weather API.

- Sticky Notes: create, edit, and display sticky notes with a small form and card UI.

- Recipe: Enter a Recipe URL and the Back-End will strip out the excess information from the webpage; leaving only the ingredients and method steps required.

- Google utilities: UI for search and calendar helpers — these are currently client-side helpers and not integrated with Google APIs in this repo.

---

## Development notes and extension points

- Routing / Page Layout: `src/Page/PageLayout.js` and `src/Page/App.js` orchestrate the main layout and route-to-component mapping. Adding a new page is typically adding a new component and a route.

- State: many components use local state (React useState). If you plan to add cross-cutting state, consider adding a lightweight store (Context or Redux).

- Images & assets: bike images are named with numeric prefixes and part names (e.g., `1_chain.png`, `9_STI.png`). The components expect those naming conventions; adding new parts requires adding images and updating the mapping logic in `BikeBuilderComponent.js` or `DisplayBikeImages.js`.

---

## Tests

Currently the testing is all completed in the Back-End app.

---

## License

This project does not currently include a license file. Add a `LICENSE` or let me know which license to use and I can add it.
It is completely self built and not licenses were purchased as part of the development.

---

## Future Improvements

- Add testing to cover non-Backe-End functionality.
- Add API testing to check data shapes and response handling.
- Further investigate Google Calendar functionality, using their externally exposed API's
- Refactor code to increase readability, stability and efficiency.
- Add images and gifs as demos to this readme file.