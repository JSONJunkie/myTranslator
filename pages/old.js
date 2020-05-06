import { Fragment, useState, useEffect, useCallback, useRef } from "react";
import clsx from "clsx";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Backdrop from "@material-ui/core/Backdrop";
import LinearProgress from "@material-ui/core/LinearProgress";
import CircularProgress from "@material-ui/core/CircularProgress";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Grow from "@material-ui/core/Grow";
import Alert from "@material-ui/lab/Alert";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import LockIcon from "@material-ui/icons/Lock";
import LockOpenIcon from "@material-ui/icons/LockOpen";
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
} from "../src/actions/lang";

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
  rootUnsup: {
    display: "flex",
    width: "100%"
  },
  contentUnsup: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    paddingTop: theme.spacing(1),
    minHeight: "108vh"
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
  paperTwo: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    maxHeight: "35vh",
    overflow: "auto"
  },
  storage: {
    marginBottom: theme.spacing(1)
  },
  progress: {
    position: "absolute",
    top: "50%",
    left: "47%",
    marginTop: -12,
    marginLeft: -12
  },
  wrapper: {
    position: "relative"
  },
  inner: {
    position: "absolute",
    top: "50%",
    left: "39%",
    marginTop: -12,
    marginLeft: -12
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    background: "rgb(53, 53, 53, .9)",
    color: "#fff",
    display: "flex",
    flexDirection: "column"
  },
  paper: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    transition: theme.transitions.create("height", {
      easing: theme.transitions.easing.easeIn,
      duration: 500
    }),
    [theme.breakpoints.down("xs")]: {
      height: theme.spacing(108)
    },
    [theme.breakpoints.up("sm")]: {
      height: theme.spacing(54)
    }
  },
  paperShift: {
    transition: theme.transitions.create("height", {
      easing: theme.transitions.easing.easeIn,
      duration: 500
    }),
    [theme.breakpoints.down("xs")]: {
      height: theme.spacing(54)
    },
    [theme.breakpoints.up("sm")]: {
      height: theme.spacing(27)
    }
  },
  paperUnsup: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    transition: theme.transitions.create("height", {
      easing: theme.transitions.easing.easeIn,
      duration: 500
    }),
    [theme.breakpoints.down("xs")]: {
      height: theme.spacing(54)
    },
    [theme.breakpoints.up("sm")]: {
      height: theme.spacing(27)
    }
  },
  paperShiftUnsup: {
    transition: theme.transitions.create("height", {
      easing: theme.transitions.easing.easeIn,
      duration: 500
    }),
    [theme.breakpoints.down("xs")]: {
      height: theme.spacing(27)
    },
    [theme.breakpoints.up("sm")]: {
      height: theme.spacing(14)
    }
  },
  loader: {
    marginTop: theme.spacing(20)
  }
}));

