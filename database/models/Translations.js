import mongoose from "mongoose";

const TranslationsSchema = new mongoose.Schema({
  preTrans: {
    type: String,
    required: true
  },
  postTrans: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  }
});

export default TranslationsSchema;
