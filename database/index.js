import mongoose from "mongoose";

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

export default connectToMongo;
