import axios from "axios";
import { v4 as uuidv4 } from "uuid";
// import Rollbar from "rollbar";

import {
  TRANSLATE,
  SPEAK,
  STORE_TRANSLATED_AUDIO,
  LISTEN,
  TRANSLATE_TRANSCRIPTION,
  SAVE,
  CLEAR,
  DELETE_SAVED,
  PUSH_TRANS,
  ERROR,
  CLEAR_ERROR
} from "./types";
import playSound from "../utils/playSound";

// function getRollbar() {
//   if (process.env.NODE_ENV === "development") {
//     const rollbar = new Rollbar({
//       accessToken: "589f75cdf3664555b9b778a76ab2a226",
//       captureUncaught: true,
//       captureUnhandledRejections: true,
//       environment: "development"
//     });
//     return rollbar;
//   }

//   if (process.env.NODE_ENV === "production") {
//     const rollbar = new Rollbar({
//       accessToken: "589f75cdf3664555b9b778a76ab2a226",
//       captureUncaught: true,
//       captureUnhandledRejections: true,
//       environment: "production"
//     });
//     return rollbar;
//   }
// }

// const rollbar = getRollbar();

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

export const save = ({
  preTrans,
  postTrans,
  translatedAudio,
  transId,
  stored
}) => dispatch => {
  try {
    if (!stored) {
      dispatch({
        type: SAVE,
        payload: {
          transId,
          preTrans,
          postTrans,
          translatedAudio,
          stored: true
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const clear = data => dispatch => {
  try {
    if (!data) {
      dispatch({ type: CLEAR });
    } else {
      dispatch({ type: CLEAR_ERROR });
    }
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
    const transId = uuidv4();
    const body = translateParams;
    const res = await axios.post("/api/translator", body);
    dispatch({
      type: TRANSLATE,
      payload: { transId, preTrans: formData, postTrans: res.data }
    });
    dispatch({
      type: PUSH_TRANS,
      payload: {
        transId,
        preTrans: formData,
        postTrans: res.data,
        translatedAudio: "",
        stored: false
      }
    });
  } catch (err) {
    console.log(err);
  }
};

export const textToSpeech = data => async dispatch => {
  const { preTrans, postTrans, speaking, transId, stored, audioContext } = data;
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
    fileReader.onload = function (event) {
      const result = event.target.result;
      if (!result) {
        dispatch(
          save({
            preTrans,
            postTrans,
            transId,
            stored
          })
        );
        if (speaking) {
          throw new Error(
            "There was a problem converting text to audio. TextToSpeech service unavailable."
          );
        }
      }
      if (result) {
        dispatch({
          type: STORE_TRANSLATED_AUDIO,
          payload: { translatedAudio: result, transId }
        });
        if (speaking) {
          dispatch(
            speak({
              preTrans,
              postTrans,
              translatedAudio: result,
              speaking,
              transId,
              stored,
              audioContext
            })
          );
        } else {
          dispatch(
            save({
              preTrans,
              postTrans,
              translatedAudio: result,
              transId,
              stored
            })
          );
        }
      }
    };
    fileReader.readAsDataURL(blob);
  } catch (err) {
    dispatch({
      type: ERROR,
      payload: {
        name: err.name,
        message: err.message
      }
    });
  }
};

export const speak = data => async dispatch => {
  const {
    preTrans,
    postTrans,
    translatedAudio,
    speaking,
    transId,
    stored,
    audioContext
  } = data;
  try {
    if (!speaking) {
      dispatch(save({ preTrans, postTrans, translatedAudio, transId, stored }));
    } else {
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
      fileReader.onload = function (event) {
        const result = event.target.result;
        playSound(audioContext, result);
      };
      fileReader.readAsArrayBuffer(dataURLtoBlob(translatedAudio));
      dispatch({
        type: SPEAK
      });
      dispatch(save({ preTrans, postTrans, translatedAudio, transId, stored }));
    }
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
