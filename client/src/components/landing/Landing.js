import React, { Fragment, useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";

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
  }
}));

const Landing = ({
  translate,
  speak,
  listen,
  lang: { postTrans, transcribed, translatedTranscription }
}) => {
  const classes = useStyles();

  let [stream, setStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [chunks, setChunks] = useState([]);
  const [supported, setSupported] = useState(false);

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

  const onChange = e => {
    setText(e.target.value);
  };

  const handleClick = e => {
    e.preventDefault();
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
          <form className={classes.form}>
            <TextField
              aria-label="untranslated text"
              name="text"
              value={text}
              variant="filled"
              placeholder="Enter text to be translated here..."
              fullWidth
              multiline
              rows={4}
              onChange={e => onChange(e)}
            />
            <button onClick={e => handleClick(e)}>Translate</button>
            <TextField
              aria-label="translated text"
              name="postTrans"
              value={postTrans}
              variant="filled"
              placeholder="Translated text will appear here..."
              fullWidth
              multiline
              rows={4}
              inputProps={{ disabled: true }}
            />
            <button onClick={e => handleClick2(e)}>Speak!</button>
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
            {!listening && (
              <button onClick={e => handleClick3(e)}>Listen!</button>
            )}
            {listening && <button onClick={e => handleClick3(e)}>Stop!</button>}
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
