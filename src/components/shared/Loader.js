import * as React from "react";

const Loader = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="la-ball-clip-rotate-pulse la-dark la-3x">
        <div></div>
        <div></div>
      </div>
    </div>
  );
};
export default Loader;
