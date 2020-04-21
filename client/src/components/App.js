import React, { Fragment, useState } from "react";
import Rollbar from "rollbar";

import Landing from "./landing/Landing";

const flexContainer = {
  display: "flex",
  height: "100vh",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column"
};

function App() {
  const [rollbar] = useState(
    new Rollbar({
      accessToken: "3bfb54869cfc4d8bbde4bf35b652fed6",
      captureUncaught: true,
      captureUnhandledRejections: true
    })
  );

  // const logInfo = () => {
  //   rollbar.info("react test log");
  // };

  const throwError = () => {
    throw new Error("react test error");
  };

  return (
    <Fragment>
      <div style={flexContainer}>
        <Landing rollbar={rollbar} />
        {/* <button onClick={logInfo}>Log Info</button> */}
        <button onClick={throwError}>Throw Error</button>
      </div>
    </Fragment>
  );
}

export default App;
