import axios from "axios";
import { TRANSLATE } from "./types";

export const translate = formData => async dispatch => {
  try {
    const translateParams = {
      text: formData,
      modelId: "es-en"
    };
    const body = translateParams;

    const res = await axios.post("/api/translator", body);
    dispatch({
      type: TRANSLATE,
      payload: { preTrans: formData, postTrans: res.data }
    });
  } catch (err) {
    // console.log(err);
  }
};

export const speak = async data => {
  try {
    const synthesizeParams = {
      text: data,
      accept: "audio/wav",
      voice: "en-US_AllisonVoice"
    };

    const config = {
      responseType: "arraybuffer"
    };

    const body = synthesizeParams;

    const res = await axios.post("/api/translator/speak", body, config);

    const audio = res.data;
    const audioCtx = new AudioContext();
    const source = audioCtx.createBufferSource();

    audioCtx.decodeAudioData(audio).then(function(decodedData) {
      source.buffer = decodedData;
    });

    source.connect(audioCtx.destination);
    source.start();
  } catch (err) {
    console.log(err);
  }
};
