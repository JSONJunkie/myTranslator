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

    const mostHits = docs[0].lifetimeHits;

    const newDocs = docs.filter(doc => {
      return doc.en.text !== "welcome";
    });

    const newDocsTwo = newDocs.filter(doc => {
      return doc[lang].text;
    });

    newDocsTwo.forEach(doc => {
      const now = new Date().getTime();
      const hours = Math.floor((now - doc.date) / 1000 / 60 / 60) + 1;

      if (doc.hitData.length < 23) {
        const lastEntry = doc.hitData[doc.hitData.length - 1];

        doc.hitData.pop();

        if (lastEntry.time === hours) {
          doc.hitData.push(lastEntry);
        } else {
          if (hours - lastEntry.time > 1) {
            doc.hitData.push(lastEntry);
            const noHitHours = hours - lastEntry.time;
            if (noHitHours < 23) {
              for (var i = 1; i < noHitHours; i++) {
                doc.hitData.push({
                  time: lastEntry.time + i,
                  hits: 0
                });
              }
              doc.hitData.shift();
              doc.hitData.push({
                time: hours,
                hits: 0
              });
            }

            if (noHitHours >= 23) {
              for (var i = 0; i < 23; i++) {
                doc.hitData[i] = { time: hours - 23 + i, hits: 0 };
              }
              doc.hitData.push({
                time: hours,
                hits: 0
              });
            }
          } else {
            doc.hitData.push(lastEntry);

            doc.hitData.push({
              time: hours,
              hits: 0
            });
          }
        }
      }

      if (doc.hitData.length >= 23) {
        const reversedData = doc.hitData.reverse();

        reversedData.pop();

        const newData = reversedData.reverse();

        const lastEntry = newData[newData.length - 1];

        newData.pop();

        if (lastEntry.time === hours) {
          newData.push(lastEntry);
        } else {
          if (hours - lastEntry.time > 1) {
            newData.push(lastEntry);
            const noHitHours = hours - lastEntry.time;
            if (noHitHours < 23) {
              for (var i = 1; i < noHitHours; i++) {
                newData.shift();
                newData.push({
                  time: lastEntry.time + i,
                  hits: 0
                });
              }
              newData.shift();
              newData.push({
                time: hours,
                hits: 0
              });
            }

            if (noHitHours >= 23) {
              for (var i = 0; i < 23; i++) {
                newData[i] = { time: hours - 23 + i, hits: 0 };
              }
              newData.push({
                time: hours,
                hits: 0
              });
            }
          } else {
            newData.push(lastEntry);

            newData.push({
              time: hours,
              hits: 0
            });
          }
          doc.hitData = newData;
        }
      }
      doc.hitData.unshift({ mostHits });
    });

    res.json(newDocsTwo);
    req.connection.close();
  } catch (err) {
    res.status(400).json({ errors: { name: err.name, message: err.message } });
    // rollbar.error(err);
  }
});

export default handler;
