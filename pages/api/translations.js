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
    const docs = await Translations.find({}, {}, { lean: true });
    var totalTrans = 0;
    docs.forEach(doc => {
      for (var key of Object.keys(doc)) {
        if (doc[key].text) {
          totalTrans = totalTrans + 1;
        }
      }
    });
    res.json(totalTrans * 2);
    req.connection.close();
  } catch (err) {
    res.status(400).json({ errors: { name: err.name, message: err.message } });
    // rollbar.error(err);
  }
});

handler.patch(async (req, res) => {
  try {
    const now = new Date().getTime();

    const { Translations } = req.models;
    const preTrans = req.body.data.preTrans;
    const from = req.body.data.fromCode + ".text";
    const doc = await Translations.findOne({ [from]: preTrans });

    if (!doc && preTrans === "welcome") {
      const dev = process.env.NODE_ENV !== "production";

      const baseUrl = dev
        ? "http://localhost:3000"
        : "https://drees1992-mytranslator.herokuapp.com";

      const fromText = "en.text";
      const to = "es";
      const voice = "es-ES_LauraVoice";
      const modelId = "en-" + to;

      // if (validator.isEmpty(translateParams.text)) {
      //   throw new Error("Please include some text to translate");
      // }

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

      const translateParams = {
        text: preTrans,
        modelId: modelId
      };

      const translationResult = await languageTranslator.translate(
        translateParams
      );

      const result = translationResult.result.translations[0].translation;

      const synthesizeParams = {
        text: result,
        accept: "audio/mp3",
        voice
      };

      const config = {
        responseType: "arraybuffer"
      };

      const body = synthesizeParams;

      const res = await axios.post(
        baseUrl + "/api/translator/speak",
        body,
        config
      );

      const audio = res.data;

      const parser = new DatauriParser();

      const audioDataUri = parser.format("audio/webm", audio);

      const entry = new Translations({
        [fromText]: preTrans,
        [to]: { text: result.toLowerCase(), audio: [audioDataUri.content] },
        hitData: [
          { time: 0, hits: 0 },
          { time: 0, hits: 0 },
          { time: 0, hits: 1 }
        ],
        lifetimeHits: 0,
        date: new Date().getTime()
      });

      await entry.save();
    }

    // const entry = {
    //   hour: new Date(parseInt(doc.date)).getHours(),
    //   day: new Date(parseInt(doc.date)).getDate(),
    //   month: new Date(parseInt(doc.date)).getMonth(),
    //   year: new Date(parseInt(doc.date)).getFullYear()
    // };

    const hours = Math.floor((now - doc.date) / 1000 / 60 / 60) + 1;

    if (doc.hitData.length < 23) {
      const lastEntry = doc.hitData[doc.hitData.length - 1];

      doc.hitData.pop();

      if (lastEntry.time === hours) {
        doc.hitData.push({
          time: hours,
          hits: lastEntry.hits + 1
        });
      } else {
        if (hours - lastEntry.time > 1) {
          const noHitHours = hours - lastEntry.time;
          if (noHitHours <= 23) {
            for (var i = 1; i < noHitHours; i++) {
              doc.hitData.push({ time: lastEntry.time + i, hits: 0 });
            }
            doc.hitData.push({
              time: hours,
              hits: 1
            });
          }

          if (noHitHours >= 24) {
            for (var i = 1; i < 24; i++) {
              doc.hitData.push({ time: lastEntry.time + i, hits: 0 });
            }
            doc.hitData.push({
              time: hours,
              hits: 1
            });
          }
        } else {
          doc.hitData.push(lastEntry);

          doc.hitData.push({
            time: hours,
            hits: 1
          });
        }
      }

      const updatedDoc = await Translations.findOneAndUpdate(
        { [from]: preTrans },
        { hitData: doc.hitData, lifetimeHits: doc.lifetimeHits + 1 },
        {
          new: true,
          useFindAndModify: false
        }
      );

      res.json(updatedDoc);
      req.connection.close();
    }

    if (doc.hitData.length >= 23) {
      const reversedData = doc.hitData.reverse();

      reversedData.pop();

      const newData = reversedData.reverse();

      const lastEntry = doc.newData[doc.newData.length - 1];

      doc.newData.pop();

      if (lastEntry.time === hours) {
        doc.newData.push({
          time: hours,
          hits: lastEntry.hits + 1
        });
      } else {
        if (hours - lastEntry.time > 1) {
          const noHitHours = hours - lastEntry.time;
          if (noHitHours <= 23) {
            for (var i = 1; i < noHitHours; i++) {
              doc.newData.push({ time: lastEntry.time + i, hits: 0 });
            }
            doc.newData.push({
              time: hours,
              hits: 1
            });
          }

          if (noHitHours >= 24) {
            for (var i = 1; i < 24; i++) {
              doc.newData.push({ time: lastEntry.time + i, hits: 0 });
            }
            doc.newData.push({
              time: hours,
              hits: 1
            });
          }
        } else {
          doc.newData.push(lastEntry);

          doc.newData.push({
            time: hours,
            hits: 1
          });
        }
      }

      const updatedDoc = await Translations.findOneAndUpdate(
        { [from]: preTrans },
        { hitData: newData, lifetimeHits: doc.lifetimeHits + 1 },
        {
          new: true,
          useFindAndModify: false
        }
      );

      res.json(updatedDoc);
      req.connection.close();
    }
  } catch (err) {
    res.json(null);
    req.connection.close();

    // res.status(400).json({ errors: { name: err.name, message: err.message } });
    // rollbar.error(err);
  }
});

export default handler;
