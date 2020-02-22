const fs = require("fs");
const express = require("express");
const LanguageTranslatorV3 = require("ibm-watson/language-translator/v3");
const TextToSpeechV1 = require("ibm-watson/text-to-speech/v1");
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

// const translateParams = {
//   text: "Hello",
//   modelId: "en-es"
// };

// const synthesizeParams = {
//   text: "Hello world",
//   accept: "audio/wav",
//   voice: "en-US_AllisonVoice"
// };

router.post("/", async (req, res) => {
  try {
    const translateParams = req.body;
    languageTranslator
      .translate(translateParams)
      .then(translationResult => {
        console.log(JSON.stringify(translationResult, null, 2));
      })
      .catch(err => {
        console.log("error:", err);
      });
    res.json(req.body);
  } catch (err) {
    // console.log(err);
  }
});

router.post("/speak", async (req, res) => {
  try {
    const synthesizeParams = req.body;
    textToSpeech
      .synthesize(synthesizeParams)
      .then(audio => {
        audio.result.pipe(res);
      })
      .catch(err => {
        // console.log("error:", err);
      });
  } catch (err) {
    // console.log(err);
  }
});

module.exports = router;
