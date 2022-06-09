import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import OfflineShareIcon from "@mui/icons-material/OfflineShare";
import {
  _fetch,
  _account,
  _paid_transction,
} from "../../ABI-connect/NFT-ABI/connect";
import Address from "../../ABI-connect/NFT-ABI/Address.json";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import TransctionModal from "./TransctionModal";

export default function RecipeReviewCard({ data, fetchAllPosts }) {
  const [nftData, setNftData] = useState(null);
  const [start, setStart] = useState(false);
  const [owner, setOwner] = useState(null);
  const [account, setAccount] = useState(null);
  const [price, setPrice] = useState(null);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    fetchNftInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchNftInfo() {
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
    setStart(true);
    const responseData = await _paid_transction(
      Number(price),
      "buyNft",
      owner,
      account,
      Number(data)
    );
    setResponse(responseData);
    fetchAllPosts();
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
              <a
                href={`https://testnets.opensea.io/assets/${Address}/${data}/?force_update=true`}
                target="_blank"
                rel="noreferrer"
                title="View on OpenSea"
              >
                <IconButton aria-label="settings">
                  <OfflineShareIcon />
                </IconButton>
              </a>
            }
            title={nftData?.name}
            subheader={"#" + data}
          />

          <CardMedia
            component="img"
            image={nftData?.image}
            alt="Paella dish"
            height="200"
            weidth="200"
          />

          <CardContent>
            <Typography variant="body2" color="text.secondary">
              <h5>{price / 1000000000000000000} ETH</h5>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <h5 style={{ fontSize: 10 }}>
                <b>Owner: </b>
                <Typography
                  variant="body2"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    width: "11rem",
                  }}
                >
                  {owner}
                </Typography>
              </h5>
            </Typography>
          </CardContent>
          <CardActions style={{ padding: 10 }} disableSpacing>
            <Link to={`/nft-details/${data}`}>
              <Button
                variant="contained"
                style={{ marginRight: 10, padding: 10 }}
                color="info"
                className="btn btn-default btn-info"
              >
                View
              </Button>
            </Link>

            {owner !== account && (
              <Button
                variant="contained"
                style={{ marginRight: 10, padding: "5px !important" }}
                color="success"
                onClick={() => buynow()}
                className="btn btn-default btn-primary"
              >
                Buy Now
              </Button>
            )}
          </CardActions>
        </Card>
      </>
    );
  } else {
    return <></>;
  }
}
