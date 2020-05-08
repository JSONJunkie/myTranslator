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
    const { Translations } = req.models;
    // console.log(req.body.data.translation);
    const preTrans = req.body.data.translation;
    const doc = await Translations.findOne({ preTrans });
    const updatedDoc = await Translations.findOneAndUpdate(
      { preTrans },
      { hits: doc.hits + 1 },
      { new: true, useFindAndModify: false }
    );
    console.log(updatedDoc);
    res.json(updatedDoc);
    req.connection.close();
  } catch (err) {
    console.log(err);
    req.connection.close();

    // res.status(400).json({ errors: { name: err.name, message: err.message } });
    // rollbar.error(err);
  }
});

export default handler;
