/* eslint-disable no-array-constructor */
import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Card, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import TransctionModal from "./shared/TransctionModal";
import { create } from "ipfs-http-client";
import PostCard from "./shared/PostCard";
import UserList from "./UserList";
import {
  _transction,
  _fetch,
  _account,
} from "../ABI-connect/MessangerABI/connect";

import TextEditor from "./UI/Editor";

const client = create("https://ipfs.infura.io:5001/api/v0");

const VendorSchema = Yup.object().shape({
  // text: Yup.string().required("Text is required"),
});

const Timeline = () => {
  const [start, setStart] = useState(false);
  const [response, setResponse] = useState(null);
  const [messages, setMessages] = useState(null);
  const [file, setFile] = useState(null);
  const [htmlCode, setHtmlCode] = useState(null);

  const saveData = async ({ text }) => {
    setStart(true);
    let responseData;
    if (file) {
      const results = await client.add(file);
      // const saveHtmlDescription = await client.add(htmlCode);
      console.log(results.path);
      const sender = await _account();
      const date = new Date().toLocaleString();
      responseData = await _transction(
        "postStory",
        JSON.stringify(htmlCode),
        `https://ipfs.io/ipfs/${results.path}`,
        file.type,
        sender,
        date
      );
    } else {
      responseData = await _transction("postStory", text, "null", "null");
    }
    setResponse(responseData);
    fetchAllPosts();
  };

  useEffect(() => {
    fetchAllPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const getEditorValue = (val) => {
    setHtmlCode(val);
  };

  return (
    <>
      {start && <TransctionModal response={response} modalClose={modalClose} />}

      <div style={{ padding: 20, background: "#f3f3f4" }}>
        <Grid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          style={{ marginBottom: 20 }}
        >
          <Grid item xs={12} lg={8} md={8} sm={12}>
            <Card>
              <div style={{ padding: 10 }}>
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
                        <TextEditor
                          id="story-description"
                          name="description"
                          label="Description"
                          tip="Describe the project in as much detail as you'd like."
                          value={htmlCode}
                          onChange={getEditorValue}
                        />

                        {/* <Field
                          type="text"
                          name="text"
                          autoComplete="flase"
                          placeholder="Enter text"
                          className={`form-control text-muted ${
                            touched.text && errors.text ? "is-invalid" : ""
                          }`}
                          style={{ marginRight: 10, padding: 9 }}
                        /> */}
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
                            value={"Post"}
                          />
                        </span>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </Card>

            <Box style={{ marginBottom: 20 }}>
              {messages?.map((data, index) => {
                return (
                  <>
                    <PostCard data={data} />
                  </>
                );
              })}
            </Box>
          </Grid>
          <Grid item xs={12} lg={4} md={4} sm={12}>
            <UserList />
          </Grid>
        </Grid>
      </div>
    </>
  );
};
export default Timeline;
