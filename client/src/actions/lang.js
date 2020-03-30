import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import {
  TRANSLATE,
  SPEAK,
  STORE_TRANSLATED_AUDIO,
  LISTEN,
  TRANSLATE_TRANSCRIPTION,
  SAVE,
  CLEAR,
  DELETE_SAVED
} from "./types";
import playSound from "../utils/playSound";

export const deleteSaved = transId => dispatch => {
  try {
    dispatch({
      type: DELETE_SAVED,
      payload: { transId }
    });
  } catch (err) {
    console.log(err);
  }
};

export const save = ({ preTrans, postTrans, translatedAudio }) => dispatch => {
  try {
    dispatch({
      type: SAVE,
      payload: { transId: uuidv4(), preTrans, postTrans, translatedAudio }
    });
  } catch (err) {
    console.log(err);
  }
};

export const clear = () => dispatch => {
  try {
    dispatch({ type: CLEAR });
  } catch (err) {
    console.log(err);
  }
};

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

export const textToSpeech = postTrans => async dispatch => {
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
    const fileReader = new FileReader();
    const blob = new Blob([audio], { type: "audio/webm" });
    fileReader.onload = function(event) {
      const result = event.target.result;
      try {
        dispatch({
          type: STORE_TRANSLATED_AUDIO,
          payload: { translatedAudio: result }
        });
        dispatch(speak(result));
      } catch (err) {
        console.log(err);
      }
    };
    fileReader.readAsDataURL(blob);
  } catch (err) {
    console.log(err);
  }
};

export const speak = dataUrl => dispatch => {
  try {
    const fileReader = new FileReader();
    function dataURLtoBlob(dataUrl) {
      var arr = dataUrl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    }
    fileReader.onload = function(event) {
      const result = event.target.result;
      console.log("spek");
      playSound(result);
    };
    fileReader.readAsArrayBuffer(dataURLtoBlob(dataUrl));
    dispatch({
      type: SPEAK
    });
  } catch (err) {
    console.log(err);
  }
};

export const listen = blob => async dispatch => {
  try {
    const config = {
      headers: {
        "Content-Type": "blob.type"
      }
    };
    const transcribedRes = await axios.post(
      "/api/translator/listen",
      blob,
      config
    );
    dispatch({
      type: LISTEN,
      payload: { transcribed: transcribedRes.data }
    });
    const translateParams = {
      text: transcribedRes.data,
      modelId: "es-en"
    };
    const body = translateParams;
    const translatedRes = await axios.post("/api/translator", body);
    dispatch({
      type: TRANSLATE_TRANSCRIPTION,
      payload: { translatedTranscription: translatedRes.data }
    });
  } catch (err) {
    console.log(err);
  }
};
