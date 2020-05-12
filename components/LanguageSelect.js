import PropTypes from "prop-types";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import { selectLang } from "../src/actions/translations";

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

const LanguageSelect = ({
  selectLang,
  translations: { from, fromCode, to, toCode }
}) => {
  const classes = useStyles();

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
            <MenuItem value="ar" disabled={toCode === "ar"}>
              Arabic
            </MenuItem>
            <MenuItem value="zh" disabled={toCode === "zh"}>
              Chinese (simplified)
            </MenuItem>
            <MenuItem value="zh-TW" disabled={toCode === "zh-TW"}>
              Chinese (traditional)
            </MenuItem>
            <MenuItem value="en" disabled={toCode === "en"}>
              English
            </MenuItem>
            <MenuItem value="fi" disabled={toCode === "fi"}>
              Finnish
            </MenuItem>
            <MenuItem value="fr" disabled={toCode === "fr"}>
              French
            </MenuItem>
            <MenuItem value="de" disabled={toCode === "de"}>
              German
            </MenuItem>
            <MenuItem value="it" disabled={toCode === "it"}>
              Italian
            </MenuItem>
            <MenuItem value="ja" disabled={toCode === "ja"}>
              Japanese
            </MenuItem>
            <MenuItem value="ko" disabled={toCode === "ko"}>
              Korean
            </MenuItem>
            <MenuItem value="pt" disabled={toCode === "pt"}>
              Portuguese
            </MenuItem>
            <MenuItem value="ro" disabled={toCode === "ro"}>
              Romanian
            </MenuItem>
            <MenuItem value="ru" disabled={toCode === "ru"}>
              Russian
            </MenuItem>
            <MenuItem value="sk" disabled={toCode === "sk"}>
              Slovak
            </MenuItem>
            <MenuItem value="es" disabled={toCode === "es"}>
              Spanish
            </MenuItem>
            <MenuItem value="sv" disabled={toCode === "sv"}>
              Swedish
            </MenuItem>
            <MenuItem value="th" disabled={toCode === "th"}>
              Thai
            </MenuItem>
            <MenuItem value="tr" disabled={toCode === "tr"}>
              Turkish
            </MenuItem>
            <MenuItem value="vi" disabled={toCode === "vi"}>
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
            value={toCode}
            onChange={handleToChange}
          >
            <MenuItem value="ar" disabled={fromCode === "ar"}>
              Arabic
            </MenuItem>
            <MenuItem value="zh" disabled={fromCode === "zh"}>
              Chinese (simplified)
            </MenuItem>
            <MenuItem value="zh-TW" disabled={fromCode === "zh-TW"}>
              Chinese (traditional)
            </MenuItem>
            <MenuItem value="en" disabled={fromCode === "en"}>
              English
            </MenuItem>
            <MenuItem value="fi" disabled={fromCode === "fi"}>
              Finnish
            </MenuItem>
            <MenuItem value="fr" disabled={fromCode === "fr"}>
              French
            </MenuItem>
            <MenuItem value="de" disabled={fromCode === "de"}>
              German
            </MenuItem>
            <MenuItem value="it" disabled={fromCode === "it"}>
              Italian
            </MenuItem>
            <MenuItem value="ja" disabled={fromCode === "ja"}>
              Japanese
            </MenuItem>
            <MenuItem value="ko" disabled={fromCode === "ko"}>
              Korean
            </MenuItem>
            <MenuItem value="pt" disabled={fromCode === "pt"}>
              Portuguese
            </MenuItem>
            <MenuItem value="ro" disabled={fromCode === "ro"}>
              Romanian
            </MenuItem>
            <MenuItem value="ru" disabled={fromCode === "ru"}>
              Russian
            </MenuItem>
            <MenuItem value="sk" disabled={fromCode === "sk"}>
              Slovak
            </MenuItem>
            <MenuItem value="es" disabled={fromCode === "es"}>
              Spanish
            </MenuItem>
            <MenuItem value="sv" disabled={fromCode === "sv"}>
              Swedish
            </MenuItem>
            <MenuItem value="th" disabled={fromCode === "th"}>
              Thai
            </MenuItem>
            <MenuItem value="tr" disabled={fromCode === "tr"}>
              Turkish
            </MenuItem>
            <MenuItem value="vi" disabled={fromCode === "vi"}>
              Vietnamese
            </MenuItem>
          </Select>
        </FormControl>
      </Container>
    </div>
  );
};

LanguageSelect.propTypes = {
  translations: PropTypes.object.isRequired,
  selectLang: PropTypes.func.isRequired,
  rollbar: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  translations: state.translations
});

export default connect(mapStateToProps, { selectLang })(LanguageSelect);
