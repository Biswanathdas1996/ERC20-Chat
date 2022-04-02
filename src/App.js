import "./App.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import Registration from "./components/Registration";
import Chat from "./components/Chat";
import NavigationBar from "./components/NavigationBar";
import UserList from "./components/UserList";
import Timeline from "./components/Timeline";
import Mint from "./components/NFT/Mint";
import ListNft from "./components/NFT/ListNft";
import MyNft from "./components/NFT/MyNft";
import NftDetails from "./components/NFT/NftDetails";
import Error401Page from "./components/Errors/401";

export const AccountContest = React.createContext("light");

const isEthEnebled = window?.ethereum?.request({
  method: "eth_requestAccounts",
});

const App = () => {
  if (isEthEnebled) {
    return (
      <>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Timeline />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/nft-mint" element={<Mint />} />
          <Route path="/nft-market" element={<ListNft />} />
          <Route path="/my-nft" element={<MyNft />} />
          <Route path="/nft-details/:id" element={<NftDetails />} />
        </Routes>
      </>
    );
  } else {
    return <Error401Page />;
  }
};
export default App;
