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
  DELETE_SAVED,
  PUSH_TRANS,
  ERROR,
  CLEAR_ERROR,
} from "./types";
import playSound from "../utils/playSound";

export const deleteSaved = ({ transId, rollbar }) => (dispatch) => {
  try {
    dispatch({
      type: DELETE_SAVED,
      payload: { transId },
    });
  } catch (err) {
    rollbar.error(err);
    dispatch({
      type: ERROR,
      payload: {
        name: err.name,
        message: err.message,
      },
    });
  }
};

export const save = ({
  preTrans,
  postTrans,
  translatedAudio,
  transId,
  stored,
  rollbar,
}) => (dispatch) => {
  try {
    if (!stored) {
      dispatch({
        type: SAVE,
        payload: {
          transId,
          preTrans,
          postTrans,
          translatedAudio,
          stored: true,
        },
      });
    }
  } catch (err) {
    rollbar.error(err);
    dispatch({
      type: ERROR,
      payload: {
        name: err.name,
        message: err.message,
      },
    });
  }
};

export const clear = ({ data, rollbar }) => (dispatch) => {
  try {
    if (!data) {
      dispatch({ type: CLEAR });
    } else {
      dispatch({ type: CLEAR_ERROR });
    }
  } catch (err) {
    rollbar.error(err);
    dispatch({
      type: ERROR,
      payload: {
        name: err.name,
        message: err.message,
      },
    });
  }
};

export const translate = ({ formData, rollbar }) => async (dispatch) => {
  try {
    const translateParams = {
      text: formData,
      modelId: "en-es",
    };
    const transId = uuidv4();
    const body = translateParams;
    const res = await axios.post(
      process.env.BASE_PATH + "/api/translator",
      body
    );
    dispatch({
      type: TRANSLATE,
      payload: { transId, preTrans: formData, postTrans: res.data },
    });
    dispatch({
      type: PUSH_TRANS,
      payload: {
        transId,
        preTrans: formData,
        postTrans: res.data,
        translatedAudio: "",
        stored: false,
      },
    });
  } catch (err) {
    if (err.response) {
      const errors = err.response.data.errors;
      if (errors) {
        return dispatch({
          type: ERROR,
          payload: {
            name: errors.name,
            message: errors.message,
          },
        });
      }
    }
    rollbar.error(err);
    dispatch({
      type: ERROR,
      payload: {
        name: err.name,
        message: err.message,
      },
    });
  }
};

export const textToSpeech = ({ data, rollbar }) => async (dispatch) => {
  const { preTrans, postTrans, speaking, transId, stored, audioContext } = data;
  try {
    const synthesizeParams = {
      text: postTrans,
      accept: "audio/mp3",
      voice: "es-ES_LauraVoice",
    };
    const config = {
      responseType: "arraybuffer",
    };
    const body = synthesizeParams;
    const res = await axios.post(
      process.env.BASE_PATH + "/api/translator/speak",
      body,
      config
    );
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
            stored,
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
          payload: { translatedAudio: result, transId },
        });
        if (speaking) {
          dispatch(
            speak({
              data: {
                preTrans,
                postTrans,
                translatedAudio: result,
                speaking,
                transId,
                stored,
                audioContext,
              },
            })
          );
        } else {
          dispatch(
            save({
              preTrans,
              postTrans,
              translatedAudio: result,
              transId,
              stored,
            })
          );
        }
      }
    };
    fileReader.readAsDataURL(blob);
  } catch (err) {
    if (err.response) {
      const errors = err.response.data.errors;
      if (errors) {
        return dispatch({
          type: ERROR,
          payload: {
            name: errors.name,
            message: errors.message,
          },
        });
      }
    }
    rollbar.error(err);
    dispatch({
      type: ERROR,
      payload: {
        name: err.name,
        message: err.message,
      },
    });
  }
};

export const speak = ({ data, rollbar }) => async (dispatch) => {
  const {
    preTrans,
    postTrans,
    translatedAudio,
    speaking,
    transId,
    stored,
    audioContext,
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
        type: SPEAK,
      });
      dispatch(save({ preTrans, postTrans, translatedAudio, transId, stored }));
    }
  } catch (err) {
    rollbar.error(err);
    dispatch({
      type: ERROR,
      payload: {
        name: err.name,
        message: err.message,
      },
    });
  }
};

export const listen = ({ blob, rollbar }) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "blob.type",
      },
    };
    const transcribedRes = await axios.post(
      process.env.BASE_PATH + "/api/translator/listen",
      blob,
      config
    );
    dispatch({
      type: LISTEN,
      payload: { transcribed: transcribedRes.data },
    });
    const translateParams = {
      text: transcribedRes.data,
      modelId: "es-en",
    };
    const body = translateParams;
    const translatedRes = await axios.post(
      process.env.BASE_PATH + "/api/translator",
      body
    );
    dispatch({
      type: TRANSLATE_TRANSCRIPTION,
      payload: { translatedTranscription: translatedRes.data },
    });
  } catch (err) {
    if (err.response) {
      const errors = err.response.data.errors;
      if (errors) {
        return dispatch({
          type: ERROR,
          payload: {
            name: errors.name,
            message: errors.message,
          },
        });
      }
    }
    rollbar.error(err);
    dispatch({
      type: ERROR,
      payload: {
        name: err.name,
        message: err.message,
      },
    });
  }
};
