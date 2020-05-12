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
  hitData: [
    {
      time: { type: Number, required: true },
      hits: {
        type: Number,
        required: true
      }
    }
  ],
  lifetimeHits: {
    type: Number,
    required: false
  },
  date: {
    type: String,
    required: true
  }
});

export default TranslationsSchema;
