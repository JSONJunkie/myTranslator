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
    // const oscillator = audioCtx.createOscillator();
    // oscillator.frequency.value = 400;
    // oscillator.connect(audioCtx.destination);
    // oscillator.start(0);
    // oscillator.stop(0.5);
    // const decodedData = await audioCtx.decodeAudioData(audio);
    // source.buffer = decodedData;
    // function bufferSound(audio) {
    //   var mySource;

    //   var source = audioCtx.createBufferSource();
    //   source.buffer = audioCtx.createBuffer(audio, false);
    //   mySource = source;
    //   mySource.start();
    // }
    // let audioBuffer;
    // console.log(audio);
    var playSoundBuffer;
    const bufferSound = audio => {
      console.log(audio);

      audioCtx.decodeAudioData(
        audio,
        buffer => {
          playSoundBuffer = buffer;
          playSound();

          // console.log("hello");
          // const source = audioCtx.createBufferSource();
          // source.buffer = buffer;
          // source.connect(audioCtx.destination);
          // source.start(0);
        },
        function(err) {
          console.log("hell");
          if (err) console.log("Error with decoding audio data" + err);
        }
      );

      console.log(audio);
    };
    function playSound() {
      console.log(playSoundBuffer);
      var source = audioCtx.createBufferSource();
      source.buffer = playSoundBuffer; // This is the line that generates the error
      source.connect(audioCtx.destination);
      source.start(0);
    }
    bufferSound(audio);

    // audioCtx.decodeAudioData(
    //   audio,
    //   buffer => {
    //     audioBuffer = buffer;
    //     console.log(audioBuffer);
    //     source.buffer = audioBuffer;
    //     source.connect(audioCtx.destination);
    //   },

    //   function(err) {
    //     if (err) console.log("Error with decoding audio data" + err);
    //   }
    // );
  } catch (err) {
    console.log(err);
  }
};
