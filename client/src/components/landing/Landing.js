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
import { useForm } from "react-hook-form";

import { translate, speak, listen } from "../../actions/lang";
import legacyGetUserMedia from "../../utils/legacyRecording";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    height: "100vh"
  },
  content: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    marginTop: theme.spacing(8),
    overflow: "auto"
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(2, 0, 2)
  }
  // container: {
  //   paddingTop: theme.spacing(4),
  //   paddingBottom: theme.spacing(4)
  // }
  // paper: {
  //   padding: theme.spacing(2),
  //   display: "flex",
  //   overflow: "auto",
  //   flexDirection: "column"
  // },
  // centerFlexibleItem: {
  //   alignSelf: "center"
  // },
  // fixedHeight: {
  //   height: 260
  // }
}));

const Landing = ({
  translate,
  speak,
  listen,
  lang: { postTrans, transcribed, translatedTranscription }
}) => {
  const classes = useStyles();

  const { register, handleSubmit, errors } = useForm();

  let [stream, setStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [chunks, setChunks] = useState([]);
  const [supported, setSupported] = useState(false);

  const [textError, setTextError] = useState("");
  const [isTextError, setIsTextError] = useState(false);
  const [translatedError, setTranslatedError] = useState("");
  const [isTranslatedError, setIsTranslatedError] = useState(false);

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
    if (errors.translated) {
      setTranslatedError(errors.translated.message);
      setIsTranslatedError(true);
    } else {
      setTranslatedError("");
      setIsTranslatedError(false);
    }
  }, [errors.text, errors.translated]);

  const onChange = e => {
    console.log("text:");
    console.log(text);
    console.log("e.target.value:");
    console.log(e.target.value);
    setText(e.target.value);
  };

  const handleTranslate = () => {
    translate(text);
  };

  const handleClick2 = e => {
    e.preventDefault();
    speak(postTrans);
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

  return supported ? (
    <div className={classes.root}>
      <Container className={classes.content}>
        Welcome to the translator! To begin, enter text below:
        <Paper>
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
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Translate
                </Button>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  aria-label="translated text"
                  name="translated"
                  value={postTrans}
                  variant="filled"
                  placeholder="Translated text will appear here..."
                  fullWidth
                  multiline
                  rows={4}
                  helperText={translatedError}
                  error={isTranslatedError}
                  inputRef={register({
                    required: {
                      value: true,
                      message: "Please translate some text first"
                    }
                  })}
                  inputProps={{ disabled: true }}
                />
                <button onClick={e => handleClick2(e)}>Speak!</button>
              </Grid>
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
                  <button onClick={e => handleClick3(e)}>Listen!</button>
                )}
                {listening && (
                  <button onClick={e => handleClick3(e)}>Stop!</button>
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
            </Grid>
          </form>
        </Paper>
      </Container>
    </div>
  ) : (
    <Fragment>Browser not supported</Fragment>
  );
};

Landing.propTypes = {
  translate: PropTypes.func.isRequired,
  speak: PropTypes.func.isRequired,
  listen: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  lang: state.lang
});

export default connect(mapStateToProps, { translate, speak, listen })(Landing);
