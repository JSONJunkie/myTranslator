import { useRouter } from "next/router";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";

import LanguageTranslatorV3 from "ibm-watson/language-translator/v3";
import { IamAuthenticator } from "ibm-watson/auth";
// import Rollbar from "rollbar";
import validator from "validator";

import connectToMongo from "../../database";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    height: "100%",
    flexGrow: 1
  },
  content: {
    display: "flex"
  },
  cardRoot: {
    width: 360
  },
  title: {
    fontSize: 50
  },
  translation: {
    fontSize: 30
  },
  hidden: {
    fontSize: 30,
    visibility: "hidden"
  },
  pos: {
    marginBottom: 12
  },
  wrapper: {
    position: "relative"
  },
  progress: {
    position: "absolute",
    top: "50%",
    left: "47%",
    marginTop: -30,
    marginLeft: -12
  },
  chartProgress: {
    position: "absolute",
    top: "10%",
    left: "47%",
    marginTop: 100,
    marginLeft: -12
  },
  chart: {
    height: 240,
    width: 340,
    margin: "auto"
  },
  cardGrid: {
    maxWidth: 360
  },
  cardRoot: {
    width: "100%",
    height: "100%"
  }
}));

const Enes = ({ doc }) => {
  const router = useRouter();

  const classes = useStyles();

  // console.log(router);
  // console.log(result);

  var data;

  if (doc) {
    data = JSON.parse(doc);
  }

  if (router.isFallback) {
    const text = "one moment while I get that for you...";
    return (
      <div className={classes.root}>
        <Container className={classes.content} maxWidth="md">
          <Grid
            container
            justify="center"
            alignItems="center"
            alignContent="center"
            spacing={2}
          >
            <Grid className={classes.cardGrid} item xs={12} sm={6}>
              <Card className={classes.cardRoot}>
                <CardContent>
                  {text.split("\n").map((i, key) => {
                    return (
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                        key={key}
                        paragraph
                      >
                        {i}
                      </Typography>
                    );
                  })}
                  <Divider />
                  <Typography className={classes.pos} color="textSecondary">
                    translating from english to spanish...
                  </Typography>
                  <div className={classes.wrapper}>
                    <Typography
                      className={classes.hidden}
                      variant="body2"
                      component="p"
                    >
                      Bienvenida
                    </Typography>
                    <CircularProgress
                      disableShrink
                      className={classes.progress}
                    />
                    <Typography
                      className={classes.caption}
                      variant="caption"
                      color="textSecondary"
                    >
                      hit "enter" or the translate button to translate
                    </Typography>
                  </div>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper className={classes.chart}>
                <div className={classes.wrapper}>
                  <CircularProgress
                    disableShrink
                    className={classes.chartProgress}
                  />
                </div>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </div>
    );
  }

  // return <p>{data.postTrans}</p>;

  return (
    <div className={classes.root}>
      <Container className={classes.content} maxWidth="md">
        <Grid
          container
          justify="center"
          alignItems="center"
          alignContent="center"
          spacing={2}
        >
          <Grid item className={classes.cardGrid} xs={12} sm={6}>
            <Card className={classes.cardRoot}>
              <CardContent>
                {data.preTrans.split("\n").map((i, key) => {
                  return (
                    <Typography
                      className={classes.title}
                      color="textSecondary"
                      gutterBottom
                      key={key}
                      paragraph
                    >
                      {i}
                    </Typography>
                  );
                })}
                <Divider />
                <Typography className={classes.pos} color="textSecondary">
                  translating from english to spanish...
                </Typography>
                {/* <div className={classes.wrapper}> */}
                {data.postTrans.split("\n").map((i, key) => {
                  return (
                    <Typography
                      className={classes.translation}
                      variant="body2"
                      component="p"
                      gutterBottom
                      key={key}
                      paragraph
                    >
                      {i}
                    </Typography>
                  );
                })}
                {/* <CircularProgress disableShrink className={classes.progress} /> */}
                {/* </div> */}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper className={classes.chart}>
              <div className={classes.wrapper}>
                <CircularProgress
                  disableShrink
                  className={classes.chartProgress}
                />
              </div>
            </Paper>
          </Grid>
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
  const preTrans = context.params.translation;

  const doc = await Translations.findOne({ preTrans });

  // if (validator.isEmpty(translateParams.text)) {
  //   throw new Error("Please include some text to translate");
  // }

  if (!doc) {
    const entry = new Translations({
      preTrans,
      postTrans: "temp",
      hits: 1,
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
