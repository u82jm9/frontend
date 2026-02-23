import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import axios from "axios";

// Mock axios
jest.mock("axios");

// Mock PageLayout so we can inspect what it renders
jest.mock("./PageLayout", () => ({ backendOn, children }) => (
  <div>
    <div data-testid="backend-status">{backendOn ? "ON" : "OFF"}</div>
    {children}
  </div>
));

// Mock navigate so redirects don't break tests
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("App Landing Page", () => {
  test("calls checkBackend() on load and updates UI when backend is ON", async () => {
    // Arrange: mock backend returning TRUE
    axios.get.mockResolvedValueOnce({ data: true });

    // Act: render the app at the home page
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    // Assert: axios was called with the correct URL
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:8088/demo/Test/IsThisThingOn"
    );

    // Wait for state update
    await waitFor(() =>
      expect(screen.getByTestId("backend-status")).toHaveTextContent("ON")
    );
  });

  test("redirects away from backend-required pages when backend is OFF", async () => {
    // Arrange: backend returns FALSE
    axios.get.mockResolvedValueOnce({ data: false });

    render(
      <MemoryRouter initialEntries={["/Notes"]}>
        <App />
      </MemoryRouter>
    );

    // Wait for checkBackend to finish
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });
});
