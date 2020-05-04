import nextConnect from "next-connect";
import SpeechToTextV1 from "ibm-watson/speech-to-text/v1";
import { IamAuthenticator } from "ibm-watson/auth";

import { rollbar } from ".";

const handler = nextConnect();

const speechToText = new SpeechToTextV1({
  authenticator: new IamAuthenticator({
    apikey: process.env.LISTEN_KEY
  }),
  url: process.env.LISTEN_URL,
  headers: {
    "X-Watson-Learning-Opt-Out": "true"
  }
});

handler.post(async (req, res) => {
  try {
    var params = {
      objectMode: true,
      contentType: "audio/webm",
      model: "es-ES_BroadbandModel",
      maxAlternatives: 1
    };
    // var params = {
    //   objectMode: true,
    //   contentType: "audio/webm",
    //   model: "en-US_BroadbandModel",
    //   maxAlternatives: 1
    // };
    const recognizeStream = speechToText.recognizeUsingWebSocket(params);

    await req.pipe(recognizeStream);

    recognizeStream.on("data", function (event) {
      onEvent("Data:", event);
      // console.log(event);
      res.send(event.results[0].alternatives[0].transcript);
    });
    recognizeStream.on("error", function (event) {
      onEvent("Error:", event.raw.data);
      // console.log(event.raw.data);
    });
    recognizeStream.on("close", function (event) {
      onEvent("Close:", event);
    });

    function onEvent(name, event) {
      console.log(name, JSON.stringify(event, null, 2));
    }
  } catch (err) {
    res.status(400).json({ errors: { name: err.name, message: err.message } });
    rollbar.error(err);
  }
});

export default handler;
