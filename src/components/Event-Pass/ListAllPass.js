import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import { _fetch } from "../../ABI-connect/Event-Entry-Pass/connect";
import EventPass from "../shared/EventPass";
import Loader from "../shared/Loader";
import NoData from "../shared/NoData";

const ListAllPass = () => {
  const [token, setToken] = useState([]);
  const [symbol, setSymbol] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllPosts();
  }, []);

  async function fetchAllPosts() {
    setLoading(true);
    const symbol = await _fetch("symbol");
    setSymbol(symbol);
    const owner = await _fetch("owner");
    const getAllToken = await _fetch("walletOfOwner", owner);
    setToken(getAllToken);
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
                <Grid item xs={12} sm={12} md={3} lg={3} key={index + "_nft"}>
                  <EventPass data={data} symbol={symbol} />
                </Grid>
              );
            })
          ) : (
            <Grid item xs={12} sm={12} md={3} lg={3} key={1}>
              <NoData text="No tickets found" />
            </Grid>
          )}
        </Grid>
      )}
    </>
  );
};
export default ListAllPass;
