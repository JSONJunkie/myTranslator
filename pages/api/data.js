import nextConnect from "next-connect";

import { middleware } from "../../database";

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
  try {
    const preTrans = req.query.preTrans;
    const from = req.query.fromCode + ".text";
    const { Translations } = req.models;
    const doc = await Translations.findOne(
      { [from]: preTrans },
      {},
      { lean: true }
    );
    if (doc) {
      const popularDoc = await Translations.find(
        {},
        {},
        {
          lean: true,
          sort: { lifetimeHits: -1 },
          limit: 1
        }
      );

      const newDoc = { ...doc, mostHits: popularDoc[0].lifetimeHits };

      res.json(newDoc);
      req.connection.close();
      return;
    }
    res.json(doc);
    req.connection.close();
    // const minutes = (d - doc.date) / 1000 / 60;

    // if (doc.hitData.length < 100) {
    //   doc.hitData.push({
    //     time: minutes,
    //     hits: doc.hitData[doc.hitData.length - 1].hits + 1
    //   });
    //   const updatedDoc = await Translations.findOneAndUpdate(
    //     { preTrans },
    //     { hitData: doc.hitData },
    //     {
    //       new: true,
    //       useFindAndModify: false
    //     }
    //   );
    //   res.json(updatedDoc);
    //   req.connection.close();
    // }

    // if (doc.hitData.length >= 100) {
    //   const reversedData = doc.hitData.reverse();
    //   reversedData.pop();
    //   const newData = reversedData.reverse();
    //   newData.push({
    //     time: minutes,
    //     hits: doc.hitData[doc.hitData.length - 1].hits + 1
    //   });
    //   const updatedDoc = await Translations.findOneAndUpdate(
    //     { preTrans },
    //     { hitData: newData },
    //     {
    //       new: true,
    //       useFindAndModify: false
    //     }
    //   );
    //   res.json(updatedDoc);
    //   req.connection.close();
    // }
  } catch (err) {
    console.log(err);
    req.connection.close();

    // res.status(400).json({ errors: { name: err.name, message: err.message } });
    // rollbar.error(err);
  }
});

export default handler;
