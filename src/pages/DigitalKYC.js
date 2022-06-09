import React, { useState, useEffect } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
// import * as Yup from "yup";
import { Card, Grid } from "@mui/material";
import TransctionModal from "../components/shared/TransctionModal";
import { create } from "ipfs-http-client";
// import { useNavigate } from "react-router-dom";
// import Web3 from "web3";
import Typography from "@mui/material/Typography";
import { _transction } from "../ABI-connect/KYC/connect";
import uuid from "uuid/v4";

// const web3 = new Web3(window.ethereum);

const client = create("https://ipfs.infura.io:5001/api/v0");

// const VendorSchema = Yup.object().shape({
//   name: Yup.string().required("Name is required"),
//   text: Yup.string().required("Text is required"),
//   price: Yup.string().required("Price is required"),
//   royelty: Yup.string().required("Royelty amount is required"),
// });

const Mint = () => {
  const [start, setStart] = useState(false);
  const [response, setResponse] = useState(null);
  const [file, setFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  // let history = useNavigate();

  const saveData = async (values) => {
    setStart(true);
    const userImg = await client.add(file);
    const userData = JSON.stringify({ ...values, img: userImg.path });
    const results = await client.add(userData);

    const uid = uuid();
    const responseData = await _transction(
      "addUser",
      uid,
      results.path,
      userData
    );
    setResponse(responseData);
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
    console.log("---", event.target.files[0]);
    setSelectedFile(event.target.files[0]);
  };

  const modalClose = () => {
    setStart(false);
    setResponse(null);
  };

  return (
    <>
      {start && <TransctionModal response={response} modalClose={modalClose} />}

      <div>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item lg={1} md={1} sm={12} xs={12}></Grid>
          <Grid item lg={10} md={10} sm={12} xs={12}>
            <div style={{ margin: 20 }}>
              <div
                style={{
                  padding: "20px",
                  //   background: "white",
                }}
              >
                <h4>KYC Form</h4>
                <Formik
                  initialValues={{
                    name: "",
                    attributes: [
                      {
                        type: "",
                        value: "",
                        year: "",
                      },
                    ],
                  }}
                  // validationSchema={VendorSchema}
                  onSubmit={(values, { setSubmitting }) => {
                    console.log("values=======>", values);
                    saveData(values);
                    setSubmitting(false);
                  }}
                >
                  {({ touched, errors, isSubmitting, values }) => (
                    <Form>
                      <Grid container>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                          <Card style={{ padding: 10 }}>
                            <Typography
                              sx={{ fontSize: 14 }}
                              color="text.secondary"
                              gutterBottom
                            >
                              Personal Details
                            </Typography>
                            <div
                              className="form-group"
                              style={{ marginLeft: 10, marginTop: 10 }}
                            >
                              <Field
                                type="text"
                                name="name"
                                autoComplete="flase"
                                placeholder="Enter name"
                                className={`form-control text-muted ${
                                  touched.name && errors.name
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{ marginRight: 10, padding: 9 }}
                              />
                            </div>
                            <div
                              className="form-group"
                              style={{ marginLeft: 10, marginTop: 10 }}
                            >
                              <h5>Enter date of birth</h5>
                              <Field
                                type="date"
                                name="dob"
                                autoComplete="flase"
                                placeholder="Enter date of birth"
                                className={`form-control text-muted ${
                                  touched.dob && errors.dob ? "is-invalid" : ""
                                }`}
                                style={{ marginRight: 10, padding: 9 }}
                              />
                            </div>

                            <div className="form-group">
                              <span className="input-group-btn">
                                <div style={{ marginLeft: 10, marginTop: 10 }}>
                                  <h5>Upload immage</h5>
                                  <input type="file" onChange={onFileChange} />
                                </div>

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
                              </span>
                            </div>
                            <div
                              className="form-group"
                              style={{ marginLeft: 10, marginTop: 10 }}
                            >
                              <Field
                                type="number"
                                name="phone"
                                autoComplete="flase"
                                placeholder="Enter contact number"
                                className={`form-control text-muted ${
                                  touched.phone && errors.phone
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{ marginRight: 10, padding: 9 }}
                              />
                            </div>
                            <div
                              className="form-group"
                              style={{ marginLeft: 10, marginTop: 10 }}
                            >
                              <Field
                                type="text"
                                name="email"
                                autoComplete="flase"
                                placeholder="Enter email id"
                                className={`form-control text-muted ${
                                  touched.email && errors.email
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{ marginRight: 10, padding: 9 }}
                              />
                            </div>
                          </Card>
                        </Grid>
                        <Grid
                          item
                          lg={12}
                          md={12}
                          sm={12}
                          xs={12}
                          style={{ marginTop: 20 }}
                        >
                          <Card style={{ padding: 10 }}>
                            <Typography
                              sx={{ fontSize: 14 }}
                              color="text.secondary"
                              gutterBottom
                            >
                              Address
                            </Typography>
                            <div
                              className="form-group"
                              style={{ marginLeft: 10, marginTop: 10 }}
                            >
                              <Field
                                type="text"
                                name="address"
                                autoComplete="flase"
                                placeholder="Enter address"
                                className={`form-control text-muted ${
                                  touched.address && errors.address
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{ marginRight: 10, padding: 9 }}
                              />
                            </div>
                            <div
                              className="form-group"
                              style={{ marginLeft: 10, marginTop: 10 }}
                            >
                              <Field
                                type="text"
                                name="city"
                                autoComplete="flase"
                                placeholder="Enter city"
                                className={`form-control text-muted ${
                                  touched.city && errors.city
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{ marginRight: 10, padding: 9 }}
                              />
                            </div>
                            <div
                              className="form-group"
                              style={{ marginLeft: 10, marginTop: 10 }}
                            >
                              <Field
                                type="text"
                                name="state"
                                autoComplete="flase"
                                placeholder="Enter state"
                                className={`form-control text-muted ${
                                  touched.state && errors.state
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{ marginRight: 10, padding: 9 }}
                              />
                            </div>
                            <div
                              className="form-group"
                              style={{ marginLeft: 10, marginTop: 10 }}
                            >
                              <Field
                                type="text"
                                name="pin"
                                autoComplete="flase"
                                placeholder="Enter pin"
                                className={`form-control text-muted ${
                                  touched.pin && errors.pin ? "is-invalid" : ""
                                }`}
                                style={{ marginRight: 10, padding: 9 }}
                              />
                            </div>
                          </Card>
                        </Grid>

                        <Grid
                          item
                          lg={12}
                          md={12}
                          sm={12}
                          xs={12}
                          style={{ marginTop: 20 }}
                        >
                          <Card style={{ padding: 10 }}>
                            <Typography
                              sx={{ fontSize: 14 }}
                              color="text.secondary"
                              gutterBottom
                            >
                              Identification Details
                            </Typography>
                            <div
                              className="form-group"
                              style={{ marginLeft: 10, marginTop: 10 }}
                            >
                              <Field
                                type="text"
                                name="aadhaar"
                                autoComplete="flase"
                                placeholder="Enter Aadhaar no"
                                className={`form-control text-muted ${
                                  touched.aadhaar && errors.aadhaar
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{ marginRight: 10, padding: 9 }}
                              />
                            </div>
                            <div
                              className="form-group"
                              style={{ marginLeft: 10, marginTop: 10 }}
                            >
                              <Field
                                type="text"
                                name="pancard"
                                autoComplete="flase"
                                placeholder="Enter PAN card number"
                                className={`form-control text-muted ${
                                  touched.pancard && errors.pancard
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{ marginRight: 10, padding: 9 }}
                              />
                            </div>
                            <div
                              className="form-group"
                              style={{ marginLeft: 10, marginTop: 10 }}
                            >
                              <Field
                                type="text"
                                name="votercard"
                                autoComplete="flase"
                                placeholder="Enter voter card number"
                                className={`form-control text-muted ${
                                  touched.votercard && errors.votercard
                                    ? "is-invalid"
                                    : ""
                                }`}
                                style={{ marginRight: 10, padding: 9 }}
                              />
                            </div>
                          </Card>
                        </Grid>
                        <Grid
                          item
                          lg={12}
                          md={12}
                          sm={12}
                          xs={12}
                          style={{ marginTop: 20 }}
                        >
                          <Card style={{ padding: 10 }}>
                            <Typography
                              sx={{ fontSize: 14 }}
                              color="text.secondary"
                              gutterBottom
                            >
                              Education Details
                            </Typography>
                            <div className="form-group">
                              <FieldArray
                                name="attributes"
                                render={(arrayHelpers) => (
                                  <div>
                                    {values.attributes &&
                                    values.attributes.length > 0 ? (
                                      values.attributes.map(
                                        (attribut, index) => (
                                          <div
                                            style={{
                                              border: "1px solid #c7c9cc",
                                              borderRadius: 5,
                                              padding: 12,
                                              marginTop: 15,
                                            }}
                                            key={index}
                                          >
                                            <button
                                              type="button"
                                              className="btn btn-default btn-danger"
                                              onClick={() =>
                                                arrayHelpers.remove(index)
                                              }
                                              style={{
                                                marginBottom: 10,
                                                float: "right",
                                              }}
                                            >
                                              Remove
                                            </button>

                                            <Field
                                              name={`attributes.${index}.type`}
                                              autoComplete="flase"
                                              placeholder="Exam Name"
                                              className={`form-control text-muted `}
                                              style={{
                                                marginTop: 10,
                                                padding: 9,
                                              }}
                                            />
                                            <Field
                                              type="number"
                                              name={`attributes.${index}.value`}
                                              autoComplete="flase"
                                              placeholder="score (%)"
                                              className={`form-control text-muted`}
                                              style={{
                                                marginTop: 10,
                                                padding: 9,
                                              }}
                                            />
                                            <Field
                                              type="date"
                                              name={`attributes.${index}.year`}
                                              autoComplete="flase"
                                              placeholder="Year of complition"
                                              className={`form-control text-muted`}
                                              style={{
                                                marginTop: 10,
                                                padding: 9,
                                              }}
                                            />
                                          </div>
                                        )
                                      )
                                    ) : (
                                      <button
                                        type="button"
                                        className="btn btn-default btn-primary"
                                        onClick={() => arrayHelpers.push("")}
                                      >
                                        {/* show this when user has removed all attributes from the list */}
                                        Add attributes
                                      </button>
                                    )}
                                    {values.attributes.length !== 0 && (
                                      <button
                                        type="button"
                                        className="btn btn-default btn-success"
                                        onClick={() =>
                                          arrayHelpers.insert(
                                            values.attributes.length + 1,
                                            ""
                                          )
                                        }
                                        style={{
                                          marginTop: 10,
                                        }}
                                      >
                                        + Add
                                      </button>
                                    )}
                                  </div>
                                )}
                              />
                            </div>
                          </Card>
                        </Grid>
                      </Grid>

                      <div className="form-group" style={{ marginTop: 20 }}>
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
            </div>
          </Grid>
          <Grid item lg={1} md={1} sm={12} xs={12}></Grid>
        </Grid>
      </div>
    </>
  );
};
export default Mint;
