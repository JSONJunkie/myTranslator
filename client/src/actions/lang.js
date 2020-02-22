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
    // const synthesizeParams = {
    //   text: postTrans,
    //   accept: "audio/wav",
    //   voice: "es-ES_LauraVoice"
    // };

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

    const node = {};
    node.url = "usual_mp3_with_tags_or_album_artwork.mp3";
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const context = new AudioContext();

    function syncStream(node) {
      // should be done by api itself. and hopefully will.
      var buf8 = new Uint8Array(node.buf);
      buf8.indexOf = Array.prototype.indexOf;
      var i = node.sync,
        b = buf8;
      while (1) {
        node.retry++;
        i = b.indexOf(0xff, i);
        if (i === -1 || b[i + 1] & 0xe0) break;
        i++;
      }
      if (i !== -1) {
        var tmp = node.buf.slice(i); //carefull there it returns copy
        delete node.buf;
        node.buf = null;
        node.buf = tmp;
        node.sync = i;
        return true;
      }
      return false;
    }

    function decode(node) {
      try {
        context.decodeAudioData(
          node.buf,
          function(decoded) {
            console.log("hello");
            console.log(decoded);
            node.source = context.createBufferSource();
            node.source.connect(context.destination);
            node.source.buffer = decoded;
            node.source.start(0);
          },
          function() {
            // only on error attempt to sync on frame boundary
            console.log(syncStream(node));
            if (syncStream(node)) decode(node);
          }
        );
      } catch (err) {
        console.log(err);
      }
    }

    function playSound(node) {
      node.buf = audio;
      node.sync = 0;
      node.retry = 0;
      decode(node);
    }

    playSound(node);
    // const AudioContext = window.AudioContext || window.webkitAudioContext;
    // const audioCtx = new AudioContext();
    // // const oscillator = audioCtx.createOscillator();
    // // oscillator.frequency.value = 400;
    // // oscillator.connect(audioCtx.destination);
    // // oscillator.start(0);
    // // oscillator.stop(0.5);
    // // const decodedData = await audioCtx.decodeAudioData(audio);
    // // source.buffer = decodedData;
    // // function bufferSound(audio) {
    // //   var mySource;

    // //   var source = audioCtx.createBufferSource();
    // //   source.buffer = audioCtx.createBuffer(audio, false);
    // //   mySource = source;
    // //   mySource.start();
    // // }
    // // let audioBuffer;
    // // console.log(audio);
    // var playSoundBuffer;
    // const bufferSound = audio => {
    //   console.log(audio);

    //   audioCtx.decodeAudioData(
    //     audio,
    //     buffer => {
    //       playSoundBuffer = buffer;
    //       playSound();

    //       // console.log("hello");
    //       // const source = audioCtx.createBufferSource();
    //       // source.buffer = buffer;
    //       // source.connect(audioCtx.destination);
    //       // source.start(0);
    //     },
    //     function(err) {
    //       console.log("hell");
    //       if (err) console.log("Error with decoding audio data" + err);
    //     }
    //   );

    //   console.log(audio);
    // };
    // function playSound() {
    //   console.log(playSoundBuffer);
    //   var source = audioCtx.createBufferSource();
    //   source.buffer = playSoundBuffer; // This is the line that generates the error
    //   source.connect(audioCtx.destination);
    //   source.start(0);
    // }
    // bufferSound(audio);

    // // audioCtx.decodeAudioData(
    // //   audio,
    // //   buffer => {
    // //     audioBuffer = buffer;
    // //     console.log(audioBuffer);
    // //     source.buffer = audioBuffer;
    // //     source.connect(audioCtx.destination);
    // //   },

    // //   function(err) {
    // //     if (err) console.log("Error with decoding audio data" + err);
    // //   }
    // // );
  } catch (err) {
    console.log(err);
  }
};
