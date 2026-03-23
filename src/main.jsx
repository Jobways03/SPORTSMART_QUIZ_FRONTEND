import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

import { UserProvider } from "./context/UserContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import ErrorBoundary from "./components/ErrorBoundary";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <UserProvider>
          <AdminAuthProvider>
            <App />
          </AdminAuthProvider>
        </UserProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);
