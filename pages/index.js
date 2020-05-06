import { useState, useEffect, useCallback, useRef } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Alert from "@material-ui/lab/Alert";
import Collapse from "@material-ui/core/Collapse";
import { useForm } from "react-hook-form";
import Link from "next/link";

import ButtonLink from "../components/ButtonLink";
import { clear, translate } from "../src/actions/lang";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  content: {
    flexGrow: 1
  },
  alert: {
    position: "absolute",
    top: theme.spacing(1),
    left: theme.spacing(0),
    right: theme.spacing(0)
  },
  outterButton: {
    padding: theme.spacing(1)
  },
  button: {
    margin: theme.spacing(1, 0, 1)
  },
  paper: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  loader: {
    marginTop: theme.spacing(20)
  }
}));

const Index = ({
  clear,
  translate,
  lang: { preTrans, postTrans, error },
  rollbar
}) => {
  const classes = useStyles();

  const { register, handleSubmit, errors } = useForm();

  const [text, setText] = useState("");
  const [badAlert, setBadAlert] = useState(false);
  const [textError, setTextError] = useState("");
  const [isTextError, setIsTextError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onChange = e => {
    setText(e.target.value);
  };

  const handleTranslate = () => {
    clear({ rollbar });
    translate({ formData: text, rollbar });
  };

  const handleCleanup = e => {
    setText("");
    clear({ rollbar });
  };

  useEffect(() => {
    if (error) {
      window.scrollTo(0, 0);
      setErrorMessage(error.message);
      setBadAlert(true);
      setTimeout(() => {
        setBadAlert(false);
      }, 5000);
      setIsSaving(false);
      clear({ data: error, rollbar });
    }
    if (errors.text) {
      window.scrollTo(0, 0);
      setTextError(errors.text.message);
      setIsTextError(true);
    } else {
      setTextError("");
      setIsTextError(false);
    }
  }, [clear, error, errors.text, rollbar]);

  return (
    <div className={classes.root}>
      <Container className={classes.content}>
        <Container className={classes.alert}>
          <Collapse in={badAlert}>
            <Alert severity="error">{errorMessage}</Alert>
          </Collapse>
        </Container>
        <Container>
          <Grid container alignItems="center">
            <Grid item xs>
              <Typography variant="h6">Welcome to the Translator!</Typography>
            </Grid>
          </Grid>
        </Container>
        <Paper className={classes.paper}>
          <form onSubmit={handleSubmit(handleTranslate)}>
            <Grid container spacing={2}>
              <Grid item xs>
                <TextField
                  aria-label="untranslated text"
                  name="text"
                  variant="filled"
                  placeholder="Enter text to be translated here..."
                  fullWidth
                  multiline
                  rows={5}
                  autoFocus
                  helperText={textError}
                  error={isTextError}
                  inputRef={register({
                    required: {
                      value: true,
                      message: "Please include some text to translate"
                    },
                    pattern: {
                      value: /\b[^\d\W]+\b/,
                      message: "Please only include words"
                    }
                  })}
                  onChange={e => onChange(e)}
                />
                <Grid container>
                  <Grid item xs={6} className={classes.outterButton}>
                    <ButtonLink
                      href={"/enes/[translation]"}
                      as={"/enes/" + text}
                      fullWidth
                      color="primary"
                      variant="contained"
                      className={classes.button}
                    >
                      Translate
                    </ButtonLink>
                  </Grid>
                  <Grid item xs={6} className={classes.outterButton}>
                    <Button
                      type="reset"
                      fullWidth
                      variant="contained"
                      color="secondary"
                      className={classes.button}
                      onClick={e => handleCleanup(e)}
                      disabled={badAlert}
                    >
                      Clear
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

Index.propTypes = {
  clear: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  lang: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  lang: state.lang
});

export default connect(mapStateToProps, {
  clear,
  translate
})(Index);
