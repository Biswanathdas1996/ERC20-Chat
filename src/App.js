import "./App.css";
import React, { useState, useEffect, createContext } from "react";
import { Routes, Route } from "react-router-dom";
import Registration from "./components/Registration";
import Chat from "./components/Chat";
import NavigationBar from "./components/NavigationBar";
import UserList from "./components/UserList";
import Timeline from "./components/Timeline";
import Mint from "./components/NFT/Mint";
import NftMarket from "./components/NFT/NftMarket";
import MyNft from "./components/NFT/MyNft";
import NftDetails from "./components/NFT/NftDetails";
import Error401Page from "./components/Errors/401";
import CreatePass from "./components/Event-Pass/CreatePass";
import ListAllPass from "./components/Event-Pass/ListAllPass";
import MyPass from "./components/Event-Pass/MyPass";
import CreateVoiceFile from "./components/VoiceFile/Create";
import Layout from "./components/Layout";
import Users from "./components/Encrtption/Users";
import ABIDocumentation from "./pages/ABIDocumentation";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { _fetch, _account } from "./ABI-connect/MessangerABI/connect";

export const AccountContest = React.createContext("light");

// const isEthEnebled = window?.ethereum?.request({
//   method: "eth_requestAccounts",
// });

export const AccountContext = createContext();

const App = () => {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  async function fetchUserData() {
    const account = await _account();
    if (account) {
      const user = await _fetch("users", account);
      setAccount(user);
    } else {
      setAccount(null);
    }
  }

  return (
    <>
      {/* <NavigationBar /> */}
      <AccountContext.Provider value={{ account, fetchUserData }}>
        <Layout
          body={() => {
            return (
              <Routes>
                <Route path="/" element={<Timeline />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/users" element={<UserList />} />
                <Route path="/nft-mint" element={<Mint />} />
                <Route path="/nft-market" element={<NftMarket />} />
                <Route path="/my-nft" element={<MyNft />} />
                <Route path="/nft-details/:id" element={<NftDetails />} />

                <Route path="/event/create" element={<CreatePass />} />
                <Route path="/event/all" element={<ListAllPass />} />
                <Route path="/event/my-tickets" element={<MyPass />} />

                <Route path="/voice" element={<CreateVoiceFile />} />

                <Route path="/encrypt/users" element={<Users />} />

                <Route path="/doc" element={<ABIDocumentation />} />
              </Routes>
            );
          }}
        />
      </AccountContext.Provider>
    </>
  );
};
export default App;
