import mongoose from "mongoose";
import nextConnect from "next-connect";

import TranslationsSchema from "./models/Translations";

const connectToMongo = async () => {
  const connection = await mongoose.createConnection(process.env.MONGO, {
    useNewUrlParser: true,
    bufferCommands: false,
    bufferMaxEntries: 0,
    useUnifiedTopology: true
  });

  const Translations = connection.model("translations", TranslationsSchema);
  return {
    connection,
    models: {
      Translations
    }
  };
};

async function database(req, res, next) {
  const { connection, models } = await connectToMongo();
  req.connection = connection;
  req.models = models;
  return next();
}

export const middleware = nextConnect();

middleware.use(database);

export default connectToMongo;
