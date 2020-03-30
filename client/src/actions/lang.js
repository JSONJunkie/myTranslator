import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import {
  TRANSLATE,
  SPEAK,
  LISTEN,
  TRANSLATE_TRANSCRIPTION,
  SAVE,
  CLEAR
} from "./types";
import playSound from "../utils/playSound";

export const save = ({ preTrans, postTrans }) => dispatch => {
  try {
    dispatch({
      type: SAVE,
      payload: { transId: uuidv4(), preTrans, postTrans }
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
