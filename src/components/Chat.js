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
import * as IPFS from "ipfs-core";

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
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const receverAddress = localStorage.getItem("userAddressforChat");

  const saveData = async ({ text }) => {
    setStart(true);
    const responseData = await _transction(
      "sendMassage",
      receverAddress,
      text,
      "null"
    );
    setResponse(responseData);
    fetshMessages();
  };

  useEffect(() => {
    fetshMessages();
  }, []);

  async function fetshMessages() {
    const getAllMessages = await _fetch("getAllMessages");
    const account = await _account();
    console.log("-----getAllMessages---->", getAllMessages, account);
    setAccount(account);

    const masgToBeShown = getAllMessages?.filter(
      (data) =>
        (data.sender === account && data.recever === receverAddress) ||
        (data.sender === receverAddress && data.recever === account)
    );
    setMessages(masgToBeShown);
    scrollToBottom();
  }

  const onFileChange = (event) => {
    // Update the state
    setFile(event.target.files[0]);
  };

  const onFileUpload = async () => {
    setStart(true);
    console.log(file);
    const node = await IPFS.create();
    if (node) {
      const results = await node.add(file);
      console.log(results.path);

      const responseData = await _transction(
        "sendMassage",
        receverAddress,
        "null",
        `https://ipfs.io/ipfs/${results.path}`
      );
      setResponse(responseData);
      fetshMessages();
    }
  };

  const modalClose = () => {
    setStart(false);
    setResponse(null);
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
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Card
                      style={{
                        padding: 10,
                        maxWidth: "25rem",
                        minWidth: "20rem",
                        marginTop: "10px",
                        textAlign: "left",
                        float: data?.sender === account ? "right" : "left",
                      }}
                    >
                      {data?.text !== "null" ? (
                        data?.text
                      ) : (
                        <a href={data?.file} target="_blank" rel="noreferrer">
                          <img src={data?.file} alt={data?.file} />
                        </a>
                      )}
                    </Card>
                  </Grid>
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
                        <div className="form-group">
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

                          {/* <ErrorMessage
                            component="div"
                            name="text"
                            className="invalid-feedback"
                          /> */}
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

                        <div>
                          <input type="file" onChange={onFileChange} />
                          <button onClick={onFileUpload}>Upload!</button>
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
