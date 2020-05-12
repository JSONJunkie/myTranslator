import nextConnect from "next-connect";

import { middleware } from "../../database";

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
  try {
    const { Translations } = req.models;
    const numDocs = await Translations.estimatedDocumentCount().exec();
    res.json(numDocs);
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
    const from = req.body.data.fromCode;
    const doc = await Translations.findOne({ [from]: preTrans });

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

      console.log(updatedDoc);
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
      console.log(updatedDoc);

      res.json(updatedDoc);
      req.connection.close();
    }
  } catch (err) {
    console.log(err);
    req.connection.close();

    // res.status(400).json({ errors: { name: err.name, message: err.message } });
    // rollbar.error(err);
  }
});

export default handler;
