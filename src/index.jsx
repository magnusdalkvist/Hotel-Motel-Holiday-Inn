import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { createClient } from "@supabase/supabase-js";
import { Provider } from "react-supabase";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout";
import Home from "./pages/Home";
import Account from "./pages/Account";
import { AuthProvider } from "./hooks/Auth";
import Login from "./pages/Login";
import { ProfilesProvider } from "./hooks/Profiles";

const client = createClient(
  "https://fxrkypplzrbtfuemvgzn.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4cmt5cHBsenJidGZ1ZW12Z3puIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODY3NzU2MzAsImV4cCI6MjAwMjM1MTYzMH0.0vM0YaDd9Pt--NDrdOblMPP1HkBp6FOfyk8YtAA1YQg"
);

export default function App() {
  return (
    <Provider value={client}>
      <BrowserRouter>
        <AuthProvider>
          <ProfilesProvider>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="/account" element={<Account />} />
                <Route path="/login" element={<Login />} />
              </Route>
            </Routes>
          </ProfilesProvider>
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
