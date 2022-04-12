import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import DescriptionIcon from "@mui/icons-material/Description";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  _fetch,
  _account,
  _paid_transction,
} from "../../ABI-connect/NFT-ABI/connect";
import Address from "../../ABI-connect/NFT-ABI/Address.json";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import TransctionModal from "./TransctionModal";
import { useNavigate } from "react-router-dom";

export default function RecipeReviewCard({ data }) {
  const [nftData, setNftData] = useState(null);
  const [start, setStart] = useState(false);
  const [owner, setOwner] = useState(null);
  const [account, setAccount] = useState(null);
  const [price, setPrice] = useState(null);
  const [response, setResponse] = useState(null);
  let history = useNavigate();

  useEffect(() => {
    fetchAllPosts();
  }, []);

  async function fetchAllPosts() {
    const getAllTokenUri = await _fetch("tokenURI", data);
    const getOwner = await _fetch("ownerOf", data);
    setOwner(getOwner);
    const account = await _account();
    setAccount(account);
    const price = await _fetch("getNftPrice", data);
    setPrice(price);

    await fetch(getAllTokenUri)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setNftData(data);
      });
  }

  const buynow = async () => {
    console.log("-------price-->", price);
    setStart(true);
    const responseData = await _paid_transction(
      Number(price),
      "buyNft",
      owner,
      account,
      Number(data)
    );
    setResponse(responseData);
    history("/nft-market");
  };

  const modalClose = () => {
    setStart(false);
    setResponse(null);
  };

  if (nftData) {
    return (
      <>
        {start && (
          <TransctionModal response={response} modalClose={modalClose} />
        )}

        <Card style={{ marginTop: 20 }}>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: "rgb(124, 0, 124)" }} aria-label="recipe">
                R
              </Avatar>
            }
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            title={nftData?.name}
            subheader={"#" + data}
          />

          <CardMedia
            component="img"
            image={nftData?.image}
            alt="Paella dish"
            height="300"
            weidth="300"
          />

          <CardContent>
            <Typography variant="body2" color="text.secondary">
              <h5 style={{ fontSize: 10 }}>
                <b>Owner: </b>
                {owner}
              </h5>
            </Typography>
          </CardContent>
          <CardActions style={{ padding: 20 }} disableSpacing>
            <Link to={`/nft-details/${data}`}>
              <Button
                variant="contained"
                style={{ marginRight: 10 }}
                color="warning"
              >
                View
              </Button>
            </Link>

            {owner !== account && (
              <Button
                variant="contained"
                style={{ marginRight: 10 }}
                color="success"
                onClick={() => buynow()}
              >
                Buy Now
              </Button>
            )}

            <a
              href={`https://testnets.opensea.io/assets/${Address}/${data}`}
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="contained">View on OpenSea</Button>
            </a>
          </CardActions>
        </Card>
      </>
    );
  } else {
    return <></>;
  }
}
