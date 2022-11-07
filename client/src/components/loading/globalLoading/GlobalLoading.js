import React from "react";
import "./globalLoading.css";
import Spinner from "../../../router/spinner/Spinner";

function GlobalLoading(props) {
  return (
    <div className="backGroundGlobalLoading">
      <div className="_preloader" id="_preloader_loading">
        <Spinner />
      </div>
    </div>
  );
}

export default GlobalLoading;
