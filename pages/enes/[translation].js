import { useRouter } from "next/router";

import LanguageTranslatorV3 from "ibm-watson/language-translator/v3";
import { IamAuthenticator } from "ibm-watson/auth";
// import Rollbar from "rollbar";
import validator from "validator";

import connectToMongo from "../../database";

const Enes = ({ docs }) => {
  const router = useRouter();
  // console.log(router);
  // console.log(result);

  var data;

  if (docs) {
    data = JSON.parse(docs);
  }

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return <p>{data.postTrans}</p>;
};

export async function getStaticProps(context) {
  // const rollbar = new Rollbar({
  //   // accessToken: process.env.ROLLBAR_SERVER_TOKEN,
  //   captureUncaught: true,
  //   captureUnhandledRejections: true
  // });

  // if (validator.isEmpty(context.params.id)) {
  //   console.log("empty params/query");
  //   throw new Error("No query");
  // }

  const { connection, models } = await connectToMongo();
  const { Translations } = models;
  const preTrans = context.params.translation;

  const docs = await Translations.find({ preTrans });

  // if (validator.isEmpty(translateParams.text)) {
  //   throw new Error("Please include some text to translate");
  // }

  if (docs.length === 0) {
    // console.log("no docs");

    const entry = new Translations({
      preTrans,
      postTrans: "temp",
      date: new Date()
    });
    await entry.save();
    connection.close();
    return { props: { docs: null } };
  }

  // console.log("docs found");
  // console.log("translating");

  const languageTranslator = new LanguageTranslatorV3({
    version: "2018-05-01",
    authenticator: new IamAuthenticator({
      apikey: process.env.TRANSLATE_KEY
    }),
    url: process.env.TRANSLATE_URL,
    headers: {
      "X-Watson-Learning-Opt-Out": "true"
    }
  });

  const translateParams = {
    text: preTrans,
    modelId: "en-es"
  };

  const translationResult = await languageTranslator.translate(translateParams);
  const result = translationResult.result.translations[0].translation;

  // console.log("updating");

  const transDoc = await Translations.findOneAndUpdate(
    { preTrans },
    { postTrans: result },
    { new: true }
  );

  // console.log(transDoc);

  connection.close();

  return { props: { docs: JSON.stringify(transDoc) } };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true
  };
}

export default Enes;
