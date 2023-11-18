import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import Layout from "./Layout";
import WriteBox from "./WriteBox";
import Empty from "./Empty";
import reportWebVitals from "./reportWebVitals";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import React, { useState } from "react";

const AppWrapper = () => {
  const [profile, setProfile] = useState(null);

  const onLogin = (userProfile) => {
    setProfile(userProfile);
    renderApp();
  };

  const logOut = () => {
    setProfile(null);
    window.location.reload();
  };

  const renderApp = () => {
    ReactDOM.render(
      <React.StrictMode>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout profile={profile} logOut={logOut} />}>
              <Route path="/" element={<Empty />} />
              <Route path="/notes" element={<Empty />} />
              <Route
                path="/notes/:noteId/edit"
                element={<WriteBox edit={true} />}
              />
              <Route
                path="/notes/:noteId"
                element={<WriteBox edit={false} />}
              />
              {/* any other path */}
              <Route path="*" element={<Empty />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </React.StrictMode>,
      document.getElementById("root")
    );
  };

  return (
    <GoogleOAuthProvider
      clientId="419857857588-j704tlaj6k71soi1044mt3j4hoijgjug.apps.googleusercontent.com">
      <App onLogin={onLogin} />
    </GoogleOAuthProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<AppWrapper />);
reportWebVitals();
