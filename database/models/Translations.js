import mongoose from "mongoose";

const TranslationsSchema = new mongoose.Schema({
  ar: {
    type: String,
    required: false
  },
  zh: {
    type: String,
    required: false
  },
  "zh - TW": {
    type: String,
    required: false
  },
  en: {
    type: String,
    required: false
  },
  fi: {
    type: String,
    required: false
  },
  fr: {
    type: String,
    required: false
  },
  de: {
    type: String,
    required: false
  },
  it: {
    type: String,
    required: false
  },
  ja: {
    type: String,
    required: false
  },
  ko: {
    type: String,
    required: false
  },
  pt: {
    type: String,
    required: false
  },
  ro: {
    type: String,
    required: false
  },
  ru: {
    type: String,
    required: false
  },
  sk: {
    type: String,
    required: false
  },
  es: {
    type: String,
    required: false
  },
  sv: {
    type: String,
    required: false
  },
  th: {
    type: String,
    required: false
  },
  tr: {
    type: String,
    required: false
  },
  vi: {
    type: String,
    required: false
  },
  audio: {
    type: Buffer,
    required: false
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
