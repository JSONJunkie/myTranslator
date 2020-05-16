import { fade, makeStyles } from "@material-ui/core/styles";
import { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import TranslateIcon from "@material-ui/icons/Translate";
import IconButton from "@material-ui/core/IconButton";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/router";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";

import {
  updateInput,
  addHit,
  getData,
  selectLang
} from "../src/actions/translations";

const useStyles = makeStyles(theme => ({
  hidden: {
    visibility: "hidden"
  },
  spacing: {
    marginLeft: theme.spacing(0),
    [theme.breakpoints.up("md")]: {
      marginLeft: theme.spacing(2)
    }
  },
  input: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(13),
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    [theme.breakpoints.up("md")]: {
      paddingTop: theme.spacing(0.5),
      paddingBottom: theme.spacing(0.5)
    }
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 1),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.85)
    },
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
    [theme.breakpoints.up("md")]: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2)
    }
  },
  button: {
    position: "absolute",
    right: theme.spacing(0.5),
    top: theme.spacing(0.5)
  },
  titleDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex"
    }
  },
  titleMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  }
}));

const Navbar = ({
  translations: { userInput, fromCode, toCode, preTrans, postTrans },
  selectLang,
  updateInput,
  addHit,
  getData
}) => {
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
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, []);

  useEffect(() => {
    if (router.pathname === "/") {
      addHit({ preTrans: "welcome", fromCode: "en", toCode: "es" });
      selectLang({
        from: "en",
        to: ""
      });
    }
    if (routing.complete) {
      setRouting(prev => ({ ...prev, starting: false, complete: true }));
      updateInput("");
      reset({ TextField: "" });
      if (router.pathname !== "/") {
        selectLang({
          from: router.pathname.split("/")[1],
          to: router.pathname.split("/")[2]
        });
      }
      if (
        userInput ||
        (router.pathname !== "/" && router.pathname !== "/404")
      ) {
        if (!router.isFallback) {
          addHit({
            preTrans: router.asPath.split("/")[3],
            fromCode: router.pathname.split("/")[1],
            toCode: router.pathname.split("/")[2]
          });
        }
      }
    }
    if (routing.starting) {
      setRouting(prev => ({
        ...prev,
        starting: true,
        complete: false,
        url: ""
      }));
    }
  }, [routing.starting, routing.complete]);

  const { handleSubmit, errors, control, reset } = useForm();

  const [helperText, setHelperText] = useState({
    inputError: "",
    isInputError: false
  });

  const handleSub = e => {
    if (!toCode || !fromCode) {
      setHelperText(prev => ({
        inputError: "Please select a from and to language for translation",
        isInputError: true
      }));
    } else {
      if (e.input === "") {
      } else {
        if (userInput !== "") {
          router.push(
            "/translate/[translation]/" + fromCode + "/" + toCode,
            "/translate/" +
              e.input.toLowerCase() +
              "/" +
              fromCode +
              "/" +
              toCode
          );
        }
      }
    }
  };

  const goHome = () => {
    router.push("/");
  };

  const onChange = e => {
    updateInput(e.target.value);
    return e.target.value;
  };

  useEffect(() => {
    if (errors.input) {
      setHelperText(prev => ({
        inputError: errors.input.message,
        isInputError: true
      }));
    } else {
      setHelperText(prev => ({ inputError: "", isInputError: false }));
    }
  }, [errors.input, fromCode, toCode]);

  return (
    <Fragment>
      <AppBar position="fixed">
        <Container maxWidth="lg" disableGutters={true}>
          <Toolbar>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Grid container className={classes.titleDesktop}>
                  <Tooltip title="Home">
                    <IconButton
                      aria-label="home"
                      color="inherit"
                      onClick={goHome}
                    >
                      <Typography variant="h4">Translator</Typography>
                    </IconButton>
                  </Tooltip>
                </Grid>
                <Grid container className={classes.titleMobile}>
                  <Tooltip title="Home">
                    <IconButton
                      aria-label="home"
                      color="inherit"
                      onClick={goHome}
                    >
                      <TranslateIcon fontSize="large" />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
              <Grid item xs className={classes.spacing}>
                <form onSubmit={handleSubmit(handleSub)}>
                  <div className={classes.search}>
                    <Controller
                      as={TextField}
                      name="input"
                      control={control}
                      className={classes.input}
                      autoFocus
                      fullWidth
                      id="translate"
                      size="small"
                      placeholder="Translate something..."
                      helperText={helperText.inputError}
                      error={helperText.isInputError}
                      onChange={([e]) => onChange(e)}
                      defaultValue=""
                      rules={{
                        pattern: {
                          value: /\b[^\d\W]+\b/,
                          message: "Alphabet characters only"
                        }
                      }}
                    />
                    <Tooltip title="Translate">
                      <Button
                        type="submit"
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        size="small"
                      >
                        Translate
                      </Button>
                    </Tooltip>
                  </div>
                </form>
              </Grid>
            </Grid>
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar className={classes.hidden}></Toolbar>
    </Fragment>
  );
};

// Navbar.propTypes = {
//   rollbar: PropTypes.object.isRequired
// };

Navbar.propTypes = {
  translations: PropTypes.object.isRequired,
  selectLang: PropTypes.func.isRequired,
  updateInput: PropTypes.func.isRequired,
  addHit: PropTypes.func.isRequired,
  getData: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  translations: state.translations
});

export default connect(mapStateToProps, {
  updateInput,
  addHit,
  getData,
  selectLang
})(Navbar);
