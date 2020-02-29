import axios from "axios";

import { TRANSLATE, SPEAK, LISTEN } from "./types";
import playSound from "../utils/playSound";

export const translate = formData => async dispatch => {
  try {
    const translateParams = {
      text: formData,
      modelId: "en-es"
    };
    const body = translateParams;

    const res = await axios.post("/api/translator", body);

    dispatch({
      type: TRANSLATE,
      payload: { preTrans: formData, postTrans: res.data }
    });
  } catch (err) {
    console.log(err);
  }
};

export const speak = postTrans => async dispatch => {
  try {
    const synthesizeParams = {
      text: postTrans,
      accept: "audio/mp3",
      voice: "es-ES_LauraVoice"
    };

    const config = {
      responseType: "arraybuffer"
    };

    const body = synthesizeParams;

    const res = await axios.post("/api/translator/speak", body, config);

    const audio = res.data;

    playSound(audio);

    dispatch({
      type: SPEAK,
      payload: { msg: "Playing back translation" }
    });
  } catch (err) {
    console.log(err);
  }
};

export const listen = () => async dispatch => {
  try {
    const constraints = { audio: true };

    let stream = null;
    if (navigator.mediaDevices.getUserMedia === undefined) {
      navigator.mediaDevices.getUserMedia = function(constraints) {
        const getUserMedia =
          navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        if (!getUserMedia) {
          return Promise.reject(new Error("This browser is not supported"));
        }

        return new Promise(function(resolve, reject) {
          getUserMedia.call(navigator, constraints, resolve, reject);
        });
      };
    }
    setTimeout(() => {
      mediaRecorder.stop();
      console.log("recording stopping");
    }, 4000);
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start(500);
    console.log("recording starting");
    let chunks = [];
    let audio = [];

    mediaRecorder.ondataavailable = function(e) {
      chunks.push(e.data);
      console.log("chunk collected");
    };

    mediaRecorder.onstop = async function(e) {
      const blob = new Blob(chunks, { type: "audio/webm" });
      console.log("recording stopping");
      chunks = [];
      const config = {
        headers: {
          "Content-Type": "blob.type"
        }
      };
      const res = await axios.post("/api/translator/listen", blob, config);
      dispatch({
        type: LISTEN,
        payload: { transcribed: res.data }
      });
    };
  } catch (err) {
    console.log(err);
  }
};
