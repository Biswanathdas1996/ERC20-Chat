import "./App.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "@mui/icons-material/Home";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import Registration from "./components/Registration";
import Chat from "./components/Chat";
import UserList from "./components/UserList";

export const AccountContest = React.createContext("light");

const App = () => {
  const account = 1;
  return (
    <AccountContest.Provider value={account}>
      <AppBar
        position="relative"
        style={{ backgroundColor: "#d25304", color: "#fff" }}
      >
        <Toolbar>
          <Link to="/" style={{ textDecoration: "none" }}>
            <Home sx={{ mr: 2 }} style={{ color: "#fff" }} />
          </Link>
          <Typography variant="h6" color="inherit" noWrap>
            Web 3.0
          </Typography>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/chat" element={<Chat />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/users" element={<UserList />} />
      </Routes>
      <div></div>
    </AccountContest.Provider>
  );
};
export default App;
