import { useRouter } from "next/router";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

import TranslationGrid from "../../../components/TranslationGrid";
import ChartGrid from "../../../components/ChartGrid";

import LanguageTranslatorV3 from "ibm-watson/language-translator/v3";
import TextToSpeechV1 from "ibm-watson/text-to-speech/v1";
import { IamAuthenticator } from "ibm-watson/auth";
import axios from "axios";
import DatauriParser from "datauri/parser";
// import Rollbar from "rollbar";
import validator from "validator";

import connectToMongo from "../../../database";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    height: "100%",
    flexGrow: 1
  },
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  date: {
    marginLeft: "auto",
    marginRight: "auto"
  },
  progress: {
    display: "flex",
    justifyContent: "center"
  },
  hideChart: {
    visibility: "hidden",
    background: "black"
  }
}));

const Translation = ({ doc, codes }) => {
  const router = useRouter();

  const classes = useStyles();

  // console.log(router);
  // console.log(result);

  var data;
  var date;

  if (doc) {
    data = JSON.parse(doc);
    date = new Date(parseInt(data.date));
  }

  if (router.isFallback) {
    return (
      <div className={classes.root}>
        <Container className={classes.content} maxWidth="md">
          <Typography variant="h5" align="center">
            one moment while I get that for you...
          </Typography>
          <div className={classes.progress}>
            <CircularProgress disableShrink />
          </div>
        </Container>
      </div>
    );
  }

  // return <p>{data.postTrans}</p>;

  return (
    <div className={classes.root}>
      <Container className={classes.content} maxWidth="md">
        <Typography
          className={classes.date}
          variant="caption"
          color="textSecondary"
        >
          first translated: {date.toString()}
        </Typography>
        <Grid
          container
          justify="center"
          alignItems="center"
          alignContent="center"
          spacing={2}
        >
          <TranslationGrid
            beforeTrans={data.en}
            afterTrans={data.es}
            from={codes.from}
            to={codes.to}
          />
          <ChartGrid hide={{ hide: "" }} />
        </Grid>
      </Container>
    </div>
  );
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

  const dev = process.env.NODE_ENV !== "production";

  const baseUrl = dev
    ? "http://localhost:3000"
    : "https://drees1992-mytranslator.herokuapp.com";

  const from = "en";
  const to = "fr";
  const voice = "fr-FR_ReneeVoice";
  const preTrans = context.params.translation;
  const modelId = from + "-" + to;

  const getLang = data => {
    switch (data) {
      case "ar":
        return "Arabic";
      case "zh":
        return "Simplified Chinese";
      case "zh-TW":
        return "Traditional Chinese";
      case "en":
        return "English";
      case "fi":
        return "Finnish";
      case "fr":
        return "French";
      case "de":
        return "German";
      case "it":
        return "Italian";
      case "ja":
        return "Japanese";
      case "ko":
        return "Korean";
      case "pt":
        return "Portuguese";
      case "ro":
        return "Romanian";
      case "ru":
        return "Russian";
      case "sk":
        return "Slovak";
      case "es":
        return "Spanish";
      case "sv":
        return "Swedish";
      case "th":
        return "Thai";
      case "tr":
        return "Turkish";
      case "vi":
        return "Vietnamese";
    }
  };

  const doc = await Translations.findOne({ [from]: preTrans });

  // if (validator.isEmpty(translateParams.text)) {
  //   throw new Error("Please include some text to translate");
  // }

  if (!doc) {
    const entry = new Translations({
      [from]: preTrans,
      [to]: "temp",
      hitData: [
        { time: 0, hits: 0 },
        { time: 0, hits: 0 }
      ],
      lifetimeHits: 0,
      date: new Date().getTime()
    });
    await entry.save();
    connection.close();
    return { props: { doc: null, codes: null } };
  }

  if (doc[to] === "temp") {
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

    const textToSpeech = new TextToSpeechV1({
      authenticator: new IamAuthenticator({
        apikey: process.env.SPEAK_KEY
      }),
      url: process.env.SPEAK_URL,
      headers: {
        "X-Watson-Learning-Opt-Out": "true"
      }
    });

    const translateParams = {
      text: preTrans,
      modelId: modelId
    };

    const translationResult = await languageTranslator.translate(
      translateParams
    );
    const result = translationResult.result.translations[0].translation;

    const synthesizeParams = {
      text: result,
      accept: "audio/mp3",
      voice
    };

    const config = {
      responseType: "arraybuffer"
    };

    const body = synthesizeParams;

    const res = await axios.post(
      baseUrl + "/api/translator/speak",
      body,
      config
    );

    const audio = res.data;

    const parser = new DatauriParser();

    const audioDataUri = parser.format("audio/webm", audio);

    const transDoc = await Translations.findOneAndUpdate(
      { [from]: preTrans },
      { [to]: result.toLowerCase(), audio: { [to]: [audioDataUri.content] } },
      { new: true, useFindAndModify: false }
    );

    connection.close();

    return {
      props: {
        doc: JSON.stringify(transDoc),
        codes: { from: getLang(from), to: getLang(to) }
      }
    };
  }

  connection.close();

  return {
    props: {
      doc: JSON.stringify(doc),
      codes: { from: getLang(from), to: getLang(to) }
    }
  };
}

export async function getStaticPaths() {
  return {
    paths: [{ params: { translation: "welcome" } }],
    fallback: true
  };
}

// Navbar.propTypes = {
//   rollbar: PropTypes.object.isRequired
// };

export default Translation;
