import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Grow from "@material-ui/core/Grow";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

import TranslationGrid from "../components/TranslationGrid";
import ChartGrid from "../components/ChartGrid";
import Footer from "../components/Footer";

import axios from "axios";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    height: "100%",
    flexGrow: 1
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
    visibility: "hidden",
    marginLeft: "auto",
    marginRight: "auto"
  },
  progress: {
    display: "flex",
    justifyContent: "center"
  }
}));

const Index = ({ data }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Container className={classes.content} maxWidth="md">
        <Typography
          className={classes.date}
          variant="caption"
          color="textSecondary"
        >
          first translated
        </Typography>
        <Grid
          container
          direction="row"
          // justify="center"
          // alignItems="center"
          // alignContent="center"
          spacing={2}
        >
          <TranslationGrid
            beforeTrans={data.preTrans}
            afterTrans={data.postTrans}
            from={"English"}
            to={"Spanish"}
          />
          <ChartGrid hide={{ hide: false }} indexData={data.chartData} />
        </Grid>
        <Footer />
      </Container>
    </div>
  );
};

export async function getServerSideProps() {
  const getLang = data => {
    switch (data) {
      case "":
        return "...";
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

  const dev = process.env.NODE_ENV !== "production";

  const baseUrl = dev
    ? "http://localhost:3000"
    : "https://drees1992-mytranslator.herokuapp.com";

  const res = await axios.get(
    baseUrl + "/api/data?preTrans=welcome&fromCode=en"
  );

  var otherTrans = [];

  for (var key of Object.keys(res.data)) {
    if (
      res.data[key].text &&
      key !== "es" &&
      res.data[key].text !== "welcome"
    ) {
      otherTrans.push({
        text: res.data[key].text,
        audio: res.data[key].audio,
        to: getLang(key)
      });
    }
  }

  const newHitData = [...res.data.hitData, { mostHits: res.data.mostHits }];

  const data = {
    preTrans: res.data.en.text,
    postTrans: res.data.es.text,
    chartData: newHitData,
    audio: res.data.es.audio,
    otherTrans
  };

  return {
    props: { data }
  };
}

// Index.propTypes = {
//   rollbar: PropTypes.object.isRequired
// };

const mapStateToProps = state => ({
  translations: state.translations
});

export default connect(mapStateToProps)(Index);
