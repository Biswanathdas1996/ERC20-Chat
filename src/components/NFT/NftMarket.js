import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import { _fetch } from "../../ABI-connect/NFT-ABI/connect";
import CurrentNFTCard from "../shared/CurrentNFTCard";
import Loader from "../shared/Loader";

const NftMarket = () => {
  const [token, setToken] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchAllPosts();
  }, []);

  async function fetchAllPosts() {
    setLoading(true);
    const getAllToken = await _fetch("getToken");
    setLoading(false);
    setToken(getAllToken);
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
          style={{ padding: 10 }}
        >
          {token?.map((data, index) => {
            return (
              <Grid item xs={12} sm={12} md={3} lg={3} key={index + "_nft"}>
                <CurrentNFTCard data={data} fetchAllPosts={fetchAllPosts} />
              </Grid>
            );
          })}
          {token?.length === 0 && "No NFT cards found"}
        </Grid>
      )}
    </>
  );
};
export default NftMarket;