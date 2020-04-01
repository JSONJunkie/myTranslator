import React, { Fragment, useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Alert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import LockIcon from "@material-ui/icons/Lock";
import LockOpenIcon from "@material-ui/icons/LockOpen";
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

const StorageProgress = withStyles({
  root: {
    height: "100%",
    borderRadius: 10
  }
})(LinearProgress);

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
    paddingTop: theme.spacing(1)
  },
  alert: {
    position: "absolute",
    top: theme.spacing(1),
    left: theme.spacing(0),
    right: theme.spacing(0)
  },
  barText: {
    marginLeft: theme.spacing(1)
  },
  barTextHidden: {
    color: theme.palette.background.paper
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
  },
  storage: {
    marginBottom: theme.spacing(1)
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
    saved,
    translations,
    transId
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
  const [isSaving, setIsSaving] = useState(false);
  const [isUnstoring, setIsUnstoring] = useState(false);
  const [maxStorage, setMaxStorage] = useState(() => {
    var temp = localStorage.getItem("savedTranslations");
    localStorage.clear();

    var i = 0;
    try {
      for (i = 500; i <= 10000; i += 500) {
        localStorage.setItem("test", new Array(i * 1024 + 1).join("a"));
      }
    } catch (e) {
      localStorage.removeItem("test");
      localStorage.setItem("savedTranslations", temp);
      temp = "";
      return (i - 500) * 2;
    }
  });
  const [currentStorage, setCurrentStorage] = useState(() => {
    var total = 0,
      entryLength,
      entry;
    for (entry in localStorage) {
      if (!localStorage.hasOwnProperty(entry)) {
        continue;
      }
      entryLength = (localStorage[entry].length + entry.length) * 2;
      total += entryLength;
    }
    return Math.ceil((total / 1024) * 100) / 100;
  });

  const percentage =
    100 -
    Math.ceil(((maxStorage - currentStorage) / maxStorage) * 100 * 100) / 100;

  const [textError, setTextError] = useState("");
  const [isTextError, setIsTextError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
    if (isSaving && saved.length > 0) {
      setCurrentStorage(
        prev =>
          prev +
          Math.ceil(
            ((JSON.stringify(saved[saved.length - 1]).length * 2) / 1024) * 100
          ) /
            100
      );
      setIsSaving(false);
    }

    if (isUnstoring && saved.length > 0) {
      setCurrentStorage(
        prev =>
          prev -
          Math.ceil(
            ((JSON.stringify(saved[saved.length - 1]).length * 2) / 1024) * 100
          ) /
            100
      );
      setIsUnstoring(false);
    }

    if (isUnstoring && saved.length === 0) {
      setCurrentStorage(prev => 0);
      setIsUnstoring(false);
    }
  }, [saved, isSaving, isUnstoring]);

  const onChange = e => {
    setText(e.target.value);
  };

  const handleTranslate = () => {
    translate(text);
  };

  const handleSave = data => {
    const { transId, preTrans, postTrans, translatedAudio, stored } = data;
    // window.scrollTo(0, 0);
    try {
      if (preTrans && postTrans) {
        setGoodAlert(true);
        setTimeout(function() {
          setGoodAlert(false);
        }, 3000);
        if (translatedAudio) {
          save({ preTrans, postTrans, translatedAudio, transId, stored });
        } else {
          textToSpeech({
            preTrans,
            postTrans,
            speaking: false,
            transId,
            stored
          });
        }
        setIsSaving(true);
      } else {
        throw "You must make a translation before attempting to save!";
      }
    } catch (err) {
      handleError(err);
    }
  };

  const handleCleanup = e => {
    clear();
  };

  const handleSpeak = data => {
    const { preTrans, postTrans, translatedAudio, transId, stored } = data;
    try {
      if (!postTrans) throw "You need to make a translation first!";
      if (translatedAudio) {
        speak({
          preTrans,
          postTrans,
          translatedAudio,
          speaking: true,
          transId,
          stored
        });
      } else {
        textToSpeech({ preTrans, postTrans, speaking: true, transId, stored });
      }
    } catch (err) {
      handleError(err);
    }
  };

  const handleUnstore = data => {
    deleteSaved(data);
    setIsUnstoring(true);
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

  const handleError = err => {
    setErrorMessage(err);
    setBadAlert(true);
    setTimeout(function() {
      setBadAlert(false);
    }, 3000);
  };

  return (
    <div className={classes.root}>
      <Container className={classes.content}>
        <Container className={classes.alert}>
          <Collapse in={goodAlert}>
            <Alert severity="success">Translated text saved!</Alert>
          </Collapse>
          <Collapse in={badAlert}>
            <Alert severity="error">{errorMessage}</Alert>
          </Collapse>
        </Container>
        <Typography variant="h6">Welcome to the Translator! </Typography>
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
                  rows={3}
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
                  rows={3}
                  inputProps={{ readOnly: true }}
                />
                <Grid container>
                  <Grid item xs={6} className={classes.outterButton}>
                    <Button
                      onClick={e =>
                        handleSpeak({
                          transId,
                          preTrans,
                          postTrans,
                          translatedAudio,
                          stored: "no and i dont want you to"
                        })
                      }
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.button}
                      disabled={goodAlert || badAlert}
                    >
                      Speak
                    </Button>
                  </Grid>
                  <Grid item xs={6} className={classes.outterButton}>
                    <Button
                      onClick={e =>
                        handleSave({
                          transId,
                          preTrans,
                          postTrans,
                          translatedAudio
                        })
                      }
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
                      rows={3}
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
                      rows={3}
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
        <Typography variant="subtitle2">
          Storage Remaining: {maxStorage - currentStorage} KB
        </Typography>
        <div className={classes.storage}>
          <Grid container>
            <Grid item xs>
              <StorageProgress variant="determinate" value={percentage} />
            </Grid>
            <Grid item>
              <Typography className={classes.barText} variant="subtitle2">
                {Math.ceil((100 - percentage) * 100) / 100}%
              </Typography>
            </Grid>
          </Grid>
        </div>
        <Paper className={classes.paperTwo}>
          {translations.length > 0 || saved.length > 0 ? (
            saved.length > 0 ? (
              <Grid container>
                <Grid item xs={12} md={6}>
                  <Typography className={classes.barText} variant="subtitle2">
                    Stored:
                  </Typography>
                  <div>
                    <List disablePadding={true}>
                      {saved.map(translation => (
                        <ListItem key={translation.transId}>
                          <ListItemText
                            primary={translation.preTrans}
                            secondary={translation.postTrans}
                          />
                          <ListItemSecondaryAction>
                            <IconButton
                              onClick={e =>
                                handleSpeak({
                                  transId: translation.transId,
                                  preTrans: translation.preTrans,
                                  postTrans: translation.postTrans,
                                  translatedAudio: translation.translatedAudio,
                                  stored: translation.stored
                                })
                              }
                              aria-label="play"
                            >
                              <VolumeUpIcon />
                            </IconButton>
                            <IconButton
                              onClick={e => handleUnstore(translation.transId)}
                              aria-label="unstore"
                            >
                              <LockIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </div>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography className={classes.barText} variant="subtitle2">
                    History:
                  </Typography>
                  <div>
                    <List disablePadding={true}>
                      {translations.map(translation => (
                        <ListItem key={translation.transId}>
                          <ListItemText
                            primary={translation.preTrans}
                            secondary={translation.postTrans}
                          />
                          <ListItemSecondaryAction>
                            <IconButton
                              onClick={e =>
                                handleSpeak({
                                  transId: translation.transId,
                                  preTrans: translation.preTrans,
                                  postTrans: translation.postTrans,
                                  translatedAudio: translation.translatedAudio,
                                  stored: translation.stored
                                })
                              }
                              aria-label="play"
                            >
                              <VolumeUpIcon />
                            </IconButton>
                            {translation.stored ? (
                              <IconButton
                                onClick={e =>
                                  handleUnstore(translation.transId)
                                }
                                aria-label="unstore"
                              >
                                <LockIcon />
                              </IconButton>
                            ) : (
                              <IconButton
                                onClick={e =>
                                  handleSave({
                                    transId: translation.transId,
                                    preTrans: translation.preTrans,
                                    postTrans: translation.postTrans,
                                    translatedAudio:
                                      translation.translatedAudio,
                                    stored: translation.stored
                                  })
                                }
                                aria-label="save"
                              >
                                <LockOpenIcon />
                              </IconButton>
                            )}
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </div>
                </Grid>
              </Grid>
            ) : (
              <Grid container>
                <Grid item xs={12}>
                  <Typography className={classes.barText} variant="subtitle2">
                    Stored:
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography className={classes.barText} variant="subtitle2">
                    History:
                  </Typography>
                  <div>
                    <List disablePadding={true}>
                      {translations
                        .filter((translation, index) => index % 2 === 0)
                        .map(translation => (
                          <ListItem key={translation.transId}>
                            <ListItemText
                              primary={translation.preTrans}
                              secondary={translation.postTrans}
                            />
                            <ListItemSecondaryAction>
                              <IconButton
                                onClick={e =>
                                  handleSpeak({
                                    transId: translation.transId,
                                    preTrans: translation.preTrans,
                                    postTrans: translation.postTrans,
                                    translatedAudio:
                                      translation.translatedAudio,
                                    stored: translation.stored
                                  })
                                }
                                aria-label="play"
                              >
                                <VolumeUpIcon />
                              </IconButton>
                              <IconButton
                                onClick={e =>
                                  handleSave({
                                    transId: translation.transId,
                                    preTrans: translation.preTrans,
                                    postTrans: translation.postTrans,
                                    translatedAudio:
                                      translation.translatedAudio,
                                    stored: translation.stored
                                  })
                                }
                                aria-label="save"
                              >
                                <LockOpenIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                    </List>
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography
                    className={classes.barTextHidden}
                    variant="subtitle2"
                  >
                    History:
                  </Typography>
                  <div>
                    <List disablePadding={true}>
                      {translations
                        .filter((translation, index) => index % 2 !== 0)
                        .map(translation => (
                          <ListItem key={translation.transId}>
                            <ListItemText
                              primary={translation.preTrans}
                              secondary={translation.postTrans}
                            />
                            <ListItemSecondaryAction>
                              <IconButton
                                onClick={e =>
                                  handleSpeak({
                                    transId: translation.transId,
                                    preTrans: translation.preTrans,
                                    postTrans: translation.postTrans,
                                    translatedAudio:
                                      translation.translatedAudio,
                                    stored: translation.stored
                                  })
                                }
                                aria-label="play"
                              >
                                <VolumeUpIcon />
                              </IconButton>
                              <IconButton
                                onClick={e =>
                                  handleSave({
                                    transId: translation.transId,
                                    preTrans: translation.preTrans,
                                    postTrans: translation.postTrans,
                                    translatedAudio:
                                      translation.translatedAudio,
                                    stored: translation.stored
                                  })
                                }
                                aria-label="save"
                              >
                                <LockOpenIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                    </List>
                  </div>
                </Grid>
              </Grid>
            )
          ) : (
            <Fragment>
              <Typography className={classes.barText} variant="subtitle2">
                Stored:
              </Typography>
              <Typography className={classes.barText} variant="subtitle2">
                History:
              </Typography>
            </Fragment>
          )}
        </Paper>
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
