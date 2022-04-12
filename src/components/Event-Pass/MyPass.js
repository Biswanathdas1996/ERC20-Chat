import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import { _fetch, _account } from "../../ABI-connect/Event-Entry-Pass/connect";
import NftCard from "../shared/EventPass";
const MyPass = () => {
  const [token, setToken] = useState([]);
  const [baseExtention, setBaseExtention] = useState(null);
  const [symbol, setSymbol] = useState(null);
  const [cost, setCost] = useState(null);
  useEffect(() => {
    fetchAllPosts();
  }, []);

  async function fetchAllPosts() {
    const symbol = await _fetch("symbol");
    setSymbol(symbol);
    const cost = await _fetch("cost");
    setCost(cost);
    const owner = await _account();
    const getAllToken = await _fetch("walletOfOwner", owner);
    setToken(getAllToken);
    const getBaseExtention = await _fetch("baseExtension");

    setBaseExtention(getBaseExtention);
  }

  return (
    <>
      <div>
        <Grid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          style={{ padding: 20 }}
        >
          {token?.map((data, index) => {
            return (
              <Grid item xs={12} sm={12} md={3} lg={3} key={index + "_nft"}>
                {baseExtention && (
                  <NftCard
                    data={data}
                    baseExtention={baseExtention}
                    symbol={symbol}
                    cost={cost}
                  />
                )}
              </Grid>
            );
          })}
        </Grid>
      </div>
    </>
  );
};
export default MyPass;
