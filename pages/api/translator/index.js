import nextConnect from "next-connect";
import LanguageTranslatorV3 from "ibm-watson/language-translator/v3";
import { IamAuthenticator } from "ibm-watson/auth";
import validator from "validator";

import rollbar from "rollbar";

const handler = nextConnect();

const languageTranslator = new LanguageTranslatorV3({
  version: "2018-05-01",
  authenticator: new IamAuthenticator({
    apikey: process.env.TRANSLATE_KEY,
  }),
  url: process.env.TRANSLATE_URL,
  headers: {
    "X-Watson-Learning-Opt-Out": "true",
  },
});

handler.post(async (req, res) => {
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

export default handler;
