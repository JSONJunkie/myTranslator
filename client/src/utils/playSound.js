export default function playSound(audio) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioCtx = new AudioContext();
  const buffer = audioCtx.createBuffer(1, 1, 22050);
  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(audioCtx.destination);
  if (source.start) {
    source.start(0);
  } else if (source.play) {
    source.play(0);
  } else if (source.noteOn) {
    source.noteOn(0);
  }
  const bufferSound = audio => {
    audioCtx.decodeAudioData(
      audio,
      buffer => {
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        if (source.start) {
          source.start(0);
        } else if (source.play) {
          source.play(0);
        } else if (source.noteOn) {
          source.noteOn(0);
        }
      },
      function(err) {
        console.log("Error with decoding audio data" + err);
      }
    );
  };
  bufferSound(audio);
}
