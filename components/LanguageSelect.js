import PropTypes from "prop-types";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import { useRouter } from "next/router";
import Grow from "@material-ui/core/Grow";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

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
  }
}));

const LanguageSelect = () => {
  const classes = useStyles();

  const [from, setFrom] = React.useState("en");

  const [to, setTo] = React.useState("es");

  const [toOpen, setToOpen] = React.useState(false);

  const [fromOpen, setFromOpen] = React.useState(false);

  const handleFromChange = event => {
    setFrom(event.target.value);
  };

  const handleToChange = event => {
    setTo(event.target.value);
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
        <FormControl className={classes.formControl}>
          <InputLabel id="from">From</InputLabel>
          <Select
            labelId="from"
            id="from"
            open={fromOpen}
            onClose={handleClose}
            onOpen={handleFromOpen}
            value={from}
            onChange={handleFromChange}
          >
            <MenuItem value="ar" disabled={to === "ar"}>
              Arabic
            </MenuItem>
            <MenuItem value="zh" disabled={to === "zh"}>
              Chinese (simplified)
            </MenuItem>
            <MenuItem value="zh-TW" disabled={to === "zh-TW"}>
              Chinese (traditional)
            </MenuItem>
            <MenuItem value="en" disabled={to === "en"}>
              English
            </MenuItem>
            <MenuItem value="fi" disabled={to === "fi"}>
              Finnish
            </MenuItem>
            <MenuItem value="fr" disabled={to === "fr"}>
              French
            </MenuItem>
            <MenuItem value="de" disabled={to === "de"}>
              German
            </MenuItem>
            <MenuItem value="it" disabled={to === "it"}>
              Italian
            </MenuItem>
            <MenuItem value="ja" disabled={to === "ja"}>
              Japanese
            </MenuItem>
            <MenuItem value="ko" disabled={to === "ko"}>
              Korean
            </MenuItem>
            <MenuItem value="pt" disabled={to === "pt"}>
              Portuguese
            </MenuItem>
            <MenuItem value="ro" disabled={to === "ro"}>
              Romanian
            </MenuItem>
            <MenuItem value="ru" disabled={to === "ru"}>
              Russian
            </MenuItem>
            <MenuItem value="sk" disabled={to === "sk"}>
              Slovak
            </MenuItem>
            <MenuItem value="es" disabled={to === "es"}>
              Spanish
            </MenuItem>
            <MenuItem value="sv" disabled={to === "sv"}>
              Swedish
            </MenuItem>
            <MenuItem value="th" disabled={to === "th"}>
              Thai
            </MenuItem>
            <MenuItem value="tr" disabled={to === "tr"}>
              Turkish
            </MenuItem>
            <MenuItem value="vi" disabled={to === "vi"}>
              Vietnamese
            </MenuItem>
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel id="to">To</InputLabel>
          <Select
            labelId="to"
            id="to"
            open={toOpen}
            onClose={handleClose}
            onOpen={handleToOpen}
            value={to}
            onChange={handleToChange}
          >
            <MenuItem value="ar" disabled={from === "ar"}>
              Arabic
            </MenuItem>
            <MenuItem value="zh" disabled={from === "zh"}>
              Chinese (simplified)
            </MenuItem>
            <MenuItem value="zh-TW" disabled={from === "zh-TW"}>
              Chinese (traditional)
            </MenuItem>
            <MenuItem value="en" disabled={from === "en"}>
              English
            </MenuItem>
            <MenuItem value="fi" disabled={from === "fi"}>
              Finnish
            </MenuItem>
            <MenuItem value="fr" disabled={from === "fr"}>
              French
            </MenuItem>
            <MenuItem value="de" disabled={from === "de"}>
              German
            </MenuItem>
            <MenuItem value="it" disabled={from === "it"}>
              Italian
            </MenuItem>
            <MenuItem value="ja" disabled={from === "ja"}>
              Japanese
            </MenuItem>
            <MenuItem value="ko" disabled={from === "ko"}>
              Korean
            </MenuItem>
            <MenuItem value="pt" disabled={from === "pt"}>
              Portuguese
            </MenuItem>
            <MenuItem value="ro" disabled={from === "ro"}>
              Romanian
            </MenuItem>
            <MenuItem value="ru" disabled={from === "ru"}>
              Russian
            </MenuItem>
            <MenuItem value="sk" disabled={from === "sk"}>
              Slovak
            </MenuItem>
            <MenuItem value="es" disabled={from === "es"}>
              Spanish
            </MenuItem>
            <MenuItem value="sv" disabled={from === "sv"}>
              Swedish
            </MenuItem>
            <MenuItem value="th" disabled={from === "th"}>
              Thai
            </MenuItem>
            <MenuItem value="tr" disabled={from === "tr"}>
              Turkish
            </MenuItem>
            <MenuItem value="vi" disabled={from === "vi"}>
              Vietnamese
            </MenuItem>
          </Select>
        </FormControl>
      </Container>
    </div>
  );
};

LanguageSelect.propTypes = {
  rollbar: PropTypes.object.isRequired
};

export default LanguageSelect;
