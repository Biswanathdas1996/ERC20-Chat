import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import { Base64 } from "js-base64";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Encryption } from "ces-system";

export default function EncryptionView() {
  const [text, setText] = useState(null);
  const [encriptedtext, setEncriptedtext] = useState(null);

  const postHandler = () => {
    Encryption(text).then((encryptedText) => setEncriptedtext(encryptedText));
  };

  return (
    <Form id="form" style={{ marginTop: 30 }}>
      {encriptedtext}
      <Col lg={12}>
        <h4 className="autochange_text">Encrypt Your Text</h4>
        <p style={{ fontSize: 12, textAlign: "justify" }}>
          {" "}
          Enter any text here in the box and encrypt this with most advance
          encryption system
        </p>

        <Form.Group controlId="exampleForm.ControlTextarea1">
          <Form.Control
            as="textarea"
            rows="3"
            style={{ fontSize: 13 }}
            onChange={(event) => setText(event.target.value)}
            placeholder="Enter your text here"
          />
        </Form.Group>
        <Button
          style={{ float: "right", fontSize: 12 }}
          className="loginbutton"
          variant="primary"
          type="button"
          onClick={(event) => postHandler()}
        >
          Encrypt
        </Button>
      </Col>
    </Form>
  );
}
