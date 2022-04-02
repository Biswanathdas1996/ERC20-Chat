import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@mui/material";
import { _fetch, _account } from "../../ABI-connect/NFT-ABI/connect";
import CurrentNFTCard from "../shared/CurrentNFTCard";

const useStyles = makeStyles(({ palette, ...theme }) => ({
  cardHolder: {
    background: "#f3f3f4",
    overflow: "auto",
  },
}));

const Timeline = () => {
  const classes = useStyles();
  const [token, setToken] = useState([]);
  const [counter, setCounter] = useState(0);
  const [account, setAccount] = useState(null);
  useEffect(() => {
    fetchAllPosts();
  }, []);

  async function fetchAllPosts() {
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
  }

  console.log("token", token);
  return (
    <>
      <div className={classes.cardHolder}>
        <Grid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          style={{ padding: 20 }}
        >
          {token?.map((data, index) => {
            return (
              <Grid item xs={12} sm={12} md={3} lg={3} key={index + "_nft"}>
                <CurrentNFTCard data={data} />
              </Grid>
            );
          })}
        </Grid>
      </div>
    </>
  );
};
export default Timeline;
