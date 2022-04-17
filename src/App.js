import "./App.css";
import React from "react";
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

export const AccountContest = React.createContext("light");

const isEthEnebled = window?.ethereum?.request({
  method: "eth_requestAccounts",
});

const App = () => {
  if (isEthEnebled) {
    return (
      <>
        {/* <NavigationBar /> */}
        <Layout
          body={() => {
            return (
              <Routes>
                <Route path="/" element={<Timeline />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/register" element={<Registration />} />
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
              </Routes>
            );
          }}
        />
      </>
    );
  } else {
    return <Error401Page />;
  }
};
export default App;
