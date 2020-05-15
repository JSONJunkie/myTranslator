import mongoose from "mongoose";

const TranslationsSchema = new mongoose.Schema({
  "ar-en": {
    type: String,
    required: false
  },
  "zh-en": {
    type: String,
    required: false
  },
  "zh-TW-en": {
    type: String,
    required: false
  },
  "fi-en": {
    type: String,
    required: false
  },
  "fr-en": {
    type: String,
    required: false
  },
  "fr-de": {
    type: String,
    required: false
  },
  "fr-es": {
    type: String,
    required: false
  },
  "de-en": {
    type: String,
    required: false
  },
  "de-fr": {
    type: String,
    required: false
  },
  "de-it": {
    type: String,
    required: false
  },
  "it-en": {
    type: String,
    required: false
  },
  "it-de": {
    type: String,
    required: false
  },
  "ja-en": {
    type: String,
    required: false
  },
  "ko-en": {
    type: String,
    required: false
  },
  "pt-en": {
    type: String,
    required: false
  },
  "ro-en": {
    type: String,
    required: false
  },
  "ru-en": {
    type: String,
    required: false
  },
  "sk-en": {
    type: String,
    required: false
  },
  "es-en": {
    type: String,
    required: false
  },
  "es-fr": {
    type: String,
    required: false
  },
  "sv-en": {
    type: String,
    required: false
  },
  "th-en": {
    type: String,
    required: false
  },
  "tr-en": {
    type: String,
    required: false
  },
  "vi-en": {
    type: String,
    required: false
  },
  "en-ar": {
    type: String,
    required: false
  },
  "en-zh": {
    type: String,
    required: false
  },
  "en-zh-TW": {
    type: String,
    required: false
  },
  "en-fi": {
    type: String,
    required: false
  },
  "en-fr": {
    type: String,
    required: false
  },
  "en-de": {
    type: String,
    required: false
  },
  "en-it": {
    type: String,
    required: false
  },
  "en-ja": {
    type: String,
    required: false
  },
  "en-ko": {
    type: String,
    required: false
  },
  "en-pt": {
    type: String,
    required: false
  },
  "en-ro": {
    type: String,
    required: false
  },
  "en-ru": {
    type: String,
    required: false
  },
  "en-sk": {
    type: String,
    required: false
  },
  "en-es": {
    type: String,
    required: false
  },
  "en-sv": {
    type: String,
    required: false
  },
  "en-th": {
    type: String,
    required: false
  },
  "en-tr": {
    type: String,
    required: false
  },
  "en-vi": {
    type: String,
    required: false
  },
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
    ar: {
      type: Array,
      required: false
    },
    zh: {
      type: Array,
      required: false
    },
    "zh - TW": {
      type: Array,
      required: false
    },
    en: {
      type: Array,
      required: false
    },
    fi: {
      type: Array,
      required: false
    },
    fr: {
      type: Array,
      required: false
    },
    de: {
      type: Array,
      required: false
    },
    it: {
      type: Array,
      required: false
    },
    ja: {
      type: Array,
      required: false
    },
    ko: {
      type: Array,
      required: false
    },
    pt: {
      type: Array,
      required: false
    },
    ro: {
      type: Array,
      required: false
    },
    ru: {
      type: Array,
      required: false
    },
    sk: {
      type: Array,
      required: false
    },
    es: {
      type: Array,
      required: false
    },
    sv: {
      type: Array,
      required: false
    },
    th: {
      type: Array,
      required: false
    },
    tr: {
      type: Array,
      required: false
    },
    vi: {
      type: Array,
      required: false
    }
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
