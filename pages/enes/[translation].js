import { useRouter } from "next/router";

import LanguageTranslatorV3 from "ibm-watson/language-translator/v3";
import { IamAuthenticator } from "ibm-watson/auth";
// import Rollbar from "rollbar";
import validator from "validator";

const Enes = ({ result }) => {
  const router = useRouter();
  const { translation } = router.query;
  console.log(result);
  if (router.isFallback) {
    console.log("loading");
    return <div>Loading...</div>;
  }

  return (
    <p>
      Before:{translation} After:{result}
    </p>
  );
};

export async function getStaticProps(context) {
  // const rollbar = new Rollbar({
  //   // accessToken: process.env.ROLLBAR_SERVER_TOKEN,
  //   captureUncaught: true,
  //   captureUnhandledRejections: true
  // });
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
    text: context.params.translation,
    modelId: "en-es"
  };

  if (validator.isEmpty(translateParams.text)) {
    throw new Error("Please include some text to translate");
  }

  const translationResult = await languageTranslator.translate(translateParams);
  const result = translationResult.result.translations[0].translation;

  return { props: { result } };
}

export async function getStaticPaths() {
  return {
    paths: [{ params: { translation: "hello" } }],
    fallback: true
  };
}

export default Enes;
