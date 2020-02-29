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
    // var params = {
    //   objectMode: true,
    //   contentType: "audio/webm",
    //   model: "es-ES_BroadbandModel",
    //   maxAlternatives: 1
    // };
    var params = {
      objectMode: true,
      contentType: "audio/webm",
      model: "en-US_BroadbandModel",
      maxAlternatives: 1
    };
    const recognizeStream = speechToText.recognizeUsingWebSocket(params);

    await req.pipe(recognizeStream);

    recognizeStream.on("data", function(event) {
      onEvent("Data:", event);
      res.send(event.results[0].alternatives[0].transcript);
    });
    recognizeStream.on("error", function(event) {
      onEvent("Error:", event.raw.data);
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
