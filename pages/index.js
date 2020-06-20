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

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100%",
    flexGrow: 1,
  },
  content: {
    display: "flex",
    flexDirection: "column",
  },
  loadingContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  date: {
    visibility: "hidden",
    marginLeft: "auto",
    marginRight: "auto",
  },
  progress: {
    display: "flex",
    justifyContent: "center",
  },
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
  const getLang = (data) => {
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
    : "https://jsonj-mytranslator.herokuapp.com";

  const res = await axios.get(
    baseUrl + "/api/data?preTrans=welcome&fromCode=en"
  );

  const now = new Date().getTime();
  const hours = Math.floor((now - res.data.date) / 1000 / 60 / 60) + 1;

  if (res.data.hitData.length < 23) {
    const lastEntry = res.data.hitData[res.data.hitData.length - 1];

    res.data.hitData.pop();

    if (lastEntry.time === hours) {
      res.data.hitData.push(lastEntry);
    } else {
      if (hours - lastEntry.time > 1) {
        res.data.hitData.push(lastEntry);
        const noHitHours = hours - lastEntry.time;
        if (noHitHours < 23) {
          for (var i = 1; i < noHitHours; i++) {
            res.data.hitData.push({
              time: lastEntry.time + i,
              hits: 0,
            });
          }
          res.data.hitData.shift();
          res.data.hitData.push({
            time: hours,
            hits: 0,
          });
        }

        if (noHitHours >= 23) {
          for (var i = 0; i < 23; i++) {
            res.data.hitData[i] = { time: hours - 23 + i, hits: 0 };
          }
          res.data.hitData.push({
            time: hours,
            hits: 0,
          });
        }
      } else {
        res.data.hitData.push(lastEntry);

        res.data.hitData.push({
          time: hours,
          hits: 0,
        });
      }
    }
  }

  if (res.data.hitData.length >= 23) {
    const reversedData = res.data.hitData.reverse();

    reversedData.pop();

    const newData = reversedData.reverse();

    const lastEntry = newData[newData.length - 1];

    newData.pop();

    if (lastEntry.time === hours) {
      newData.push(lastEntry);
    } else {
      if (hours - lastEntry.time > 1) {
        newData.push(lastEntry);
        const noHitHours = hours - lastEntry.time;
        if (noHitHours < 23) {
          for (var i = 1; i < noHitHours; i++) {
            newData.shift();
            newData.push({
              time: lastEntry.time + i,
              hits: 0,
            });
          }
          newData.shift();
          newData.push({
            time: hours,
            hits: 0,
          });
        }

        if (noHitHours >= 23) {
          for (var i = 0; i < 23; i++) {
            newData[i] = { time: hours - 23 + i, hits: 0 };
          }
          newData.push({
            time: hours,
            hits: 0,
          });
        }
      } else {
        newData.push(lastEntry);

        newData.push({
          time: hours,
          hits: 0,
        });
      }
      res.data.hitData = newData;
    }
  }
  res.data.hitData.unshift({ mostHits: res.data.mostHits });

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
        to: getLang(key),
      });
    }
  }

  const newHitData = [...res.data.hitData, { mostHits: res.data.mostHits }];

  const data = {
    preTrans: res.data.en.text,
    postTrans: res.data.es.text,
    chartData: newHitData,
    audio: res.data.es.audio,
    otherTrans,
  };

  return {
    props: { data },
  };
}

// Index.propTypes = {
//   rollbar: PropTypes.object.isRequired
// };

const mapStateToProps = (state) => ({
  translations: state.translations,
});

export default connect(mapStateToProps)(Index);
