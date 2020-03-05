import React, { Fragment, useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { translate, speak, listen } from "../../actions/lang";
import legacyGetUserMedia from "../../utils/legacyRecording";

const textArea = {
  width: "60%",
  height: "20%"
};

const Landing = ({
  translate,
  speak,
  listen,
  lang: { postTrans, transcribed }
}) => {
  let [stream, setStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [chunks, setChunks] = useState([]);

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
      mediaRecorder.start(500);
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
    <Fragment>
      Welcome to the translator! To begin, enter text below:
      <textarea
        placeholder={"Enter text here..."}
        style={textArea}
        value={text}
        onChange={e => onChange(e)}
      />
      <button onClick={e => handleClick(e)}>Translate</button>
      <textarea
        placeholder={"Translated text will appear here..."}
        style={textArea}
        value={postTrans}
        readOnly
      />
      <button onClick={e => handleClick2(e)}>Speak!</button>
      <textarea
        placeholder={"Transcribed text will appear here..."}
        style={textArea}
        value={transcribed}
        readOnly
      />
      {!listening && <button onClick={e => handleClick3(e)}>Listen!</button>}
      {listening && <button onClick={e => handleClick3(e)}>Stop!</button>}
    </Fragment>
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
