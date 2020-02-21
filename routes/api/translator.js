const express = require("express");
const LanguageTranslatorV3 = require("ibm-watson/language-translator/v3");
const { IamAuthenticator } = require("ibm-watson/auth");

const router = express.Router();
const languageTranslator = new LanguageTranslatorV3({
  version: "2018-05-01",
  authenticator: new IamAuthenticator({
    apikey: process.env.API_KEY
  }),
  url: process.env.API_URL,
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
router.get("/", async (req, res) => {
  res.json(translationResult);
});

module.exports = router;
