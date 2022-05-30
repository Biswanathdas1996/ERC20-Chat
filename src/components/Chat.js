import React, { useState, useEffect, useRef } from "react";

import { Formik, Form, Field } from "formik";
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
import GetUser from "../components/shared/GetUser";

const client = create("https://ipfs.infura.io:5001/api/v0");

const VendorSchema = Yup.object().shape({
  text: Yup.string().required("Text is required"),
});

const Chat = () => {
  const [start, setStart] = useState(false);
  const [response, setResponse] = useState(null);
  const [messages, setMessages] = useState(null);
  const [account, setAccount] = useState(null);
  const [file, setFile] = useState(null);
  const [receverAddress, setReceverAddress] = useState(null);
  const [receverName, setReceverName] = useState(null);
  const [uploadFile, setUploadFile] = React.useState(false);
  const messagesEndRef = useRef(null);
  let history = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const saveData = async ({ text }) => {
    setStart(true);
    const date = new Date().toLocaleString();
    const responseData = await _transction(
      "sendMassage",
      receverAddress,
      account,
      text,
      "null",
      "null",
      date
    );
    setResponse(responseData);
    fetshMessages();
  };

  useEffect(() => {
    fetshMessages();
    const receverAddress = localStorage.getItem("userAddressforChat");
    if (!receverAddress) {
      history("/users");
      return;
    }
    setReceverAddress(receverAddress);
    setReceverName(receverName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const date = new Date().toLocaleString();
    const responseData = await _transction(
      "sendMassage",
      receverAddress,
      account,
      "null",
      `https://ipfs.io/ipfs/${results.path}`,
      file.type,
      date
    );
    setResponse(responseData);
    fetshMessages();
  };

  const modalClose = () => {
    setStart(false);
    setResponse(null);
  };

  const renderMessage = (data) => {
    const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
    const validVideoeTypes = ["video/mp4"];
    if (data?.text !== "null") {
      return data?.text;
    } else {
      if (validImageTypes.includes(data?.fileType)) {
        return (
          <center>
            <a href={data?.file} target="_blank" rel="noreferrer">
              <img
                src={data?.file}
                alt={data?.file}
                style={{ borderRadius: "5px" }}
              />
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

      <div>
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
                  <Grid
                    item
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    key={`chat_${index}`}
                  >
                    <Card
                      style={{
                        padding: 10,
                        maxWidth: "25rem",
                        minWidth: "20rem",
                        PaddingTop: "0px",
                        textAlign: "left",
                        display: "flex",
                        float: data?.sender === account ? "right" : "left",
                        backgroundColor:
                          data?.sender === account ? "#8080801c" : "white",
                      }}
                    >
                      <GetUser
                        uid={data?.sender}
                        hideName={true}
                        imgStyle={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                        }}
                      />
                      <div style={{ padding: 10, width: "100%" }}>
                        {renderMessage(data)}
                        <div style={{ fontSize: 11, color: "#808080f0" }}>
                          <span style={{ float: "right", marginTop: 10 }}>
                            {data?.time}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
          <Box sx={{ marginBottom: "10rem" }}></Box>
        </center>
        {/* ///msg submit form */}

        <div className="chatInputWrapper">
          <Card style={{ padding: 10 }}>
            <Formik
              initialValues={{
                text: "",
              }}
              validationSchema={VendorSchema}
              onSubmit={(values, { setSubmitting }) => {
                saveData(values);
                setSubmitting(false);
              }}
              style={{ padding: 10 }}
            >
              {({ touched, errors, isSubmitting }) => (
                <Form className="form-inline">
                  <div
                    className="form-group"
                    style={{ marginTop: 10, width: "70%" }}
                  >
                    {!uploadFile ? (
                      <Field
                        type="text"
                        name="text"
                        autoComplete="flase"
                        placeholder="Enter text"
                        className={`textField ${
                          touched.text && errors.text ? "is-invalid" : ""
                        }`}
                        // style={{ marginRight: 10 }}
                      />
                    ) : (
                      <Field
                        type="file"
                        name="text"
                        autoComplete="flase"
                        placeholder="Enter text"
                        className={`textField ${
                          touched.text && errors.text ? "is-invalid" : ""
                        }`}
                        onChange={onFileChange}
                        // style={{ marginRight: 10 }}
                      />
                    )}
                  </div>
                  <div className="form-group" style={{ width: "30%" }}>
                    {uploadFile ? (
                      <>
                        <button
                          onClick={onFileUpload}
                          className="btn btn-default btn-primary"
                          type="button"
                          style={{
                            marginTop: 10,
                            marginLeft: 10,
                            width: "100%",
                          }}
                        >
                          Send File
                        </button>
                        <button
                          onClick={() => setUploadFile(false)}
                          className="btn btn-default btn-primary"
                          type="button"
                          style={{
                            marginTop: 10,
                            marginLeft: 10,
                            width: "100%",
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <input
                          className="btn btn-default btn-primary "
                          type="submit"
                          value={"Send"}
                          style={{
                            marginTop: 10,
                            marginLeft: 10,
                            width: "100%",
                          }}
                        />
                        <button
                          onClick={() => setUploadFile(true)}
                          className="btn btn-default btn-primary"
                          type="button"
                          style={{
                            marginTop: 10,
                            marginLeft: 10,
                            width: "100%",
                          }}
                        >
                          Send File
                        </button>
                      </>
                    )}
                  </div>

                  <div style={{ marginLeft: 10, marginTop: 10 }}>
                    {/* <input
                      type="file"
                      className="textField"
                      onChange={onFileChange}
                    /> */}
                    {/* <button
                      onClick={onFileUpload}
                      className="btn btn-default btn-primary"
                      type="button"
                    >
                      Upload!
                    </button> */}
                  </div>
                </Form>
              )}
            </Formik>
          </Card>
        </div>

        {/* <Paper
          sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
          elevation={3}
        >
          <BottomNavigation></BottomNavigation>
        </Paper> */}
      </div>
      <div ref={messagesEndRef} />
    </>
  );
};
export default Chat;
