import "./App.css";
import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "@mui/icons-material/Home";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { _fetch, _account } from "./ABI-connect/MessangerABI/connect";
import Registration from "./components/Registration";
import Chat from "./components/Chat";

import NavigationBar from "./components/NavigationBar";
import UserList from "./components/UserList";
import Timeline from "./components/Timeline";

export const AccountContest = React.createContext("light");

const App = () => {
  const [account, setAccount] = React.useState(null);
  const [accountBalace, setAccountBalace] = React.useState(null);

  async function fetchUserData() {
    const account = await _account();
    const accountBalace = await _fetch("balanceOf", account);
    setAccountBalace(accountBalace);
    setAccount(account);
  }

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <AccountContest.Provider value={account}>
      <NavigationBar accountBalace={accountBalace} account={account} />
      <Routes>
        <Route path="/" element={<Timeline />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/users" element={<UserList />} />
      </Routes>
      <div></div>
    </AccountContest.Provider>
  );
};
export default App;
