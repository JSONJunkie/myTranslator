import React, { Fragment } from "react";

const textArea = {
  width: "60%",
  height: "40%"
};

export default function Landing() {
  return (
    <Fragment>
      Welcome to the translator! To begin, enter text below:
      <textarea placeholder={"Enter text here..."} style={textArea} />
      <button>Translate</button>
    </Fragment>
  );
}
