const express = require("express");
const LanguageTranslatorV3 = require("ibm-watson/language-translator/v3");
const TextToSpeechV1 = require("ibm-watson/text-to-speech/v1");
const SpeechToTextV1 = require("ibm-watson/speech-to-text/v1");
const { IamAuthenticator } = require("ibm-watson/auth");
const Rollbar = require("rollbar");
const validator = require("validator");

const router = express.Router();

const rollbar = new Rollbar({
  accessToken: "31432b4b831a4991bc8726210f1eb03e",
  captureUncaught: true,
  captureUnhandledRejections: true,
  environment: process.env.NODE_ENV
});

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

router.post("/", async (req, res) => {
  try {
    const translateParams = req.body;

    if (validator.isEmpty(req.body.text)) {
      throw new Error("Please include some text to translate");
    }
    // if (!validator.isAlpha(req.body.text)) {
    //   throw new Error("Please only include words");
    // }

    const translationResult = await languageTranslator.translate(
      translateParams
    );
    const result = translationResult.result.translations[0].translation;
    res.json(result);
  } catch (err) {
    res.status(400).json({ errors: { name: err.name, message: err.message } });
    rollbar.error(err);
  }
});

router.post("/speak", async (req, res) => {
  try {
    const synthesizeParams = req.body;
    if (validator.isEmpty(req.body.text)) {
      throw new Error("You need to make a translation first");
    }
    const audio = await textToSpeech.synthesize(synthesizeParams);
    await audio.result.pipe(res);
  } catch (err) {
    res.status(400).json({ errors: { name: err.name, message: err.message } });
    rollbar.error(err);
  }
});

router.post("/listen", async (req, res) => {
  try {
    var params = {
      objectMode: true,
      contentType: "audio/webm",
      model: "es-ES_BroadbandModel",
      interimResults: true,
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
      // res.send(event.results[0].alternatives[0].transcript);
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

module.exports = router;
