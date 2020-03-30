import React, { Fragment, useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Alert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import Collapse from "@material-ui/core/Collapse";
import { useForm } from "react-hook-form";

import {
  save,
  deleteSaved,
  clear,
  translate,
  textToSpeech,
  speak,
  listen
} from "../../actions/lang";
import legacyGetUserMedia from "../../utils/legacyRecording";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    minHeight: "100vh",
    width: "100%"
  },
  content: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    paddingTop: theme.spacing(2)
  },
  alert: {
    position: "absolute",
    top: theme.spacing(1),
    left: theme.spacing(0),
    right: theme.spacing(0)
  },
  form: {
    width: "100%"
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
  paperTwo: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    minHeight: "35vh",
    overflow: "auto"
  }
}));

const Landing = ({
  save,
  deleteSaved,
  clear,
  translate,
  speak,
  textToSpeech,
  listen,
  lang: {
    preTrans,
    postTrans,
    transcribed,
    translatedTranscription,
    translatedAudio,
    saved
  }
}) => {
  const classes = useStyles();

  const { register, handleSubmit, errors } = useForm();

  let [stream, setStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [chunks, setChunks] = useState([]);
  const [supported, setSupported] = useState(false);
  const [badAlert, setBadAlert] = useState(false);
  const [goodAlert, setGoodAlert] = useState(false);

  const [textError, setTextError] = useState("");
  const [isTextError, setIsTextError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const constraints = { audio: true };
        if (navigator.mediaDevices.getUserMedia === undefined) {
          navigator.mediaDevices.getUserMedia = legacyGetUserMedia;
        }
        if (!stream) {
          setStream(await navigator.mediaDevices.getUserMedia(constraints));
        }
        if (stream) {
          setMediaRecorder(new MediaRecorder(stream));
        }
        if (navigator.mediaDevices.getUserMedia) {
          setSupported(true);
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [stream]);

  useEffect(() => {
    if (mediaRecorder) {
      mediaRecorder.ondataavailable = function(e) {
        setChunks(prev => [...prev, e.data]);
        console.log("chunk collected");
      };
      if (mediaRecorder.state === "inactive") {
        setChunks([]);
      }
    }
  }, [mediaRecorder]);

  useEffect(() => {
    if (errors.text) {
      setTextError(errors.text.message);
      setIsTextError(true);
    } else {
      setTextError("");
      setIsTextError(false);
    }
  }, [errors.text]);

  useEffect(() => {
    localStorage.setItem("savedTranslations", JSON.stringify(saved));
  }, [saved]);

  const onChange = e => {
    setText(e.target.value);
  };

  const handleTranslate = () => {
    translate(text);
  };

  const handleSave = e => {
    e.preventDefault();
    window.scrollTo(0, 0);
    if (preTrans && postTrans) {
      setGoodAlert(true);
      setTimeout(function() {
        setGoodAlert(false);
      }, 3000);
      if (translatedAudio) {
        speak(preTrans, postTrans, translatedAudio, false);
      } else {
        textToSpeech(preTrans, postTrans, false);
      }
    } else {
      setBadAlert(true);
      setTimeout(function() {
        setBadAlert(false);
      }, 3000);
    }
  };

  const handleCleanup = e => {
    clear();
  };

  const handleSpeak = e => {
    e.preventDefault();
    if (translatedAudio) {
      speak(preTrans, postTrans, translatedAudio, true);
    } else {
      textToSpeech(preTrans, postTrans, true);
    }
  };

  const handleSavedSpeak = data => {
    speak(preTrans, postTrans, data, true);
  };

  const handleClick3 = e => {
    e.preventDefault();
    setListening(!listening);
    if (!listening) {
      mediaRecorder.start(200);
      console.log("recording starting");
    } else {
      mediaRecorder.stop();
      console.log("recording stopping");
      stream.getTracks().forEach(function(track) {
        track.stop();
      });
      const blob = new Blob(chunks, { type: "audio/webm" });
      setChunks([]);
      setStream(null);
      setMediaRecorder(null);
      listen(blob);
    }
  };

  return (
    <div className={classes.root}>
      <Container className={classes.content}>
        <Container className={classes.alert}>
          <Collapse in={goodAlert}>
            <Alert severity="success">Translated text saved!</Alert>
          </Collapse>
          <Collapse in={badAlert}>
            <Alert severity="error">
              Please execute a translation to save.
            </Alert>
          </Collapse>
        </Container>
        <Typography component="h1">
          Welcome to the translator! Enter english text below:
        </Typography>
        <Paper className={classes.paper}>
          <form
            className={classes.form}
            onSubmit={handleSubmit(handleTranslate)}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  aria-label="untranslated text"
                  name="text"
                  variant="filled"
                  placeholder="Enter text to be translated here..."
                  fullWidth
                  multiline
                  rows={4}
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
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.button}
                    >
                      Translate
                    </Button>
                  </Grid>
                  <Grid item xs={6} className={classes.outterButton}>
                    <Button
                      type="reset"
                      fullWidth
                      variant="contained"
                      color="secondary"
                      className={classes.button}
                      onClick={e => handleCleanup(e)}
                    >
                      Clear
                    </Button>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  aria-label="translated text"
                  name="translated"
                  label={preTrans}
                  value={postTrans}
                  variant="filled"
                  placeholder="Translated text will appear here..."
                  fullWidth
                  multiline
                  rows={4}
                  inputProps={{ readOnly: true }}
                />
                <Grid container>
                  <Grid item xs={6} className={classes.outterButton}>
                    <Button
                      onClick={e => handleSpeak(e)}
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.button}
                    >
                      Speak
                    </Button>
                  </Grid>
                  <Grid item xs={6} className={classes.outterButton}>
                    <Button
                      onClick={e => handleSave(e)}
                      fullWidth
                      variant="contained"
                      color="secondary"
                      className={classes.button}
                      disabled={goodAlert || badAlert}
                    >
                      Save
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              {supported ? (
                <Fragment>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      aria-label="transcribed text"
                      value={transcribed}
                      variant={"filled"}
                      placeholder="Transcribed text will appear here..."
                      fullWidth
                      multiline
                      rows={4}
                      inputProps={{ disabled: true }}
                    />
                    {!listening && (
                      <Grid container>
                        <Grid item xs={12} className={classes.outterButton}>
                          <Button
                            onClick={e => handleClick3(e)}
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.button}
                          >
                            Listen
                          </Button>
                        </Grid>
                      </Grid>
                    )}
                    {listening && (
                      <Grid container>
                        <Grid item xs={12} className={classes.outterButton}>
                          <Button
                            onClick={e => handleClick3(e)}
                            fullWidth
                            variant="contained"
                            color="secondary"
                            className={classes.button}
                          >
                            Stop!
                          </Button>
                        </Grid>
                      </Grid>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      aria-label="translated transcribed text"
                      value={translatedTranscription}
                      variant={"filled"}
                      placeholder="Translated transcription will appear here..."
                      fullWidth
                      multiline
                      rows={4}
                      inputProps={{ disabled: true }}
                    />
                  </Grid>
                </Fragment>
              ) : (
                <Fragment>
                  <Typography component="h1" variant="caption">
                    Browser not supported. Please use a laptop or computer
                    browser for audio transcription support.
                  </Typography>
                </Fragment>
              )}
            </Grid>
          </form>
        </Paper>
        {saved.length > 0 && (
          <Paper className={classes.paperTwo}>
            <Typography variant="subtitle2">Saved Translations:</Typography>
            <Grid container>
              <Grid item xs={12} md={6}>
                <div>
                  <List disablePadding={true}>
                    {saved
                      .filter((translation, index) => index % 2 === 0)
                      .map(translation => (
                        <ListItem
                          divider={true}
                          button
                          key={translation.transId}
                          onClick={e =>
                            handleSavedSpeak(translation.translatedAudio)
                          }
                        >
                          <ListItemText
                            primary={translation.preTrans}
                            secondary={translation.postTrans}
                          />
                          <ListItemSecondaryAction>
                            <IconButton
                              onClick={e => deleteSaved(translation.transId)}
                              aria-label="delete"
                            >
                              <ClearIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                  </List>
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <div>
                  <List disablePadding={true}>
                    {saved
                      .filter((translation, index) => index % 2 !== 0)
                      .map(translation => (
                        <ListItem
                          divider={true}
                          button
                          key={translation.transId}
                          onClick={e =>
                            handleSavedSpeak(translation.translatedAudio)
                          }
                        >
                          <ListItemText
                            primary={translation.preTrans}
                            secondary={translation.postTrans}
                          />
                          <ListItemSecondaryAction>
                            <IconButton
                              onClick={e => deleteSaved(translation.transId)}
                              aria-label="delete"
                            >
                              <ClearIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                  </List>
                </div>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Container>
    </div>
  );
};

Landing.propTypes = {
  deleteSaved: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  clear: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  speak: PropTypes.func.isRequired,
  textToSpeech: PropTypes.func.isRequired,
  listen: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  lang: state.lang
});

export default connect(mapStateToProps, {
  save,
  clear,
  deleteSaved,
  translate,
  speak,
  textToSpeech,
  listen
})(Landing);
