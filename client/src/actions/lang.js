import axios from "axios";
import { TRANSLATE } from "./types";

export const translate = formData => async dispatch => {
  try {
    const body = formData;

    const res = await axios.post("/api/translator", body);
    dispatch({
      type: TRANSLATE,
      payload: { preTrans: formData, postTrans: res.data }
    });
  } catch (err) {
    // console.log(err);
  }

  //   console.log(res.data);
  //   console.log(payload);
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
    // console.log(res.data);
    // console.log(res);
    const audio = res.data;
    const audioCtx = new AudioContext();
    const source = audioCtx.createBufferSource();
    // var source = null;
    audioCtx.decodeAudioData(audio, function(buffer) {
      source.buffer = buffer;

      source.connect(audioCtx.destination);
      // source.loop = true;
    });

    console.log(typeof audio);

    // source = buf;
    source.connect(audioCtx.destination);
    source.start();
  } catch (err) {
    console.log(err);
  }
};
