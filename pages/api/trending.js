import nextConnect from "next-connect";
import LanguageTranslatorV3 from "ibm-watson/language-translator/v3";
import { IamAuthenticator } from "ibm-watson/auth";
import axios from "axios";
import DatauriParser from "datauri/parser";

import { middleware } from "../../database";

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
  try {
    const { Translations } = req.models;
    const lang = req.query.selectLang;
    const docs = await Translations.find(
      {},
      {},
      {
        lean: true,
        sort: { lifetimeHits: -1 },
        limit: 10
      }
    );

    const newDocs = docs.filter(doc => {
      return doc.en.text !== "welcome";
    });

    const newDocsTwo = newDocs.filter(doc => {
      return doc[lang].text;
    });

    res.json(newDocsTwo);
    req.connection.close();
  } catch (err) {
    res.status(400).json({ errors: { name: err.name, message: err.message } });
    // rollbar.error(err);
  }
});

export default handler;
