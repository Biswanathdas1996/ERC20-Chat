import React, { useState, useEffect, useContext } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Card, Grid } from "@mui/material";
import { _transction } from "../ABI-connect/MessangerABI/connect";
import { create } from "ipfs-http-client";
import { useNavigate } from "react-router-dom";
import TransctionModal from "../components/shared/TransctionModal";

import { IPFSLink, IpfsViewLink } from "../config";
import uuid from "uuid/v4";
import swal from "sweetalert";
import { AccountContext } from "../App";
import { encode } from "js-base64";

const client = create(IPFSLink);

const VendorSchema = Yup.object().shape({
  title: Yup.string().required("Name is required"),
});

const Register = () => {
  const [start, setStart] = useState(false);
  const [response, setResponse] = useState(null);
  const [file, setFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const { fetchUserData } = useContext(AccountContext);

  let history = useNavigate();

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const saveData = async ({ title }) => {
    setStart(true);

    const results = await client.add(file);

    const imgLink = IpfsViewLink(results.path);

    const uid = uuid();
    await _transction("addUser", uid, title, imgLink);
    localStorage.setItem("uid", encode(uid));
    fetchUserData();
    swal({
      title: `${uid}`,
      text: "Please note your privet key",
      icon: "success",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        history("/");
      }
    });

    setStart(false);
  };

  const modalClose = () => {
    setStart(false);
    setResponse(null);
    history("/");
  };

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
    setSelectedFile(event.target.files[0]);
  };

  return (
    <>
      {start && <TransctionModal response={response} modalClose={modalClose} />}
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item lg={2} md={2} sm={12} xs={12}></Grid>
        <Grid item lg={8} md={8} sm={12} xs={12}>
          <div style={{ margin: 20 }}>
            <Card
              style={{
                padding: "20px",
                background: "white",
              }}
            >
              <h4>Register</h4>
              <Formik
                initialValues={{
                  title: "",
                  type: "",
                  priority: "",
                  storypoint: "",
                  text: "",
                }}
                validationSchema={VendorSchema}
                onSubmit={(values, { setSubmitting }) => {
                  saveData(values);
                  setSubmitting(false);
                }}
              >
                {({ touched, errors, isSubmitting, values }) => (
                  <Form>
                    <Grid container>
                      {/* // Title */}
                      <Grid item lg={6} md={6} sm={12} xs={12}>
                        <div
                          className="form-group"
                          style={{ marginLeft: 10, marginTop: 10 }}
                        >
                          <label htmlFor="title" className="my-2">
                            Title <span className="text-danger">*</span>
                          </label>
                          <Field
                            type="text"
                            name="title"
                            autoComplete="flase"
                            placeholder="Enter title"
                            className={`form-control text-muted ${
                              touched.title && errors.title ? "is-invalid" : ""
                            }`}
                            style={{ marginRight: 10, padding: 9 }}
                          />
                        </div>
                      </Grid>

                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <div
                          className="form-group"
                          style={{ marginLeft: 10, marginTop: 10 }}
                        >
                          <label htmlFor="img" className="my-2">
                            Choose file <span className="text-danger">*</span>
                          </label>

                          <input
                            className={`form-control text-muted`}
                            type="file"
                            onChange={onFileChange}
                            name="img"
                          />

                          {selectedFile && (
                            <center>
                              <img
                                src={preview}
                                alt="img"
                                style={{
                                  marginTop: 20,
                                  height: 300,
                                  width: "auto",
                                }}
                              />
                            </center>
                          )}
                        </div>
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <div
                          className="form-group"
                          style={{
                            marginLeft: 10,
                            marginTop: 10,
                            float: "right",
                          }}
                        >
                          <span className="input-group-btn">
                            <input
                              className="btn btn-default btn-primary float-right"
                              type="submit"
                              value={"Submit"}
                            />
                          </span>
                        </div>
                      </Grid>
                    </Grid>
                  </Form>
                )}
              </Formik>
            </Card>
          </div>
        </Grid>
        <Grid item lg={2} md={2} sm={12} xs={12}></Grid>
      </Grid>
    </>
  );
};
export default Register;
