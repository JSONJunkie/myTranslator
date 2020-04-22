import React, { Fragment, useState } from "react";
import Rollbar from "rollbar";

import Landing from "./landing/Landing";

// function getRollbar() {
//   if (process.env.NODE_ENV === "development") {
//     const rollbar = new Rollbar({
//       accessToken: "589f75cdf3664555b9b778a76ab2a226",
//       captureUncaught: true,
//       captureUnhandledRejections: true
//     });
//     return rollbar;
//   }

//   if (process.env.NODE_ENV === "production") {
//     const rollbar = new Rollbar({
//       accessToken: "589f75cdf3664555b9b778a76ab2a226",
//       captureUncaught: true,
//       captureUnhandledRejections: true
//     });
//     return rollbar;
//   }
// }

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
      accessToken: "589f75cdf3664555b9b778a76ab2a226",
      captureUncaught: true,
      captureUnhandledRejections: true
    })
  );

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
