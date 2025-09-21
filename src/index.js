import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { makeServer } from "./services/mirageServer";

if (
  process.env.NODE_ENV === "development" ||
  process.env.NODE_ENV === "production"
) {
  makeServer({ environment: process.env.NODE_ENV });
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
