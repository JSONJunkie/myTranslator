import mongoose from "mongoose";

const TranslationsSchema = new mongoose.Schema({
  ar: {
    text: {
      type: String,
      required: false
    },
    audio: {
      type: Array,
      required: false
    }
  },
  zh: {
    text: {
      type: String,
      required: false
    },
    audio: {
      type: Array,
      required: false
    }
  },
  zhTW: {
    text: {
      type: String,
      required: false
    },
    audio: {
      type: Array,
      required: false
    }
  },
  en: {
    text: {
      type: String,
      required: false
    },
    audio: {
      type: Array,
      required: false
    }
  },
  fi: {
    text: {
      type: String,
      required: false
    },
    audio: {
      type: Array,
      required: false
    }
  },
  fr: {
    text: {
      type: String,
      required: false
    },
    audio: {
      type: Array,
      required: false
    }
  },
  de: {
    text: {
      type: String,
      required: false
    },
    audio: {
      type: Array,
      required: false
    }
  },
  it: {
    text: {
      type: String,
      required: false
    },
    audio: {
      type: Array,
      required: false
    }
  },
  ja: {
    text: {
      type: String,
      required: false
    },
    audio: {
      type: Array,
      required: false
    }
  },
  ko: {
    text: {
      type: String,
      required: false
    },
    audio: {
      type: Array,
      required: false
    }
  },
  pt: {
    text: {
      type: String,
      required: false
    },
    audio: {
      type: Array,
      required: false
    }
  },
  ro: {
    text: {
      type: String,
      required: false
    },
    audio: {
      type: Array,
      required: false
    }
  },
  ru: {
    text: {
      type: String,
      required: false
    },
    audio: {
      type: Array,
      required: false
    }
  },
  sk: {
    text: {
      type: String,
      required: false
    },
    audio: {
      type: Array,
      required: false
    }
  },
  es: {
    text: {
      type: String,
      required: false
    },
    audio: {
      type: Array,
      required: false
    }
  },
  sv: {
    text: {
      type: String,
      required: false
    },
    audio: {
      type: Array,
      required: false
    }
  },
  th: {
    text: {
      type: String,
      required: false
    },
    audio: {
      type: Array,
      required: false
    }
  },
  tr: {
    text: {
      type: String,
      required: false
    },
    audio: {
      type: Array,
      required: false
    }
  },
  vi: {
    text: {
      type: String,
      required: false
    },
    audio: {
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
