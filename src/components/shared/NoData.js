import React from "react";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";

export default function NoData({ text }) {
  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <center>
        <ImageNotSupportedIcon sx={{ fontSize: 70, color: "#7e7e7ec9" }} />
        <p style={{ fontSize: 20, color: "#7e7e7ec9" }}> {text}</p>
      </center>
    </div>
  );
}
