import "./401.css";
import React from "react";

const Error401Page = () => {
  return (
    <div className="back">
      <div className="mars"></div>
      <img
        src="https://assets.codepen.io/1538474/404.svg"
        className="logo-404"
        alt="imgs"
      />
      <img
        src="https://assets.codepen.io/1538474/meteor.svg"
        className="meteor"
        alt="imgds"
      />
      <p className="title">Oh no!!</p>
      <p className="subtitle">
        You need to install Metamask or any wallet to start with
      </p>
      <div align="center">
        <a
          className="btn-back"
          href="https://metamask.io/download/"
          target="_blank"
          rel="noreferrer"
        >
          Install Metamask
        </a>
      </div>
      <img
        src="https://assets.codepen.io/1538474/astronaut.svg"
        className="astronaut"
        alt="imgs"
      />
      <img
        src="https://assets.codepen.io/1538474/spaceship.svg"
        className="spaceship"
        alt="imgs"
      />
    </div>
  );
};
export default Error401Page;
