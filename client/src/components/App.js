import React, { Fragment } from "react";

import Landing from "./landing/Landing";

const flexContainer = {
  display: "flex",
  height: "100vh",
  justifyContent: "center",
  alignItems: "center"
};

function App() {
  return (
    <Fragment>
      <div style={flexContainer}>
        <Landing />
      </div>
    </Fragment>
  );
}

export default App;
