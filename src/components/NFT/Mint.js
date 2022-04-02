import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { Card, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import { _transction } from "../../ABI-connect/NFT-ABI/connect";
import TransctionModal from "../shared/TransctionModal";
import { create } from "ipfs-http-client";
import { useNavigate } from "react-router-dom";

const client = create("https://ipfs.infura.io:5001/api/v0");

const useStyles = makeStyles(({ palette, ...theme }) => ({
  cardHolder: {
    background: "#f3f3f4",
    overflow: "auto",
  },
}));

const VendorSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  text: Yup.string().required("Text is required"),
});

const Mint = () => {
  const classes = useStyles();

  const [start, setStart] = useState(false);
  const [response, setResponse] = useState(null);
  const [file, setFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  let history = useNavigate();

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const saveData = async ({ name, text, attributes }) => {
    setStart(true);
    let responseData;
    if (file) {
      const base64Img = await convertToBase64(file);

      const results = await await client.add(file);
      console.log("--img fingerpring-->", results.path);
      const metaData = {
        name: name,
        image: `https://ipfs.infura.io/ipfs/${results.path}`,
        description: text,
        attributes: attributes,
      };

      const resultsSaveMetaData = await await client.add(
        JSON.stringify(metaData)
      );
      console.log("---metadta-->", resultsSaveMetaData.path);

      responseData = await _transction(
        "mintNFT",
        `https://ipfs.infura.io/ipfs/${resultsSaveMetaData.path}`
      );
    }
    setResponse(responseData);
    history("/nft-list");
    console.log("responseData", responseData);
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
    setSelectedFile(event.target.files[0]);
  };

  const modalClose = () => {
    setStart(false);
    setResponse(null);
  };

  return (
    <>
      {start && <TransctionModal response={response} modalClose={modalClose} />}

      <div className={classes.cardHolder}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={3}></Grid>
          <Grid item xs={6}>
            <div style={{ margin: 20 }}>
              <Card className={classes.card}>
                <Grid container>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <div
                      style={{
                        padding: "20px",
                        background: "white",
                      }}
                    >
                      <h4>Create NFT</h4>
                      <Formik
                        initialValues={{
                          name: "",
                          text: "",
                          attributes: [
                            {
                              trait_type: "",
                              value: "",
                            },
                          ],
                        }}
                        validationSchema={VendorSchema}
                        onSubmit={(values, { setSubmitting }) => {
                          console.log("values=======>", values);
                          saveData(values);
                          setSubmitting(false);
                        }}
                      >
                        {({ touched, errors, isSubmitting, values }) => (
                          <Form>
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
                              <Field
                                type="text"
                                name="text"
                                autoComplete="flase"
                                placeholder="Enter description"
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
                                              name={`attributes.${index}.trait_type`}
                                              autoComplete="flase"
                                              placeholder="Enter Properties name"
                                              className={`form-control text-muted `}
                                              style={{
                                                marginTop: 10,
                                                padding: 9,
                                              }}
                                            />
                                            <Field
                                              name={`attributes.${index}.value`}
                                              autoComplete="flase"
                                              placeholder="Enter value"
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
          </Grid>
          <Grid item xs={3}></Grid>
        </Grid>
      </div>
    </>
  );
};
export default Mint;
