import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Grid } from "@mui/material";
import {
  _fetch,
  _transction,
  _account,
} from "../../ABI-connect/NFT-ABI/connect";
import { useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import TransctionModal from "../shared/TransctionModal";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Web3 from "web3";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PercentIcon from "@mui/icons-material/Percent";

const web3 = new Web3(window.ethereum);

const VendorSchema = Yup.object().shape({
  sendTo: Yup.string().required("Send address is required"),
});
const PriceVendorSchema = Yup.object().shape({
  price: Yup.string().required("Send address is required"),
});

const Timeline = () => {
  const [nftData, setNftData] = useState(null);
  const [owner, setOwner] = useState(null);
  const [account, setAccount] = useState(null);
  const [start, setStart] = useState(false);
  const [response, setResponse] = useState(null);
  const [price, setPriceValue] = useState(null);
  const [royelty, setRoyelty] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetchAllPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchAllPosts() {
    const getAllTokenUri = await _fetch("tokenURI", id);
    const getOwner = await _fetch("ownerOf", id);
    const getRoyeltyValue = await _fetch("getRoyeltyValue", id);
    setRoyelty(getRoyeltyValue);
    setOwner(getOwner);
    await fetch(getAllTokenUri)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setNftData(data);
      });
    const currentAccount = await _account();
    setAccount(currentAccount);
    const price = await _fetch("getNftPrice", id);
    setPriceValue(price);
  }

  const saveData = async ({ sendTo }) => {
    setStart(true);
    console.log(owner, sendTo, id);
    const responseData = await _transction("transferFrom", owner, sendTo, id);
    setResponse(responseData);
    fetchAllPosts();
  };

  const setPrice = async ({ price }) => {
    setStart(true);
    const responseData = await _transction(
      "_setNftPrice",
      id,
      web3.utils.toWei(price.toString(), "ether")
    );
    setResponse(responseData);
    fetchAllPosts();
  };

  const modalClose = () => {
    setStart(false);
    setResponse(null);
  };

  return (
    <>
      {start && <TransctionModal response={response} modalClose={modalClose} />}

      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        style={{ padding: 20, background: "#f3f3f4" }}
      >
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <Card>
            <CardActionArea>
              <center>
                <CardMedia
                  component="img"
                  height="500"
                  image={nftData?.image}
                  alt="green iguana"
                />
              </center>

              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {nftData?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <b style={{ color: "#7c007c" }}>
                    <h3>
                      {price && web3.utils.fromWei(price.toString(), "ether")}{" "}
                      ETH
                    </h3>
                  </b>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <b style={{ color: "#7c007c", display: "flex" }}>
                    <>Current Owner : </>
                    <Typography
                      variant="body2"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        width: "11rem",
                      }}
                    >
                      {account === owner ? "You own this token" : owner}
                    </Typography>
                  </b>
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Author will get royelty of {royelty}%.
                </Typography>
                <br />
                <Typography variant="body2" color="text.secondary">
                  {nftData?.description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card style={{ padding: 20, marginTop: 20 }}>
            <Formik
              initialValues={{
                price: "",
              }}
              validationSchema={PriceVendorSchema}
              onSubmit={(values, { setSubmitting }) => {
                setPrice(values);
                setSubmitting(false);
              }}
            >
              {({ touched, errors, isSubmitting }) => (
                <Form>
                  <h4>Update Price</h4>
                  <div
                    className="form-group"
                    style={{ marginLeft: 10, marginTop: 10 }}
                  >
                    <Field
                      type="number"
                      name="price"
                      autoComplete="flase"
                      placeholder="Enter price in ETH"
                      className={`form-control text-muted ${
                        touched.price && errors.price ? "is-invalid" : ""
                      }`}
                      style={{ marginRight: 10, padding: 9 }}
                      disabled={account !== owner}
                    />
                  </div>

                  <div className="form-group">
                    <span className="input-group-btn">
                      <input
                        className="btn btn-default btn-primary"
                        type="submit"
                        value={"Update"}
                        disabled={account !== owner}
                      />
                    </span>
                  </div>
                </Form>
              )}
            </Formik>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={8} lg={8}>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Properties</TableCell>
                  <TableCell align="right">Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {nftData?.attributes?.map((row, key) => {
                  console.log("---->", row);
                  if (row?.display_type === "boost_percentage") {
                    return (
                      <TableRow
                        key={row?.trait_type + key}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          <Button
                            variant="outlined"
                            color="success"
                            startIcon={<PercentIcon />}
                          >
                            {row?.trait_type}
                          </Button>
                        </TableCell>
                        <TableCell align="left" style={{ paddingRight: 20 }}>
                          <Slider
                            aria-label="Always visible"
                            defaultValue={Number(row?.value)}
                            step={10}
                            valueLabelDisplay="on"
                            marks={[
                              {
                                value: 0,
                                label: "0%",
                              },
                              {
                                value: 100,
                                label: "100%",
                              },
                            ]}
                            disabled
                          />
                        </TableCell>
                      </TableRow>
                    );
                  } else if (row?.display_type === "boost_number") {
                    return (
                      <TableRow
                        key={row?.trait_type + key}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          <Button
                            variant="contained"
                            startIcon={<OfflineBoltIcon />}
                          >
                            {row?.trait_type}
                          </Button>
                        </TableCell>
                        <TableCell align="right">{row?.value}</TableCell>
                      </TableRow>
                    );
                  } else if (row?.display_type === "date") {
                    return (
                      <TableRow
                        key={row?.trait_type + key}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          <Button
                            variant="outlined"
                            startIcon={<CalendarMonthIcon />}
                          >
                            {row?.trait_type}
                          </Button>
                        </TableCell>
                        <TableCell align="right">
                          {new Date(Number(row?.value)).toLocaleDateString(
                            "en-US"
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  } else {
                    return (
                      <TableRow
                        key={row?.trait_type + key}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row?.trait_type}
                        </TableCell>
                        <TableCell align="right">{row?.value}</TableCell>
                      </TableRow>
                    );
                  }
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <Card style={{ padding: 20, marginTop: 20 }}>
            <Formik
              initialValues={{
                sendTo: "",
              }}
              validationSchema={VendorSchema}
              onSubmit={(values, { setSubmitting }) => {
                saveData(values);
                setSubmitting(false);
              }}
            >
              {({ touched, errors, isSubmitting }) => (
                <Form>
                  <h4>Transfer </h4>
                  <div
                    className="form-group"
                    style={{ marginLeft: 10, marginTop: 10 }}
                  >
                    <Field
                      type="text"
                      name="sendTo"
                      autoComplete="flase"
                      placeholder="Enter reciever address"
                      className={`form-control text-muted ${
                        touched?.sendTo && errors?.sendTo ? "is-invalid" : ""
                      }`}
                      style={{ marginRight: 10, padding: 9 }}
                      disabled={account !== owner}
                    />
                  </div>

                  <div className="form-group">
                    <span className="input-group-btn">
                      <input
                        className="btn btn-default btn-primary"
                        type="submit"
                        value={"Transfer"}
                        disabled={account !== owner}
                      />
                    </span>
                  </div>
                </Form>
              )}
            </Formik>
            <small>*Only token owner can transfer</small>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};
export default Timeline;
