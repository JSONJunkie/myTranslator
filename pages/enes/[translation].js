import { useRouter } from "next/router";

import LanguageTranslatorV3 from "ibm-watson/language-translator/v3";
import { IamAuthenticator } from "ibm-watson/auth";
// import Rollbar from "rollbar";
import validator from "validator";

import connectToMongo from "../../database";

const Enes = ({ doc }) => {
  const router = useRouter();
  // console.log(router);
  // console.log(result);

  var data;

  if (doc) {
    data = JSON.parse(doc);
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

  const doc = await Translations.findOne({ preTrans });

  // if (validator.isEmpty(translateParams.text)) {
  //   throw new Error("Please include some text to translate");
  // }

  if (!doc) {
    const entry = new Translations({
      preTrans,
      postTrans: "temp",
      date: new Date()
    });
    await entry.save();
    connection.close();
    return { props: { doc: null } };
  }

  if (doc.postTrans === "temp") {
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

    const translationResult = await languageTranslator.translate(
      translateParams
    );
    const result = translationResult.result.translations[0].translation;

    const transDoc = await Translations.findOneAndUpdate(
      { preTrans },
      { postTrans: result.toLowerCase() },
      { new: true, useFindAndModify: false }
    );

    connection.close();

    return { props: { doc: JSON.stringify(transDoc) } };
  }

  connection.close();

  return { props: { doc: JSON.stringify(doc) } };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true
  };
}

// Navbar.propTypes = {
//   rollbar: PropTypes.object.isRequired
// };

export default Enes;
