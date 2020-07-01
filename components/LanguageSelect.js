import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { useRouter } from "next/router";

import { selectLang } from src/actions/translations";
import { Fragment } from "react";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  content: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 60
  },
  text: {
    fontSize: 10
  }
}));

const LanguageSelect = ({ selectLang, translations: { fromCode, toCode } }) => {
  const classes = useStyles();

  const router = useRouter();

  const [routing, setRouting] = useState({
    url: "",
    starting: true,
    complete: false
  });

  const handleRouteChangeStart = url => {
    setRouting(prev => ({ ...prev, starting: true, complete: false, url }));
  };

  const handleRouteChangeComplete = url => {
    setRouting(prev => ({ ...prev, starting: false, complete: true }));
  };

  useEffect(() => {
    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    return () => {
      router.events.on("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, []);

  const [toOpen, setToOpen] = React.useState(false);

  const [fromOpen, setFromOpen] = React.useState(false);

  const handleFromChange = e => {
    selectLang({ from: e.target.value, to: toCode });
  };

  const handleToChange = e => {
    selectLang({ from: fromCode, to: e.target.value });
  };

  const handleClose = () => {
    setToOpen(prev => false);
    setFromOpen(prev => false);
  };

  const handleFromOpen = () => {
    setFromOpen(prev => true);
  };

  const handleToOpen = () => {
    setToOpen(prev => true);
  };

  return (
    <div className={classes.root}>
      <Container className={classes.content} maxWidth="md">
        {toCode && (
          <Fragment>
            <FormControl className={classes.formControl}>
              <InputLabel id="from">From</InputLabel>
              <Select
                labelId="from"
                id="from"
                open={fromOpen}
                onClose={handleClose}
                onOpen={handleFromOpen}
                value={fromCode}
                onChange={handleFromChange}
              >
                <MenuItem value="ar" disabled={toCode !== "en"}>
                  Arabic
                </MenuItem>
                <MenuItem value="zh" disabled={toCode !== "en"}>
                  Chinese (simplified)
                </MenuItem>
                <MenuItem value="zh-TW" disabled={toCode !== "en"}>
                  Chinese (traditional)
                </MenuItem>
                <MenuItem value="en" disabled={toCode === "en"}>
                  English
                </MenuItem>
                <MenuItem value="fi" disabled={toCode !== "en"}>
                  Finnish
                </MenuItem>
                <MenuItem
                  value="fr"
                  disabled={
                    toCode === "ar" ||
                    toCode === "zh" ||
                    toCode === "zh-TW" ||
                    toCode === "fi" ||
                    toCode === "fr" ||
                    toCode === "it" ||
                    toCode === "ja" ||
                    toCode === "ko" ||
                    toCode === "pt" ||
                    toCode === "ro" ||
                    toCode === "ru" ||
                    toCode === "sk" ||
                    toCode === "sv" ||
                    toCode === "th" ||
                    toCode === "tr" ||
                    toCode === "vi"
                  }
                >
                  French
                </MenuItem>
                <MenuItem
                  value="de"
                  disabled={
                    toCode === "ar" ||
                    toCode === "zh" ||
                    toCode === "zh-TW" ||
                    toCode === "fi" ||
                    toCode === "de" ||
                    toCode === "es" ||
                    toCode === "ja" ||
                    toCode === "ko" ||
                    toCode === "pt" ||
                    toCode === "ro" ||
                    toCode === "ru" ||
                    toCode === "sk" ||
                    toCode === "sv" ||
                    toCode === "th" ||
                    toCode === "tr" ||
                    toCode === "vi"
                  }
                >
                  German
                </MenuItem>
                <MenuItem
                  value="it"
                  disabled={
                    toCode === "it" ||
                    toCode === "ar" ||
                    toCode === "zh" ||
                    toCode === "zh-TW" ||
                    toCode === "fi" ||
                    toCode === "de" ||
                    toCode === "es" ||
                    toCode === "ja" ||
                    toCode === "ko" ||
                    toCode === "pt" ||
                    toCode === "ro" ||
                    toCode === "ru" ||
                    toCode === "sk" ||
                    toCode === "sv" ||
                    toCode === "th" ||
                    toCode === "tr" ||
                    toCode === "vi"
                  }
                >
                  Italian
                </MenuItem>
                <MenuItem value="ja" disabled={toCode !== "en"}>
                  Japanese
                </MenuItem>
                <MenuItem value="ko" disabled={toCode !== "en"}>
                  Korean
                </MenuItem>
                <MenuItem value="pt" disabled={toCode !== "en"}>
                  Portuguese
                </MenuItem>
                <MenuItem value="ro" disabled={toCode !== "en"}>
                  Romanian
                </MenuItem>
                <MenuItem value="ru" disabled={toCode !== "en"}>
                  Russian
                </MenuItem>
                <MenuItem value="sk" disabled={toCode !== "en"}>
                  Slovak
                </MenuItem>
                <MenuItem
                  value="es"
                  disabled={
                    toCode === "it" ||
                    toCode === "ar" ||
                    toCode === "zh" ||
                    toCode === "zh-TW" ||
                    toCode === "fi" ||
                    toCode === "fr" ||
                    toCode === "es" ||
                    toCode === "ja" ||
                    toCode === "ko" ||
                    toCode === "pt" ||
                    toCode === "ro" ||
                    toCode === "ru" ||
                    toCode === "sk" ||
                    toCode === "sv" ||
                    toCode === "th" ||
                    toCode === "tr" ||
                    toCode === "vi"
                  }
                >
                  Spanish
                </MenuItem>
                <MenuItem value="sv" disabled={toCode !== "en"}>
                  Swedish
                </MenuItem>
                <MenuItem value="th" disabled={toCode !== "en"}>
                  Thai
                </MenuItem>
                <MenuItem value="tr" disabled={toCode !== "en"}>
                  Turkish
                </MenuItem>
                <MenuItem value="vi" disabled={toCode !== "en"}>
                  Vietnamese
                </MenuItem>
              </Select>
            </FormControl>
          </Fragment>
        )}
        {!toCode && (
          <Fragment>
            <FormControl className={classes.formControl}>
              <InputLabel id="from">From</InputLabel>
              <Select
                labelId="from"
                id="from"
                open={fromOpen}
                onClose={handleClose}
                onOpen={handleFromOpen}
                value={fromCode}
                onChange={handleFromChange}
              >
                <MenuItem value="ar">Arabic</MenuItem>
                <MenuItem value="zh">Chinese (simplified)</MenuItem>
                <MenuItem value="zh-TW">Chinese (traditional)</MenuItem>
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="fi">Finnish</MenuItem>
                <MenuItem value="fr">French</MenuItem>
                <MenuItem value="de">German</MenuItem>
                <MenuItem value="it">Italian</MenuItem>
                <MenuItem value="ja">Japanese</MenuItem>
                <MenuItem value="ko">Korean</MenuItem>
                <MenuItem value="pt">Portuguese</MenuItem>
                <MenuItem value="ro">Romanian</MenuItem>
                <MenuItem value="ru">Russian</MenuItem>
                <MenuItem value="sk">Slovak</MenuItem>
                <MenuItem value="es">Spanish</MenuItem>
                <MenuItem value="sv">Swedish</MenuItem>
                <MenuItem value="th">Thai</MenuItem>
                <MenuItem value="tr">Turkish</MenuItem>
                <MenuItem value="vi">Vietnamese</MenuItem>
              </Select>
            </FormControl>
          </Fragment>
        )}
        {fromCode && (
          <Fragment>
            <FormControl className={classes.formControl}>
              <InputLabel id="to">To</InputLabel>
              <Select
                labelId="to"
                id="to"
                open={toOpen}
                onClose={handleClose}
                onOpen={handleToOpen}
                value={toCode}
                onChange={handleToChange}
              >
                <MenuItem value="">
                  <em className={classes.text}>None</em>
                </MenuItem>
                <MenuItem value="ar" disabled={fromCode !== "en"}>
                  Arabic
                </MenuItem>
                <MenuItem value="zh" disabled={fromCode !== "en"}>
                  Chinese (simplified)
                </MenuItem>
                <MenuItem value="zh-TW" disabled={fromCode !== "en"}>
                  Chinese (traditional)
                </MenuItem>
                <MenuItem value="en" disabled={fromCode === "en"}>
                  English
                </MenuItem>
                <MenuItem value="fi" disabled={fromCode !== "en"}>
                  Finnish
                </MenuItem>
                <MenuItem
                  value="fr"
                  disabled={
                    fromCode === "ar" ||
                    fromCode === "zh" ||
                    fromCode === "zh-TW" ||
                    fromCode === "fi" ||
                    fromCode === "fr" ||
                    fromCode === "it" ||
                    fromCode === "ja" ||
                    fromCode === "ko" ||
                    fromCode === "pt" ||
                    fromCode === "ro" ||
                    fromCode === "ru" ||
                    fromCode === "sk" ||
                    fromCode === "sv" ||
                    fromCode === "th" ||
                    fromCode === "tr" ||
                    fromCode === "vi"
                  }
                >
                  French
                </MenuItem>
                <MenuItem
                  value="de"
                  disabled={
                    fromCode === "ar" ||
                    fromCode === "zh" ||
                    fromCode === "zh-TW" ||
                    fromCode === "fi" ||
                    fromCode === "de" ||
                    fromCode === "es" ||
                    fromCode === "ja" ||
                    fromCode === "ko" ||
                    fromCode === "pt" ||
                    fromCode === "ro" ||
                    fromCode === "ru" ||
                    fromCode === "sk" ||
                    fromCode === "sv" ||
                    fromCode === "th" ||
                    fromCode === "tr" ||
                    fromCode === "vi"
                  }
                >
                  German
                </MenuItem>
                <MenuItem
                  value="it"
                  disabled={
                    fromCode === "it" ||
                    fromCode === "ar" ||
                    fromCode === "zh" ||
                    fromCode === "zh-TW" ||
                    fromCode === "fi" ||
                    fromCode === "de" ||
                    fromCode === "es" ||
                    fromCode === "ja" ||
                    fromCode === "ko" ||
                    fromCode === "pt" ||
                    fromCode === "ro" ||
                    fromCode === "ru" ||
                    fromCode === "sk" ||
                    fromCode === "sv" ||
                    fromCode === "th" ||
                    fromCode === "tr" ||
                    fromCode === "vi"
                  }
                >
                  Italian
                </MenuItem>
                <MenuItem value="ja" disabled={fromCode !== "en"}>
                  Japanese
                </MenuItem>
                <MenuItem value="ko" disabled={fromCode !== "en"}>
                  Korean
                </MenuItem>
                <MenuItem value="pt" disabled={fromCode !== "en"}>
                  Portuguese
                </MenuItem>
                <MenuItem value="ro" disabled={fromCode !== "en"}>
                  Romanian
                </MenuItem>
                <MenuItem value="ru" disabled={fromCode !== "en"}>
                  Russian
                </MenuItem>
                <MenuItem value="sk" disabled={fromCode !== "en"}>
                  Slovak
                </MenuItem>
                <MenuItem
                  value="es"
                  disabled={
                    fromCode === "it" ||
                    fromCode === "ar" ||
                    fromCode === "zh" ||
                    fromCode === "zh-TW" ||
                    fromCode === "fi" ||
                    fromCode === "fr" ||
                    fromCode === "es" ||
                    fromCode === "ja" ||
                    fromCode === "ko" ||
                    fromCode === "pt" ||
                    fromCode === "ro" ||
                    fromCode === "ru" ||
                    fromCode === "sk" ||
                    fromCode === "sv" ||
                    fromCode === "th" ||
                    fromCode === "tr" ||
                    fromCode === "vi"
                  }
                >
                  Spanish
                </MenuItem>
                <MenuItem value="sv" disabled={fromCode !== "en"}>
                  Swedish
                </MenuItem>
                <MenuItem value="th" disabled={fromCode !== "en"}>
                  Thai
                </MenuItem>
                <MenuItem value="tr" disabled={fromCode !== "en"}>
                  Turkish
                </MenuItem>
                <MenuItem value="vi" disabled={fromCode !== "en"}>
                  Vietnamese
                </MenuItem>
              </Select>
            </FormControl>
          </Fragment>
        )}
        {!fromCode && (
          <Fragment>
            <FormControl className={classes.formControl}>
              <InputLabel id="to">To</InputLabel>
              <Select
                labelId="to"
                id="to"
                open={toOpen}
                onClose={handleClose}
                onOpen={handleToOpen}
                value={toCode}
                onChange={handleToChange}
              >
                <MenuItem value="">
                  <em className={classes.text}>None</em>
                </MenuItem>
                <MenuItem value="ar">Arabic</MenuItem>
                <MenuItem value="zh">Chinese (simplified)</MenuItem>
                <MenuItem value="zh-TW">Chinese (traditional)</MenuItem>
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="fi">Finnish</MenuItem>
                <MenuItem value="fr">French</MenuItem>
                <MenuItem value="de">German</MenuItem>
                <MenuItem value="it">Italian</MenuItem>
                <MenuItem value="ja">Japanese</MenuItem>
                <MenuItem value="ko">Korean</MenuItem>
                <MenuItem value="pt">Portuguese</MenuItem>
                <MenuItem value="ro">Romanian</MenuItem>
                <MenuItem value="ru">Russian</MenuItem>
                <MenuItem value="sk">Slovak</MenuItem>
                <MenuItem value="es">Spanish</MenuItem>
                <MenuItem value="sv">Swedish</MenuItem>
                <MenuItem value="th">Thai</MenuItem>
                <MenuItem value="tr">Turkish</MenuItem>
                <MenuItem value="vi">Vietnamese</MenuItem>
              </Select>
            </FormControl>
          </Fragment>
        )}
      </Container>
    </div>
  );
};

LanguageSelect.propTypes = {
  translations: PropTypes.object.isRequired,
  selectLang: PropTypes.func.isRequired
  // rollbar: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  translations: state.translations
});

export default connect(mapStateToProps, { selectLang })(LanguageSelect);
