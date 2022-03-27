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
import DescriptionIcon from "@mui/icons-material/Description";
import { useNavigate } from "react-router-dom";
import PostCard from "./shared/PostCard";
import UserList from "./UserList";
import { margin } from "@mui/lab/node_modules/@mui/system";

const useStyles = makeStyles(({ palette, ...theme }) => ({
  cardHolder: {
    background: "#f3f3f4",
    alignItems: "center",
    overflow: "auto",
  },
}));

const VendorSchema = Yup.object().shape({
  text: Yup.string().required("Text is required"),
});

const Timeline = () => {
  const classes = useStyles();

  const [start, setStart] = useState(false);
  const [response, setResponse] = useState(null);
  const [messages, setMessages] = useState(null);
  const [account, setAccount] = useState(null);
  const [file, setFile] = useState(null);
  let history = useNavigate();

  const saveData = async ({ text }) => {
    setStart(true);
    let responseData;
    if (file) {
      const node = await IPFS.create();
      if (node) {
        const results = await node.add(file);
        console.log(results.path);
        responseData = await _transction(
          "postStory",
          text,
          `https://ipfs.io/ipfs/${results.path}`,
          file.type
        );
      }
    } else {
      responseData = await _transction("postStory", text, "null", "null");
    }
    setResponse(responseData);
    fetchAllPosts();
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);

  function reverseArr(input) {
    var ret = new Array();
    for (var i = input.length - 1; i >= 0; i--) {
      ret.push(input[i]);
    }
    return ret;
  }

  async function fetchAllPosts() {
    const getAllPosts = await _fetch("getAllposts");
    const account = await _account();
    setAccount(account);
    setMessages(reverseArr(getAllPosts));
  }

  const onFileChange = (event) => {
    // Update the state
    setFile(event.target.files[0]);
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
          Timeline
        </Typography>

        <Grid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          style={{ margin: 10 }}
        >
          <Grid item xs={7}>
            {/* ///msg submit form */}
            <div>
              <Card className={classes.card}>
                <Grid container>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <div
                      style={{
                        padding: "20px",
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
                          <Form>
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
                                  touched.text && errors.text
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{ marginRight: 10, padding: 9 }}
                              />
                            </div>
                            <div className="form-group">
                              <span className="input-group-btn">
                                <div style={{ marginLeft: 10, marginTop: 10 }}>
                                  <input type="file" onChange={onFileChange} />
                                </div>
                              </span>
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
                          </Form>
                        )}
                      </Formik>
                    </div>
                  </Grid>
                </Grid>
              </Card>
            </div>
            {/* // msg list/ */}
            <Box sx={{ width: "100%" }}>
              {messages?.map((data, index) => {
                return (
                  <>
                    <PostCard data={data} />
                  </>
                );
              })}
            </Box>
            <Box sx={{ marginBottom: "10rem" }}></Box>
          </Grid>
          <Grid item xs={5}>
            <UserList addressonly />
          </Grid>
        </Grid>
      </div>
    </>
  );
};
export default Timeline;