const Old = ({
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
    transId,
    error,
    savedSuccess
  },
  rollbar
}) => {
  const classes = useStyles();

  const { register, handleSubmit, errors } = useForm();

  let [stream, setStream] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [delayStop, setDelayStop] = useState(false);
  const [hist, setHist] = useState(true);
  const [transcribing, setTranscribing] = useState(true);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [recorderState, setRecorderState] = useState(false);
  const [chunks, setChunks] = useState([]);
  const [audioContext, setAudioContext] = useState(null);
  const [supported, setSupported] = useState(false);
  const [badAlert, setBadAlert] = useState(false);
  const [goodAlert, setGoodAlert] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUnstoring, setIsUnstoring] = useState(false);
  const [maxStorage, setMaxStorage] = useState("");
  const [currentStorage, setCurrentStorage] = useState(() => {
    if (typeof window !== "undefined") {
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
    }
  });

  const percentage =
    100 -
    Math.ceil(((maxStorage - currentStorage) / maxStorage) * 100 * 100) / 100;

  const [textError, setTextError] = useState("");
  const [isTextError, setIsTextError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [localError, setLocalError] = useState("");
  const [transLWorking, setTransLWorking] = useState(false);
  const [transSWorking, setTransSWorking] = useState(false);

  const recorderControl = useRef();

  recorderControl.current = {
    stop() {
      mediaRecorder.stop();
      console.log("recording stopping");
      stream.getTracks().forEach(track => {
        track.stop();
      });
      const blob = new Blob(chunks, { type: "audio/webm" });
      setStream(null);
      setMediaRecorder(null);
      setTransSWorking(true);
      listen({ blob, rollbar });
    }
  };

  const getMaxStorage = useCallback(() => {
    var temp = localStorage.getItem("savedTranslations");
    var temp2 = localStorage.getItem("prefs");
    localStorage.clear();

    var i = 0;
    try {
      for (i = 200; i <= 10000; i += 200) {
        localStorage.setItem("test", new Array(i * 1024 + 1).join("a"));
      }
    } catch (e) {
      localStorage.removeItem("test");
      localStorage.setItem("savedTranslations", temp);
      localStorage.setItem("prefs", temp2);
      temp = "";
      temp2 = "";
      return (i - 200) * 2;
    }
  }, []);

  const onChange = e => {
    setText(e.target.value);
  };

  const handleTranslate = () => {
    clear({ rollbar });

    setTransLWorking(true);
    translate({ formData: text, rollbar });
  };

  const handleSave = data => {
    const { transId, preTrans, postTrans, translatedAudio, stored } = data;
    try {
      if (preTrans && postTrans) {
        if (translatedAudio) {
          save({
            preTrans,
            postTrans,
            translatedAudio,
            transId,
            stored,
            rollbar
          });
        } else {
          textToSpeech({
            data: {
              preTrans,
              postTrans,
              speaking: false,
              transId,
              stored,
              audioContext
            },
            rollbar
          });
        }

        setIsSaving(true);
      } else {
        throw new Error(
          "You must make a translation before attempting to save!"
        );
      }
    } catch (err) {
      rollbar.error(err.message);
      setLocalError(prev => err);
    }
  };

  const handleCleanup = e => {
    setText("");
    clear({ rollbar });
  };

  const handleSpeak = data => {
    audioContext.resume();
    const { preTrans, postTrans, translatedAudio, transId, stored } = data;
    try {
      if (!postTrans) throw new Error("You need to make a translation first!");
      if (translatedAudio) {
        speak({
          data: {
            preTrans,
            postTrans,
            translatedAudio,
            speaking: true,
            transId,
            stored,
            audioContext
          },
          rollbar
        });
      } else {
        textToSpeech({
          data: {
            preTrans,
            postTrans,
            speaking: true,
            transId,
            stored,
            audioContext
          },
          rollbar
        });
      }
    } catch (err) {
      setLocalError(prev => err);
    }
  };

  const handleUnstore = data => {
    deleteSaved({ transId: data, rollbar });
    setIsUnstoring(true);
  };

  const handleClick3 = e => {
    e.preventDefault();
    setListening(!listening);
    setDelayStop(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSwitch = e => {
    const target = e.target.name;
    if (target === "hist") {
      setHist(!hist);
    }
    if (target === "transcribing") {
      setTranscribing(!transcribing);
    }
  };

  if ((postTrans && transLWorking) || (error && transLWorking)) {
    setTransLWorking(false);
  }

  if ((translatedTranscription && transSWorking) || (error && transSWorking)) {
    setTransSWorking(false);
  }

  useEffect(() => {
    (async () => {
      try {
        if (navigator.getUserMedia && listening && !mediaRecorder) {
          const constraints = { audio: true };
          if (!stream) {
            setStream(await navigator.mediaDevices.getUserMedia(constraints));
          }
          if (stream && !mediaRecorder) {
            setMediaRecorder(new MediaRecorder(stream));
          }
        }
      } catch (err) {
        setLocalError(prev => err);
      }
    })();
  }, [stream, mediaRecorder, listening]);

  useEffect(() => {
    if (mediaRecorder) {
      if (listening && !recorderState) {
        clear({ rollbar });
        mediaRecorder.start(1000);
        setRecorderState(true);
        setDelayStop(true);
        setTimeout(() => setDelayStop(false), 1500);
        console.log("recorder starting...");
      }

      if (!listening && recorderState) {
        recorderControl.current.stop();
        setRecorderState(false);
      }
    }
  }, [listening, mediaRecorder, recorderState, clear, rollbar]);

  useEffect(() => {
    if (mediaRecorder) {
      mediaRecorder.ondataavailable = e => {
        setChunks(prev => [...prev, e.data]);
        console.log("chunk collected");
      };
      if (!recorderState) {
        console.log("resetting chunks");
        setChunks([]);
      }
    }
  }, [mediaRecorder, recorderState]);

  useEffect(() => {
    if (!loading) {
      const prefs = { hist, transcribing };
      localStorage.setItem("prefs", JSON.stringify(prefs));
    }
  }, [hist, transcribing, loading]);

  useEffect(() => {
    if (localStorage.prefs) {
      const prefs = JSON.parse(localStorage.getItem("prefs"));
      setHist(prev => prefs.hist);
      setTranscribing(prev => prefs.transcribing);
    }

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

  useEffect(() => {
    if (savedSuccess) {
      window.scrollTo(0, 0);
      setGoodAlert(true);
      setTimeout(() => {
        setGoodAlert(false);
      }, 3000);
    }
    clear({ rollbar });
  }, [savedSuccess, clear, saved, rollbar]);

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
    if (localError) {
      window.scrollTo(0, 0);
      setErrorMessage(localError.message);
      setBadAlert(true);
      setTimeout(() => {
        setBadAlert(false);
      }, 5000);
      setLocalError("");
    }
    if (errors.text) {
      window.scrollTo(0, 0);
      setTextError(errors.text.message);
      setIsTextError(true);
    } else {
      setTextError("");
      setIsTextError(false);
    }
  }, [clear, error, localError, errors.text, rollbar]);

  useEffect(() => {
    const prefs = { hist, transcribing };
    localStorage.setItem("prefs", JSON.stringify(prefs));
    if (!maxStorage) {
      const max = getMaxStorage();
      setMaxStorage(prev => max);
    }
  }, [getMaxStorage, maxStorage, hist, transcribing]);

  useEffect(() => {
    setAudioContext(new (window.AudioContext || window.webkitAudioContext)());
  }, []);

  useEffect(() => {
    if (navigator.getUserMedia) {
      setSupported(true);
      setLoading(false);
    } else {
      setOpen(true);
      setLoading(false);
    }
  }, []);

  return loading ? (
    <Grid container justify="center" alignItems="center">
      <CircularProgress disableShrink className={classes.loader} />
    </Grid>
  ) : (
    <Grow in={true} {...{ timeout: 1500 }}>
      <div
        className={clsx(classes.root, {
          [classes.rootUnsup]: !supported
        })}
      >
        <Container
          className={clsx(classes.content, {
            [classes.contentUnsup]: !supported
          })}
        >
          <Container className={classes.alert}>
            <Collapse in={goodAlert}>
              <Alert severity="success">Translated text saved!</Alert>
            </Collapse>
            <Collapse in={badAlert}>
              <Alert severity="error">{errorMessage}</Alert>
            </Collapse>
          </Container>
          <Container>
            <Grid container alignItems="center">
              <Grid item xs>
                <Typography variant="h6">Welcome to the Translator!</Typography>
              </Grid>
              <Grid item>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={hist}
                        onChange={e => {
                          handleSwitch(e);
                        }}
                        name="hist"
                        color="primary"
                      />
                    }
                    label="Save/History"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={transcribing}
                        onChange={e => {
                          handleSwitch(e);
                        }}
                        name="transcribing"
                        color="primary"
                        disabled={!supported}
                      />
                    }
                    label="Transcription"
                  />
                </FormGroup>
              </Grid>
            </Grid>
          </Container>
          {supported ? (
            <Paper
              className={clsx(classes.paper, {
                [classes.paperShift]: !transcribing
              })}
            >
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
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          color="primary"
                          className={classes.button}
                          disabled={
                            goodAlert ||
                            badAlert ||
                            transLWorking ||
                            transSWorking
                          }
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
                          disabled={
                            goodAlert ||
                            badAlert ||
                            transLWorking ||
                            transSWorking
                          }
                        >
                          Clear
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <div className={classes.wrapper}>
                      <TextField
                        aria-label="translated text"
                        name="translated"
                        label={preTrans}
                        value={postTrans}
                        variant="filled"
                        placeholder="Translated text will appear here..."
                        fullWidth
                        multiline
                        rows={5}
                        inputProps={{ readOnly: true }}
                      />
                      {transLWorking && (
                        <CircularProgress
                          disableShrink
                          className={classes.progress}
                        />
                      )}
                    </div>

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
                          disabled={
                            goodAlert ||
                            badAlert ||
                            transLWorking ||
                            transSWorking
                          }
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
                          disabled={
                            goodAlert ||
                            badAlert ||
                            transLWorking ||
                            transSWorking
                          }
                        >
                          Save
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </form>
              <Grow in={transcribing} {...{ timeout: 1500 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <div className={classes.wrapper}>
                      <TextField
                        aria-label="transcribed text"
                        value={transcribed}
                        variant={"filled"}
                        placeholder="Transcribed text will appear here..."
                        fullWidth
                        multiline
                        rows={5}
                        inputProps={{ disabled: true }}
                      />
                      {listening &&
                        (mediaRecorder ? (
                          <Typography variant="h6" className={classes.inner}>
                            Listening...
                          </Typography>
                        ) : (
                          <Typography variant="h6" className={classes.inner}>
                            Please wait...
                          </Typography>
                        ))}
                    </div>
                    {!listening && (
                      <Grid container>
                        <Grid item xs={12} className={classes.outterButton}>
                          <Button
                            onClick={e => handleClick3(e)}
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            disabled={
                              goodAlert ||
                              badAlert ||
                              transLWorking ||
                              transSWorking
                            }
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
                            disabled={delayStop}
                          >
                            Stop!
                          </Button>
                        </Grid>
                      </Grid>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <div className={classes.wrapper}>
                      <TextField
                        aria-label="translated transcribed text"
                        value={translatedTranscription}
                        variant={"filled"}
                        placeholder="Translated transcription will appear here..."
                        fullWidth
                        multiline
                        rows={5}
                        inputProps={{ disabled: true }}
                      />
                      {transSWorking && (
                        <CircularProgress
                          disableShrink
                          className={classes.progress}
                        />
                      )}
                    </div>
                  </Grid>
                </Grid>
              </Grow>
            </Paper>
          ) : (
            <Paper
              className={clsx(classes.paperUnsup, {
                [classes.paperShiftUnsup]: !transcribing
              })}
            >
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
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          color="primary"
                          className={classes.button}
                          disabled={
                            goodAlert ||
                            badAlert ||
                            transLWorking ||
                            transSWorking
                          }
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
                          disabled={
                            goodAlert ||
                            badAlert ||
                            transLWorking ||
                            transSWorking
                          }
                        >
                          Clear
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <div className={classes.wrapper}>
                      <TextField
                        aria-label="translated text"
                        name="translated"
                        label={preTrans}
                        value={postTrans}
                        variant="filled"
                        placeholder="Translated text will appear here..."
                        fullWidth
                        multiline
                        rows={5}
                        inputProps={{ readOnly: true }}
                      />
                      {transLWorking && (
                        <CircularProgress
                          disableShrink
                          className={classes.progress}
                        />
                      )}
                    </div>

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
                          disabled={
                            goodAlert ||
                            badAlert ||
                            transLWorking ||
                            transSWorking
                          }
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
                          disabled={
                            goodAlert ||
                            badAlert ||
                            transLWorking ||
                            transSWorking
                          }
                        >
                          Save
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </form>
              {!supported && (
                <Fragment>
                  <Backdrop
                    className={classes.backdrop}
                    open={open}
                    onClick={handleClose}
                  >
                    <Typography variant="h5" align="center">
                      Please use the desktop version of Chrome, or Firefox for
                      audio transcription support.
                    </Typography>
                    <Button color="inherit" size="large">
                      Continue
                    </Button>
                  </Backdrop>
                </Fragment>
              )}
            </Paper>
          )}
          <Grow in={hist} {...{ timeout: 1500 }} unmountOnExit={true}>
            <div>
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
                        <Typography
                          className={classes.barText}
                          variant="subtitle2"
                        >
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
                                  <Tooltip title="Play">
                                    <IconButton
                                      disabled={
                                        goodAlert ||
                                        badAlert ||
                                        transLWorking ||
                                        transSWorking
                                      }
                                      onClick={e =>
                                        handleSpeak({
                                          transId: translation.transId,
                                          preTrans: translation.preTrans,
                                          postTrans: translation.postTrans,
                                          translatedAudio:
                                            translation.translatedAudio,
                                          stored: "no and i dont want you to"
                                        })
                                      }
                                      aria-label="play"
                                    >
                                      <VolumeUpIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Remove">
                                    <IconButton
                                      onClick={e =>
                                        handleUnstore(translation.transId)
                                      }
                                      aria-label="remove"
                                    >
                                      <ClearIcon />
                                    </IconButton>
                                  </Tooltip>
                                </ListItemSecondaryAction>
                              </ListItem>
                            ))}
                          </List>
                        </div>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Typography
                          className={classes.barText}
                          variant="subtitle2"
                        >
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
                                  <Tooltip title="Play">
                                    <IconButton
                                      disabled={
                                        goodAlert ||
                                        badAlert ||
                                        transLWorking ||
                                        transSWorking
                                      }
                                      onClick={e =>
                                        handleSpeak({
                                          transId: translation.transId,
                                          preTrans: translation.preTrans,
                                          postTrans: translation.postTrans,
                                          translatedAudio:
                                            translation.translatedAudio,
                                          stored: "no and i dont want you to"
                                        })
                                      }
                                      aria-label="play"
                                    >
                                      <VolumeUpIcon />
                                    </IconButton>
                                  </Tooltip>
                                  {translation.stored ? (
                                    <Tooltip title="Remove">
                                      <IconButton
                                        onClick={e =>
                                          handleUnstore(translation.transId)
                                        }
                                        aria-label="remove"
                                      >
                                        <LockIcon />
                                      </IconButton>
                                    </Tooltip>
                                  ) : (
                                    <Tooltip title="save">
                                      <IconButton
                                        disabled={
                                          goodAlert ||
                                          badAlert ||
                                          transLWorking ||
                                          transSWorking
                                        }
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
                                    </Tooltip>
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
                        <Typography
                          className={classes.barText}
                          variant="subtitle2"
                        >
                          Stored:
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Typography
                          className={classes.barText}
                          variant="subtitle2"
                        >
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
                                    <Tooltip title="Play">
                                      <IconButton
                                        disabled={
                                          goodAlert ||
                                          badAlert ||
                                          transLWorking ||
                                          transSWorking
                                        }
                                        onClick={e =>
                                          handleSpeak({
                                            transId: translation.transId,
                                            preTrans: translation.preTrans,
                                            postTrans: translation.postTrans,
                                            translatedAudio:
                                              translation.translatedAudio,
                                            stored: "no and i dont want you to"
                                          })
                                        }
                                        aria-label="play"
                                      >
                                        <VolumeUpIcon />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Save">
                                      <IconButton
                                        disabled={
                                          goodAlert ||
                                          badAlert ||
                                          transLWorking ||
                                          transSWorking
                                        }
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
                                    </Tooltip>
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
                                    <Tooltip title="Play">
                                      <IconButton
                                        disabled={
                                          goodAlert ||
                                          badAlert ||
                                          transLWorking ||
                                          transSWorking
                                        }
                                        onClick={e =>
                                          handleSpeak({
                                            transId: translation.transId,
                                            preTrans: translation.preTrans,
                                            postTrans: translation.postTrans,
                                            translatedAudio:
                                              translation.translatedAudio,
                                            stored: "no and i dont want you to"
                                          })
                                        }
                                        aria-label="play"
                                      >
                                        <VolumeUpIcon />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Save">
                                      <IconButton
                                        disabled={
                                          goodAlert ||
                                          badAlert ||
                                          transLWorking ||
                                          transSWorking
                                        }
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
                                    </Tooltip>
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
            </div>
          </Grow>
        </Container>
      </div>
    </Grow>
  );
};

Old.propTypes = {
  deleteSaved: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  clear: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  speak: PropTypes.func.isRequired,
  textToSpeech: PropTypes.func.isRequired,
  listen: PropTypes.func.isRequired,
  lang: PropTypes.object.isRequired
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
})(Old);