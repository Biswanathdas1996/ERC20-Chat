import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {
  _fetch,
  _account,
  _paid_transction,
} from "../../ABI-connect/Event-Entry-Pass/connect";
import TransctionModal from "../shared/TransctionModal";
import TicketModalBody from "../shared/TicketModalBody";
import Modal from "react-bootstrap/Modal";

const EventPass = ({ data, symbol }) => {
  const [baseExtentionData, setBaseExtentionData] = useState(null);
  const [owner, setOwner] = useState(null);
  const [start, setStart] = useState(false);
  const [account, setAccount] = React.useState(null);
  const [response, setResponse] = useState(null);
  const [price, setPrice] = useState(null);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const fetchData = async () => {
    const account = await _account();

    setAccount(account);
    const getPriceOfNft = await _fetch("getNftPrice", data);
    setPrice(getPriceOfNft);
    const getTokenURI = await _fetch("getTokenURI", data);
    await fetch(getTokenURI)
      .then((response) => response.json())
      .then((data) => {
        setBaseExtentionData(data);
      });

    const getOwner = await _fetch("ownerOf", data);
    setOwner(getOwner);
  };

  const buyNow = async () => {
    setStart(true);
    const responseData = await _paid_transction(price, "transferNFT", data);
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

      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        style={{ marginTop: 40 }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{baseExtentionData?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TicketModalBody data={baseExtentionData} price={price} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
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
        </Modal.Footer>
      </Modal>

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
          alt={baseExtentionData?.name}
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
            <b style={{ fontSize: 20 }}>{price / 1000000000000000000} ETH</b>
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

          <Button
            variant="contained"
            style={{ width: "100% !important", marginLeft: 10 }}
            className="btn btn-default btn-secondary"
            onClick={handleShow}
          >
            Details
          </Button>
        </CardActions>
      </Card>
    </>
  );
};
export default EventPass;
