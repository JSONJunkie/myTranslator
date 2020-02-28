import axios from "axios";

import { TRANSLATE } from "./types";
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

export const speak = async postTrans => {
  try {
    const synthesizeParams = {
      text: postTrans,
      accept: "audio/mp3",
      voice: "es-ES_LauraVoice"
    };

    const config = {
      responseType: "blob"
    };

    const body = synthesizeParams;

    const res = await axios.post("/api/translator/speak", body, config);

    const audio = res.data;

    const config2 = {
      headers: {
        "Content-Type": "blob.type"
      }
    };

    const res2 = await axios.post("/api/translator/listen", audio, config2);
    // playSound(audio)
  } catch (err) {
    console.log(err);
  }
};

export const listen = async audio => {
  try {
    // console.log(audio);
    // const data = new FormData();
    // data.append("audio", audio, audio.name);
    // const body = data;
    // console.log(data);
    // const config = {
    //   headers: { "Content-Type": "multipart/form-data" }
    // };
    // const res = await axios.post("/api/translator/listen", body, config);
    // const audio = res.data;
    // playSound(audio);
  } catch (err) {
    console.log(err);
  }
};
