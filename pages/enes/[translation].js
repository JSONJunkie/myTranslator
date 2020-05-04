import { useRouter } from "next/router";

import LanguageTranslatorV3 from "ibm-watson/language-translator/v3";
import { IamAuthenticator } from "ibm-watson/auth";
// import Rollbar from "rollbar";
import validator from "validator";

const Post = ({ result }) => {
  const router = useRouter();
  console.log(router);
  const { translation } = router.query;

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <p>
      Before:{translation} After:{result}
    </p>
  );
};

export async function getStaticProps({ query }) {
  // const rollbar = new Rollbar({
  //   // accessToken: process.env.ROLLBAR_SERVER_TOKEN,
  //   captureUncaught: true,
  //   captureUnhandledRejections: true
  // });
  console.log(query);

  // const languageTranslator = new LanguageTranslatorV3({
  //   version: "2018-05-01",
  //   authenticator: new IamAuthenticator({
  //     apikey: process.env.TRANSLATE_KEY
  //   }),
  //   url: process.env.TRANSLATE_URL,
  //   headers: {
  //     "X-Watson-Learning-Opt-Out": "true"
  //   }
  // });

  // const translateParams = {
  //   text: context.params.translation,
  //   modelId: "en-es"
  // };

  // if (validator.isEmpty(translateParams.text)) {
  //   throw new Error("Please include some text to translate");
  // }

  // const translationResult = await languageTranslator.translate(translateParams);
  // const result = translationResult.result.translations[0].translation;

  return { props: {} };
}

export async function getStaticPaths() {
  return {
    paths: [{ params: { translation: "hello" } }],
    fallback: false
  };
}

export default Post;
