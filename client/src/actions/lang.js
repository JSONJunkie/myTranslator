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
      accept: "audio/mp3",
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
    const bufferSound = audio => {
      audioCtx.decodeAudioData(
        audio,
        buffer => {
          const source = audioCtx.createBufferSource();
          source.buffer = buffer;
          source.connect(audioCtx.destination);
          source.start(0);
        },
        function(err) {
          console.log("hell");
          if (err) console.log("Error with decoding audio data" + err);
        }
      );
    };
    bufferSound(audio);
  } catch (err) {
    console.log(err);
  }
};
