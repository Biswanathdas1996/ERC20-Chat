import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import {
  _fetch,
  _account,
  _paid_transction,
} from "../../ABI-connect/Event-Entry-Pass/connect";
import TransctionModal from "../shared/TransctionModal";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const VendorSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
});

const NftCard = ({ data, baseExtention, symbol, cost }) => {
  const [baseExtentionData, setBaseExtentionData] = useState(null);
  const [owner, setOwner] = useState(null);
  const [start, setStart] = useState(false);
  const [account, setAccount] = React.useState(null);
  const [response, setResponse] = useState(null);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const account = await _account();

    setAccount(account);

    await fetch(baseExtention)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setBaseExtentionData(data);
      });

    const getOwner = await _fetch("ownerOf", data);
    setOwner(getOwner);
  };

  const buyNow = async () => {
    setStart(true);
    const responseData = await _paid_transction(cost, "transferNFT", data);
    setResponse(responseData);
    fetchData();
  };

  const modalClose = () => {
    setStart(false);
    setResponse(null);
  };

  return (
    <>
      {start && <TransctionModal response={response} modalClose={modalClose} />}

      <Card style={{ marginTop: 20 }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "rgb(124, 0, 124)" }} aria-label="recipe">
              {data}
            </Avatar>
          }
          title={baseExtentionData?.name}
          subheader={"#" + data + " - " + symbol}
        />

        <CardMedia
          component="img"
          image={baseExtentionData?.image}
          alt="Paella dish"
          height="200"
          weidth="300"
        />

        <CardContent>
          <Typography variant="body2" color="text.secondary">
            <h5 style={{ fontSize: 10 }}>
              <b>Owner: </b>
              {owner}
            </h5>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <b style={{ fontSize: 20 }}>{cost / 1000000000000000000} ETH</b>
          </Typography>
        </CardContent>
        <CardActions style={{ padding: 20 }} disableSpacing>
          {owner !== account && (
            <Button
              variant="contained"
              style={{ width: "100% !important" }}
              className="btn btn-default btn-primary"
              onClick={() => buyNow()}
            >
              Buy Now
            </Button>
          )}
        </CardActions>
      </Card>
    </>
  );
};
export default NftCard;
