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

// languageTranslator
//   .translate(translateParams)
//   .then(translationResult => {
//     console.log(JSON.stringify(translationResult, null, 2));
//   })
//   .catch(err => {
//     console.log("error:", err);
//   });

// const synthesizeParams = {
//   text: "Hello world",
//   accept: "audio/wav",
//   voice: "en-US_AllisonVoice"
// };

// textToSpeech.synthesize(synthesizeParams)
//   .then(audio => {
//     audio.pipe(fs.createWriteStream('hello_world.wav'));
//   })
//   .catch(err => {
//     console.log('error:', err);
//   });
const translationResult = {
  status: 200,
  statusText: "OK",
  headers: {
    "content-type": "application/json;charset=UTF-8",
    "content-length": "104",
    "x-xss-protection": "1; mode=block",
    "x-content-type-options": "nosniff",
    "content-security-policy": "default-src 'none'",
    "cache-control": "no-cache, no-store",
    pragma: "no-cache",
    "content-language": "en-US",
    "strict-transport-security": "max-age=31536000; includeSubDomains;",
    "x-global-transaction-id": "3f27ac63739886d5a23c39ddfaab75b2",
    "x-dp-watson-tran-id": "3f27ac63739886d5a23c39ddfaab75b2",
    "x-edgeconnect-midmile-rtt": "29",
    "x-edgeconnect-origin-mex-latency": "89",
    date: "Thu, 20 Feb 2020 23:25:53 GMT",
    connection: "close"
  },
  result: {
    translations: [
      {
        translation: "Hola"
      }
    ],
    word_count: 1,
    character_count: 5
  }
};

router.post("/", async (req, res) => {
  try {
    // res.json(translationR esult);
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
        // const data = new Buffer(audio.result.buffer);
        // audio.result.pipe(fs.createWriteStream("./client/src/speak.wav"));
        // var arr = [];
        audio.result.pipe(res);
        // audio.result.on("data", function(chunk) {
        //   console.log("chunk received");
        //   arr.push(chunk);
        // });
        // audio.result.on("end", function() {
        //   arr = Buffer.concat(arr); // do something with data
        //   console.log(arr);
        //   console.log(arr.length);
        //   res.set("Content-Type", "application/octet-stream");
        //   res.send(arr);
        // });
        // console.log(arr);
        // console.log(arr.length);
      })
      .catch(err => {
        console.log("error:", err);
      });
    // res.json({ obj: "sound" });
  } catch (err) {
    // console.log(err);
  }
});

module.exports = router;
