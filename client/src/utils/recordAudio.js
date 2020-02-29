export default async function recordAudio() {
  try {
    const constraints = { audio: true };

    let stream = null;
    if (navigator.mediaDevices.getUserMedia === undefined) {
      navigator.mediaDevices.getUserMedia = function(constraints) {
        const getUserMedia =
          navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        if (!getUserMedia) {
          return Promise.reject(new Error("This browser is not supported"));
        }

        return new Promise(function(resolve, reject) {
          getUserMedia.call(navigator, constraints, resolve, reject);
        });
      };
    }
    setTimeout(() => {
      mediaRecorder.stop();
      console.log("recording stopping");
    }, 2000);
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start(500);
    console.log("recording starting");
    let chunks = [];

    mediaRecorder.ondataavailable = function(e) {
      chunks.push(e.data);
      console.log("chunk collected");
    };

    mediaRecorder.onstop = function(e) {
      const blob = new Blob(chunks, { type: "audio/webm" });
      console.log("recording stopping");
      chunks = [];
      const recordedURL = URL.createObjectURL(blob);
      localStorage.setItem("recordedAudio", JSON.stringify(recordedURL));
    };
  } catch (err) {
    console.log(err);
  }
}
