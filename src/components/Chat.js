import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Card, Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
  _transction,
  _fetch,
  _account,
} from "../ABI-connect/MessangerABI/connect";
import TransctionModal from "./shared/TransctionModal";
import { create } from "ipfs-http-client";
import DescriptionIcon from "@mui/icons-material/Description";
import { useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";

const client = create("https://ipfs.infura.io:5001/api/v0");

const useStyles = makeStyles(({ palette, ...theme }) => ({
  cardHolder: {
    background: "#f3f3f4",
    alignItems: "center",
    height: "90vh",
    overflow: "auto",
  },
}));

const VendorSchema = Yup.object().shape({
  text: Yup.string().required("Text is required"),
});

const Chat = () => {
  const classes = useStyles();

  const [start, setStart] = useState(false);
  const [response, setResponse] = useState(null);
  const [messages, setMessages] = useState(null);
  const [account, setAccount] = useState(null);
  const [file, setFile] = useState(null);
  const [amount, setAmount] = useState(null);
  const [receverAddress, setReceverAddress] = useState(null);
  const [receverName, setReceverName] = useState(null);
  const messagesEndRef = useRef(null);
  let history = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const saveData = async ({ text }) => {
    setStart(true);
    const responseData = await _transction(
      "sendMassage",
      receverAddress,
      text,
      "null",
      "null",
      0
    );
    setResponse(responseData);
    fetshMessages();
  };

  useEffect(() => {
    fetshMessages();
    const receverAddress = localStorage.getItem("userAddressforChat");
    const receverName = localStorage.getItem("userNameforChat");
    if (!receverAddress) {
      history("/users");
      return;
    }
    setReceverAddress(receverAddress);
    setReceverName(receverName);
  }, [receverAddress]);

  async function fetshMessages() {
    const getAllMessages = await _fetch("getAllMessages");
    const account = await _account();
    setAccount(account);
    const masgToBeShown = getAllMessages?.filter(
      (data) =>
        (data.sender === account && data.recever === receverAddress) ||
        (data.sender === receverAddress && data.recever === account)
    );
    setMessages(masgToBeShown);
    scrollToBottom();
    console.log(masgToBeShown);
  }

  const onFileChange = (event) => {
    // Update the state
    setFile(event.target.files[0]);
  };

  const onFileUpload = async () => {
    setStart(true);
    console.log(file);
    console.log(file.type);
    const results = await client.add(file);

    console.log(results.path);

    const responseData = await _transction(
      "sendMassage",
      receverAddress,
      "null",
      `https://ipfs.io/ipfs/${results.path}`,
      file.type,
      0
    );
    setResponse(responseData);
    fetshMessages();
  };

  const sendAmount = async () => {
    setStart(true);
    const responseDataMoney = await _transction(
      "transfer",
      receverAddress,
      amount
    );

    const responseData = await _transction(
      "sendMassage",
      receverAddress,
      "null",
      "null",
      "null",
      amount
    );
    setResponse(responseDataMoney);
    fetshMessages();
  };

  const modalClose = () => {
    setStart(false);
    setResponse(null);
  };

  const renderMessage = (data) => {
    const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
    const validVideoeTypes = ["video/mp4"];
    if (data?.amount !== "0") {
      return (
        <>
          <b style={{ color: "green" }}>Transction: </b> {data?.amount} MTN
        </>
      );
    } else if (data?.text !== "null") {
      return data?.text;
    } else {
      if (validImageTypes.includes(data?.fileType)) {
        return (
          <center>
            <a href={data?.file} target="_blank" rel="noreferrer">
              <img src={data?.file} alt={data?.file} />
            </a>
          </center>
        );
      } else if (validVideoeTypes.includes(data?.fileType)) {
        return (
          <video
            id="vidObj"
            width="100%"
            height="360"
            controls
            loop
            muted
            autoplay
          >
            <source src={data?.file} type="video/mp4" />
          </video>
        );
      } else {
        return (
          <center>
            <a href={data?.file} target="_blank" rel="noreferrer">
              <DescriptionIcon fontSize="large" sx={{ fontSize: 60 }} />
              <p>{data?.fileType}</p>
            </a>
          </center>
        );
      }
    }
  };
  return (
    <>
      {start && <TransctionModal response={response} modalClose={modalClose} />}

      <div className={classes.cardHolder}>
        <Typography
          style={{ marginLeft: "15px", marginTop: "10px", padding: 3 }}
          component="h1"
          variant="h5"
        >
          Secure Chat Box
        </Typography>
        {/* // msg list/ */}
        <center>
          <Box sx={{ width: "90%" }}>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              {messages?.map((data, index) => {
                return (
                  <>
                    <b
                      style={{
                        color: "grey",
                        marginLeft: "1.5rem",
                        marginTop: "15px",
                      }}
                    >
                      {data?.sender === account ? "" : receverName}
                    </b>

                    <Grid
                      item
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      key={index + "_message"}
                    >
                      <Card
                        style={{
                          padding: 10,
                          maxWidth: "25rem",
                          minWidth: "20rem",
                          PaddingTop: "0px",
                          textAlign: "left",
                          float: data?.sender === account ? "right" : "left",
                          backgroundColor:
                            data?.sender === account ? "#8080801c" : "white",
                        }}
                      >
                        {renderMessage(data)}
                      </Card>
                    </Grid>
                  </>
                );
              })}
            </Grid>
          </Box>
          <Box sx={{ marginBottom: "10rem" }}></Box>
        </center>
        {/* ///msg submit form */}
        <div>
          <Card className={classes.card}>
            <Grid container>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <div
                  style={{
                    padding: "20px",
                    bottom: 0,
                    position: "absolute",
                    background: "white",
                  }}
                >
                  <Formik
                    initialValues={{
                      text: "",
                    }}
                    validationSchema={VendorSchema}
                    onSubmit={(values, { setSubmitting }) => {
                      saveData(values);
                      setSubmitting(false);
                    }}
                  >
                    {({ touched, errors, isSubmitting }) => (
                      <Form className="form-inline">
                        <div
                          className="form-group"
                          style={{ marginLeft: 10, marginTop: 10 }}
                        >
                          <Field
                            type="text"
                            name="text"
                            autoComplete="flase"
                            placeholder="Enter text"
                            className={`form-control text-muted ${
                              touched.text && errors.text ? "is-invalid" : ""
                            }`}
                            style={{ marginRight: 10, padding: 9 }}
                          />
                        </div>
                        <div className="form-group">
                          <span className="input-group-btn">
                            <input
                              className="btn btn-default btn-primary"
                              type="submit"
                              value={"Submit"}
                            />
                          </span>
                        </div>

                        <div style={{ marginLeft: 10, marginTop: 10 }}>
                          <input type="file" onChange={onFileChange} />
                          <button
                            onClick={onFileUpload}
                            className="btn btn-default btn-primary"
                          >
                            Upload!
                          </button>
                        </div>

                        <div
                          style={{ marginLeft: 10, marginTop: 10 }}
                          className="form-group"
                        >
                          <input
                            type="number"
                            onChange={(e) => setAmount(e.target.value)}
                            className={`form-control`}
                            style={{ marginRight: 10 }}
                            placeholder="Enter amount"
                          />
                          <button
                            onClick={sendAmount}
                            className="btn btn-default btn-primary"
                          >
                            Send Money
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </Grid>
            </Grid>
          </Card>
        </div>
        <div ref={messagesEndRef} />
      </div>
    </>
  );
};
export default Chat;
