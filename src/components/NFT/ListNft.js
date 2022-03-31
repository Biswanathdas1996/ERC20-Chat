import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Card, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import { _account } from "../../ABI-connect/NFT-ABI/connect";
import PostCard from "../shared/NftCard";

const useStyles = makeStyles(({ palette, ...theme }) => ({
  cardHolder: {
    background: "#f3f3f4",
    overflow: "auto",
  },
}));

const VendorSchema = Yup.object().shape({
  text: Yup.string().required("Text is required"),
});

const Timeline = () => {
  const classes = useStyles();

  const [nft, setNft] = useState(null);

  useEffect(() => {
    fetchAllPosts();
  }, []);

  async function fetchAllPosts() {
    const account = await _account();
    const options = { method: "GET" };

    fetch(
      `https://testnets-api.opensea.io/api/v1/assets?owner=${account}&order_direction=desc`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setNft(response);
      })
      .catch((err) => console.error(err));
  }

  return (
    <>
      <div className={classes.cardHolder}>
        <Grid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          style={{ padding: 20 }}
        >
          {nft?.assets?.map((data, index) => {
            return (
              <Grid item xs={12} sm={12} md={3} lg={3} key={index + "_nft"}>
                <PostCard data={data} />
              </Grid>
            );
          })}
        </Grid>
      </div>
    </>
  );
};
export default Timeline;
