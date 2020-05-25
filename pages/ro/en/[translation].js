import { useRouter } from "next/router";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

import TranslationGrid from "../../../components/TranslationGrid";
import ChartGrid from "../../../components/ChartGrid";
import OtherTranslations from "../../../components/OtherTranslations";
import Footer from "../../../components/Footer";

import LanguageTranslatorV3 from "ibm-watson/language-translator/v3";
import TextToSpeechV1 from "ibm-watson/text-to-speech/v1";
import { IamAuthenticator } from "ibm-watson/auth";
import axios from "axios";
import DatauriParser from "datauri/parser";
// import Rollbar from "rollbar";
import isAlpha from "validator/lib/isAlpha";

import connectToMongo from "../../../database";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    height: "100%",
    flexGrow: 1
  },
  hiddenDate: {
    visibility: "hidden",
    marginLeft: "auto",
    marginRight: "auto"
  },
  content: {
    display: "flex",
    flexDirection: "column"
  },
  loadingContent: {
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

const Translation = ({ data, codes }) => {
  const router = useRouter();

  const classes = useStyles();

  if (router.isFallback) {
    return (
      <div className={classes.root}>
        <Container className={classes.contentTyping} maxWidth="md">
          <Typography
            className={classes.hiddenDate}
            variant="caption"
            color="textSecondary"
          >
            first translated
          </Typography>
          <Grid
            container
            direction="row"
            // justify="flex-end"
            // alignItems="center"
            // alignContent="center"
            spacing={2}
          >
            <TranslationGrid
              beforeTrans={""}
              afterTrans={""}
              from={""}
              to={""}
              speak={"none"}
            />
            <ChartGrid hide={{ hide: true }} />
            <OtherTranslations otherTrans={[]} loading={true} />
          </Grid>
          <Footer />
        </Container>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <Container className={classes.content} maxWidth="md">
        <Typography
          className={classes.date}
          variant="caption"
          color="textSecondary"
        >
          first translated: {new Date(parseInt(data.date)).toString()}
        </Typography>
        <Grid
          container
          justify="center"
          alignItems="center"
          alignContent="center"
          spacing={2}
        >
          <TranslationGrid
            beforeTrans={data.from}
            afterTrans={data.to}
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

  const getLang = data => {
    switch (data) {
      case "ar":
        return "Arabic";
      case "zh":
        return "Chinese";
      case "zh-TW":
        return "Chinese";
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

  const getLocale = data => {
    switch (data) {
      case "ar":
        return "ar";
      case "zh":
        return "";
      case "zh-TW":
        return "";
      case "en":
        return "en-US";
      case "fi":
        return "";
      case "fr":
        return "fr-FR";
      case "de":
        return "de-DE";
      case "it":
        return "it-IT";
      case "ja":
        return "";
      case "ko":
        return "";
      case "pt":
        return "pt-BR";
      case "ro":
        return "";
      case "ru":
        return "ru-RU";
      case "sk":
        return "sk-SK";
      case "es":
        return "es-ES";
      case "sv":
        return "sv-SE";
      case "th":
        return "";
      case "tr":
        return "tr-TR";
      case "vi":
        return "";
    }
  };

  const getVoice = data => {
    switch (data) {
      case "ar":
        return "ar-AR_OmarVoice";
      case "zh":
        return "zh-CN_LiNaVoice";
      case "zh-TW":
        return "zh-CN_LiNaVoice";
      case "en":
        return "en-US_AllisonVoice";
      case "fi":
        return "none";
      case "fr":
        return "fr-FR_ReneeVoice";
      case "de":
        return "de-DE_BirgitVoice";
      case "it":
        return "it-IT_FrancescaVoice";
      case "ja":
        return "ja-JP_EmiVoice";
      case "ko":
        return "ko-KR_YoungmiVoice";
      case "pt":
        return "pt-BR_IsabelaVoice";
      case "ro":
        return "none";
      case "ru":
        return "none";
      case "sk":
        return "none";
      case "es":
        return "es-ES_EnriqueVoice";
      case "sv":
        return "none";
      case "th":
        return "none";
      case "tr":
        return "none";
      case "vi":
        return "none";
    }
  };

  const { connection, models } = await connectToMongo();
  const { Translations } = models;

  const dev = process.env.NODE_ENV !== "production";

  const baseUrl = dev
    ? "http://localhost:3000"
    : "https://drees1992-mytranslator.herokuapp.com";

  const preTrans = context.params.translation;
  const from = "ro";
  const to = "en";
  const fromText = from + ".text";
  const toText = to + ".text";
  const voice = getVoice(to);
  const locale = getLocale(from);
  // const voice = "es-ES_LauraVoice";

  const modelId = from + "-" + to;
  if (!preTrans) {
    throw new Error("Please enter a word to translate");
  }

  if (locale) {
    if (!isAlpha(preTrans, locale)) {
      throw new Error(
        "Looks like this is not a translatable " +
          from +
          " word. Please only include " +
          from +
          " letters only, no punctuations or numbers"
      );
    }
  }

  const doc = await Translations.findOne({ [fromText]: preTrans });

  // if (validator.isEmpty(translateParams.text)) {
  //   throw new Error("Please include some text to translate");
  // }

  if (!doc) {
    const anyDoc = await Translations.findOne({}, {}, { lean: true });

    if (!anyDoc) {
      const entry = new Translations({
        [fromText]: preTrans,
        hitData: [
          { time: 0, hits: 0 },
          { time: 0, hits: 0 }
        ],
        lifetimeHits: 0,
        date: new Date().getTime()
      });
      await entry.save();
      connection.close();
      return { props: { data: null, codes: null } };
    }

    const entry = new Translations({
      [fromText]: preTrans,
      hitData: [
        { time: 0, hits: 0 },
        { time: 0, hits: 0 }
      ],
      lifetimeHits: 0,
      date: anyDoc.date
    });
    await entry.save();
    connection.close();
    return { props: { data: null, codes: null } };
  }

  if (!doc[to].text) {
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
      modelId: modelId
    };

    const translationResult = await languageTranslator.translate(
      translateParams
    );
    const result = translationResult.result.translations[0].translation;

    if (voice !== "none") {
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
        { [fromText]: preTrans },
        {
          [to]: { text: result.toLowerCase(), audio: [audioDataUri.content] }
        },
        { new: true, useFindAndModify: false }
      );

      const data = {
        from: transDoc[from].text,
        to: transDoc[to].text,
        date: transDoc.date
      };

      const codes = {
        from: getLang(from),
        to: getLang(to)
      };

      connection.close();

      return {
        props: {
          data,
          codes
        }
      };
    }

    const transDoc = await Translations.findOneAndUpdate(
      { [fromText]: preTrans },
      { [toText]: result.toLowerCase() },
      { new: true, useFindAndModify: false }
    );

    const data = {
      from: transDoc[from].text,
      to: transDoc[to].text,
      date: transDoc.date
    };

    const codes = {
      from: getLang(from),
      to: getLang(to)
    };

    connection.close();

    return {
      props: {
        data,
        codes
      }
    };
  }

  const data = {
    from: doc[from].text,
    to: doc[to].text,
    date: doc.date
  };

  const codes = {
    from: getLang(from),
    to: getLang(to)
  };

  connection.close();

  return {
    props: {
      data,
      codes
    }
  };
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

export default Translation;
