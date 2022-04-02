import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Grid } from "@mui/material";
import { _fetch } from "../../ABI-connect/NFT-ABI/connect";
import CurrentNFTCard from "../shared/CurrentNFTCard";

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
  const [token, setToken] = useState([]);

  useEffect(() => {
    fetchAllPosts();
  }, []);

  async function fetchAllPosts() {
    const getAllToken = await _fetch("getToken");
    setToken(getAllToken);
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
