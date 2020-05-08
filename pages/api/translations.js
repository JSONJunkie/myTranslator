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

export default handler;
