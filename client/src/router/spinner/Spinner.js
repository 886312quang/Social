import React from "react";
import Spinner from 'react-bootstrap/Spinner'

const Loader = () => (
  <div
    style={{
      width: "100%",
      margin: "24px",
      display: "flex",
      justifyContent: "center",
      alignContent: "center",
      alignItems: "center",
    }}
  >
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </div>
);

export default Loader;
