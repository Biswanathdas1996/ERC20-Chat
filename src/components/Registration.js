import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import swal from "sweetalert";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Card, Grid } from "@mui/material";
import Typography from "@mui/material/Typography";

import { _transction, _fetch } from "../ABI-connect/MessangerABI/connect";
import TransctionModal from "./shared/TransctionModal";

const useStyles = makeStyles(({ palette, ...theme }) => ({
  cardHolder: {
    background: "#f3f3f4",
    alignItems: "center",
    height: "90vh",
    overflow: "auto",
  },
}));

const VendorSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
});

const Registration = () => {
  const classes = useStyles();

  const [start, setStart] = useState(false);
  const [response, setResponse] = useState(null);
  const submitForm = async (name) => {
    setStart(true);
    const responseData = await _transction("register", name);
    setResponse(responseData);
  };

  const saveData = (value) => {
    const { name } = value;

    swal({
      title: "Are you sure?",
      text: "Want to submit the form !",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        submitForm(name);
      }
    });
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  async function fetchStudentData() {
    const students = await _fetch("getAllUsers");
    console.log("--------->", students);
  }

  const modalClose = () => {
    setStart(false);
    setResponse(null);
  };
  return (
    <>
      {start && <TransctionModal response={response} modalClose={modalClose} />}

      <div className={classes.cardHolder}>
        <div>
          <Card className={classes.card}>
            <Grid container>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Typography
                  style={{ marginLeft: "15px", marginTop: "10px", padding: 3 }}
                  component="h1"
                  variant="h5"
                >
                  Vendor Registration
                </Typography>
                <div
                  className="p-8 h-full"
                  style={{ justifyContent: "center", padding: "20px" }}
                >
                  <Formik
                    initialValues={{
                      name: "",
                    }}
                    validationSchema={VendorSchema}
                    onSubmit={(values, { setSubmitting }) => {
                      saveData(values);
                      setSubmitting(false);
                    }}
                  >
                    {({ touched, errors, isSubmitting }) => (
                      <Form>
                        <div className="form-group">
                          <label htmlFor="name">Full Name</label>
                          <Field
                            type="text"
                            name="name"
                            autoComplete="flase"
                            placeholder="Enter full name"
                            className={`form-control text-muted ${
                              touched.name && errors.name ? "is-invalid" : ""
                            }`}
                          />

                          <ErrorMessage
                            component="div"
                            name="name"
                            className="invalid-feedback"
                          />
                        </div>

                        <span className="input-group-btn">
                          <input
                            className="btn btn-default btn-primary"
                            type="submit"
                            value={"Submit"}
                          />
                        </span>
                      </Form>
                    )}
                  </Formik>
                </div>
              </Grid>
            </Grid>
          </Card>
        </div>
      </div>
    </>
  );
};
export default Registration;
