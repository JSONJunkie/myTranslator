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

router.post("/", async (req, res) => {
  try {
    const translateParams = req.body;
    const translationResult = await languageTranslator.translate(
      translateParams
    );
    const result = translationResult.result.translations[0].translation;
    res.json(result);
    if (err) throw err;
  } catch (err) {
    // console.log(err);
  }
});

router.post("/speak", async (req, res) => {
  try {
    const synthesizeParams = req.body;
    const audio = await textToSpeech.synthesize(synthesizeParams);
    await audio.result.pipe(res);
    if (err) throw err;
  } catch (err) {
    // console.log(err);
  }
});

module.exports = router;
