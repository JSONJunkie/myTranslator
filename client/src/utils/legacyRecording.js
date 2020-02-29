export default function(constraints) {
  const getUserMedia =
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

  if (!getUserMedia) {
    return Promise.reject(new Error("This browser is not supported"));
  }

  return new Promise(function(resolve, reject) {
    getUserMedia.call(navigator, constraints, resolve, reject);
  });
}
