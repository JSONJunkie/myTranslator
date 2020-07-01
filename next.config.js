require("dotenv").config();

module.exports = {
  assetPrefix: process.env.BASE_PATH || "",
  publicRuntimeConfig: {
    basePath: process.env.BASE_PATH || "",
  },
  env: {
    TRANSLATE_KEY: process.env.TRANSLATE_KEY,
    TRANSLATE_URL: process.env.TRANSLATE_URL,
    SPEAK_KEY: process.env.SPEAK_KEY,
    SPEAK_URL: process.env.SPEAK_URL,
    LISTEN_KEY: process.env.LISTEN_KEY,
    LISTEN_URL: process.env.LISTEN_URL,
    MONGO: process.env.MONGO,
    PROD_BASE_URL: process.env.PROD_BASE_URL,
    BASE_PATH: process.env.BASE_PATH,
  },
};
