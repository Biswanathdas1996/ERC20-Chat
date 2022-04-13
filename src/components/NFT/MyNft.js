import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import { _fetch, _account } from "../../ABI-connect/NFT-ABI/connect";
import CurrentNFTCard from "../shared/CurrentNFTCard";
import Loader from "../shared/Loader";
import NoData from "../shared/NoData";

const Timeline = () => {
  const [token, setToken] = useState([]);
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
          {token?.length !== 0 ? (
            token?.map((data, index) => {
              return (
                <Grid item xs={12} sm={12} md={3} lg={3} key={index + "_nfts"}>
                  <CurrentNFTCard data={data} />
                </Grid>
              );
            })
          ) : (
            <Grid item xs={12} sm={12} md={3} lg={3} key={1}>
              <NoData text="No NFT found" />
            </Grid>
          )}
        </Grid>
      )}
    </>
  );
};
export default Timeline;
