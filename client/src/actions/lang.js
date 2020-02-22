import axios from "axios";
import { TRANSLATE } from "./types";

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

export const speak = async postTrans => {
  try {
    const synthesizeParams = {
      text: postTrans,
      accept: "audio/wav",
      voice: "es-ES_LauraVoice"
    };

    const config = {
      responseType: "arraybuffer"
    };

    const body = synthesizeParams;

    const res = await axios.post("/api/translator/speak", body, config);

    const audio = res.data;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();
    const source = audioCtx.createBufferSource();
    const decodedData = await audioCtx.decodeAudioData(audio);
    source.buffer = decodedData;

    source.connect(audioCtx.destination);
    source.start();
    console.log("hello");
  } catch (err) {
    console.log(err);
  }
};
