const express = require("express");
const LanguageTranslatorV3 = require("ibm-watson/language-translator/v3");
const { IamAuthenticator } = require("ibm-watson/auth");

const router = express.Router();
const languageTranslator = new LanguageTranslatorV3({
  version: "2018-05-01",
  authenticator: new IamAuthenticator({
    apikey: "process.env.API_KEY"
  }),
  url: "process.env.API_URL"
});

// @route POST api/users
// @description Register user
// @access Public
router.post("/", async (req, res) => {});

module.exports = router;
