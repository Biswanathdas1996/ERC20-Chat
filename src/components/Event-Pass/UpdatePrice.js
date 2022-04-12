import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Card, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  _transction,
  _fetch,
  _account,
} from "../../ABI-connect/Event-Entry-Pass/connect";
import TransctionModal from "../shared/TransctionModal";
import Web3 from "web3";
const web3 = new Web3(window.ethereum);

const VendorSchema = Yup.object().shape({
  amount: Yup.string().required("Amount is required"),
});

const UpdatePrice = () => {
  const [start, setStart] = useState(false);
  const [response, setResponse] = useState(null);
  let history = useNavigate();
  const [cost, setCost] = useState(null);
  const [account, setAccount] = React.useState(null);
  const [owner, setOwner] = useState(null);

  useEffect(() => {
    fetchAllPosts();
  }, []);

  async function fetchAllPosts() {
    const cost = await _fetch("cost");
    setCost(cost);
    const owner = await _fetch("owner");
    setOwner(owner);
    const account = await _account();
    setAccount(account);
  }

  const saveData = async ({ amount }) => {
    setStart(true);
    let responseData;

    responseData = await _transction(
      "setCost",
      web3.utils.toWei(amount.toString(), "ether")
    );

    setResponse(responseData);
    history("/event/all");
    console.log("responseData", responseData);
  };

  const modalClose = () => {
    setStart(false);
    setResponse(null);
  };

  return (
    <>
      {start && <TransctionModal response={response} modalClose={modalClose} />}

      <div
        style={{
          padding: "20px",
          background: "white",
        }}
      >
        <h4>
          Current price: {cost && web3.utils.fromWei(cost.toString(), "ether")}{" "}
          ETH
        </h4>
        <Formik
          initialValues={{
            amount: cost,
          }}
          validationSchema={VendorSchema}
          onSubmit={(values, { setSubmitting }) => {
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
                  name="amount"
                  autoComplete="flase"
                  placeholder="Enter amount (ETH)"
                  className={`form-control text-muted ${
                    touched.amount && errors.amount ? "is-invalid" : ""
                  }`}
                  style={{ marginRight: 10, padding: 9 }}
                />
              </div>

              <div className="form-group">
                <span className="input-group-btn">
                  {owner === account ? (
                    <input
                      className="btn btn-default btn-primary"
                      type="submit"
                      value={"Update"}
                    />
                  ) : (
                    <h5>
                      Only <small style={{ color: "red" }}>{owner} </small>
                      can create pass
                    </h5>
                  )}
                </span>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};
export default UpdatePrice;
