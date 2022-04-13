import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import { _fetch, _account } from "../../ABI-connect/NFT-ABI/connect";
import CurrentNFTCard from "../shared/CurrentNFTCard";
import Loader from "../shared/Loader";

const Timeline = () => {
  const [token, setToken] = useState([]);
  const [counter, setCounter] = useState(0);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchAllPosts();
  }, []);

  async function fetchAllPosts() {
    setLoading(true);
    const getAllToken = await _fetch("getToken");
    const account = await _account();
    console.log(account);
    const tokenOwnedByMe = [];

    await getAllToken.map(async (tokenId) => {
      const owner = await _fetch("ownerOf", tokenId);
      if (account == owner) {
        tokenOwnedByMe.push(tokenId);
        console.log("tokenId", tokenId);
        setToken(tokenOwnedByMe);
      }
      setCounter((prev) => prev + 1);
    });
    setLoading(false);
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Grid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          style={{ padding: 20 }}
        >
          {token?.map((data, index) => {
            return (
              <Grid item xs={12} sm={12} md={3} lg={3} key={index + "_nfts"}>
                <CurrentNFTCard data={data} />
              </Grid>
            );
          })}
          {token?.length === 0 && (
            <Grid item xs={12} sm={12} md={3} lg={3} key="1">
              <h5>No NFT found</h5>
            </Grid>
          )}
        </Grid>
      )}
    </>
  );
};
export default Timeline;
