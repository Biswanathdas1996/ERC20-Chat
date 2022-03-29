import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Card, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import { _transction } from "../../ABI-connect/NFT-ABI/connect";
import TransctionModal from "../shared/TransctionModal";
import * as IPFS from "ipfs-core";

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

  const saveData = async ({ name, text }) => {
    setStart(true);
    let responseData;
    if (file) {
      const node = await IPFS.create();
      if (node) {
        const results = await node.add(file);
        console.log(results.path);

        const metaData = {
          name: name,
          image: `https://ipfs.io/ipfs/${results.path}`,
          description: text,
          attributes: [
            {
              trait_type: "Base",
              value: "Starfish",
            },
            {
              trait_type: "Eyes",
              value: "Big",
            },
            {
              trait_type: "Mouth",
              value: "Surprised",
            },
          ],
        };
        const resultsSaveMetaData = await node.add(JSON.stringify(metaData));
        console.log("----->", resultsSaveMetaData.path);

        responseData = await _transction(
          "mintNFT",
          `https://ipfs.io/ipfs/${resultsSaveMetaData.path}`
        );
      }
    }
    setResponse(responseData);
  };

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
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
