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
    const config = {
      headers: {
        "Content-Type": "blob.type"
      }
    };
    const constraints = { audio: true };
    const audio = await getAudio(constraints);
    async function getAudio(constraints) {
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
      stream = await navigator.mediaDevices.getUserMedia(constraints);
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();
      console.log("recording starting");
      let chunks = [];

      mediaRecorder.ondataavailable = function(e) {
        chunks.push(e.data);
        console.log(e);
        console.log(e.data);
        console.log("chunk collected");
      };
      setTimeout(() => {
        mediaRecorder.stop();
      }, 5000);
      const blob = (mediaRecorder.onstop = function(e) {
        const blob = new Blob(chunks, { type: "audio/mp3" });
        chunks = [];
        return blob;
      });
      return blob;
    }
    // const synthesizeParams = {
    //   text: "Hello",
    //   accept: "audio/mp3",
    //   voice: "es-ES_LauraVoice"
    // };

    // const config2 = {
    //   responseType: "blob"
    // };

    // const body = synthesizeParams;

    // const res2 = await axios.post("/api/translator/speak", body, config2);

    // const audio = res2.data;

    const res = await axios.post("/api/translator/listen", audio, config);

    dispatch({
      type: LISTEN,
      payload: { transcribed: res.data }
    });
  } catch (err) {
    console.log(err);
  }
};
