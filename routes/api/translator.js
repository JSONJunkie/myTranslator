const fs = require("fs");
const streamBuffers = require("stream-buffers");
const express = require("express");
const LanguageTranslatorV3 = require("ibm-watson/language-translator/v3");
const TextToSpeechV1 = require("ibm-watson/text-to-speech/v1");
const SpeechToTextV1 = require("ibm-watson/speech-to-text/v1");
const { IamAuthenticator } = require("ibm-watson/auth");

const router = express.Router();

const languageTranslator = new LanguageTranslatorV3({
  version: "2018-05-01",
  authenticator: new IamAuthenticator({
    apikey: process.env.TRANSLATE_KEY
  }),
  url: process.env.TRANSLATE_URL,
  headers: {
    "X-Watson-Learning-Opt-Out": "true"
  }
});

const textToSpeech = new TextToSpeechV1({
  authenticator: new IamAuthenticator({
    apikey: process.env.SPEAK_KEY
  }),
  url: process.env.SPEAK_URL,
  headers: {
    "X-Watson-Learning-Opt-Out": "true"
  }
});

const speechToText = new SpeechToTextV1({
  authenticator: new IamAuthenticator({
    apikey: process.env.LISTEN_KEY
  }),
  url: process.env.LISTEN_URL,
  headers: {
    "X-Watson-Learning-Opt-Out": "true"
  }
});

// var params = {
//   objectMode: true,
//   contentType: "audio/flac",
//   model: "es-ES_BroadbandModel",
//   maxAlternatives: 1
// };

// // Create the stream.
// var recognizeStream = speechToText.recognizeUsingWebSocket(params);

// // Pipe in the audio.
// fs.createReadStream("audio-file.flac").pipe(recognizeStream);

// recognizeStream.on("data", function(event) {
//   onEvent("Data:", event);
// });
// recognizeStream.on("error", function(event) {
//   onEvent("Error:", event);
// });
// recognizeStream.on("close", function(event) {
//   onEvent("Close:", event);
// });

// function onEvent(name, event) {
//   console.log(name, JSON.stringify(event, null, 2));
// }

router.post("/", async (req, res) => {
  try {
    const translateParams = req.body;
    const translationResult = await languageTranslator.translate(
      translateParams
    );
    const result = translationResult.result.translations[0].translation;
    res.json(result);
  } catch (err) {
    console.log(err);
  }
});

router.post("/speak", async (req, res) => {
  try {
    const synthesizeParams = req.body;
    const audio = await textToSpeech.synthesize(synthesizeParams);
    await audio.result.pipe(res);
  } catch (err) {
    console.log(err);
  }
});

router.post("/listen", async (req, res) => {
  try {
    // const synthesizeParams = req.body;
    // const audio = await textToSpeech.synthesize(synthesizeParams);
    // await audio.result.pipe(res);
    var params = {
      objectMode: true,
      contentType: "audio/mpeg",
      model: "es-ES_BroadbandModel",
      maxAlternatives: 1
    };
    const arr = [];

    // req.on("data", data => {
    //   // console.log(data);
    //   // Create the stream.
    //   // const myReadStream = fs.createReadStream(data);
    //   // arr.push(data);
    //   // Pipe in the audio.
    // });
    // req.on("finish", () => {
    //   // res.send("ok");
    //   console.log("hi");
    // });
    const recognizeStream = speechToText.recognizeUsingWebSocket(params);

    req.pipe(recognizeStream);

    // res.send("okok");

    // const buf = Buffer.concat(arr);
    // Initialize stream
    // const myReadableStreamBuffer = new streamBuffers.ReadableStreamBuffer({});

    // With a buffer
    // myReadableStreamBuffer.put(buf);
    // await myReadableStreamBuffer.pipe(recognizeStream);

    // req.on("end", () => {
    //   res.send("ok");
    // });
    // console.log(req);

    // const audio = req.body;

    // console.log(audio);

    // console.log(typeof audio);

    recognizeStream.on("data", function(event) {
      onEvent("Data:", event);
    });
    recognizeStream.on("error", function(event) {
      onEvent("Error:", event);
    });
    recognizeStream.on("close", function(event) {
      onEvent("Close:", event);
    });

    function onEvent(name, event) {
      console.log(name, JSON.stringify(event, null, 2));
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
