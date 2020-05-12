import { useRouter } from "next/router";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

import TranslationGrid from "../components/TranslationGrid";
import ChartGrid from "../components/ChartGrid";

import LanguageTranslatorV3 from "ibm-watson/language-translator/v3";
import { IamAuthenticator } from "ibm-watson/auth";
// import Rollbar from "rollbar";
import validator from "validator";

import connectToMongo from "../database";

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

const Translation = ({ doc }) => {
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
            beforeTrans={data.preTrans}
            afterTrans={data.postTrans}
            from={"english"}
            to={"spanish"}
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
  console.log(context);

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
      hitData: [
        { time: 0, hits: 0 },
        { time: 0, hits: 0 }
      ],
      lifetimeHits: 0,
      date: new Date().getTime()
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

export default Translation;
