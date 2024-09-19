let video = document.querySelector("video");
let recordBtnCont = document.querySelector(".record-btn-cont");
let recordBtn = document.querySelector(".record-btn");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let captureBtn = document.querySelector(".capture-btn");
let recordFlag = false;
let transparentColor = "transparent";

let recorder;
let chunks = []; //media data in chunks

let constraints = {
  video: true,
  audio: true,
};

//navigator -> global, browser info

// The getUserMedia() method of the MediaDevices interface prompts the user for permission to use a media input which produces
// a MediaStream with tracks containing the requested types of media.That stream can include, for example,
// a video track (produced by either a hardware or virtual video source such as a camera, video recording device,
// screen sharing service, and so forth), an audio track (similarly, produced by a physical or virtual audio source
// like a microphone, A/D converter, or the like), and possibly other track types.

navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
  video.srcObject = stream;
  recorder = new MediaRecorder(stream);
  //   The MediaRecorder interface of the MediaStream Recording API provides functionality to easily record media.
  //    It is created using the MediaRecorder() constructor.
  recorder.addEventListener("start", (e) => {
    chunks = [];
  });
  recorder.addEventListener("dataavailable", (e) => {
    chunks.push(e.data);
  });

  recorder.addEventListener("stop", (e) => {
    //conversion of media chuks data to video
    let blob = new Blob(chunks, { type: "video/mp4" });
    let videoURL = window.URL.createObjectURL(blob);

    if (db) {
      let videoId = shortid();
      let dbTransaction = db.transaction("video", "readwrite");
      let videoStore = dbTransaction.objectStore("video");
      let videoEntry = {
        id: `vid-${videoId}`,
        blobData: blob,
      };
      videoStore.add(videoEntry);
    }
    //download functionality
    // let a = document.createElement("a");
    // a.href = videoURL;
    // a.download = "stream.mp4";
    // a.click();
  });
});

recordBtnCont.addEventListener("click", (e) => {
  if (!recorder) return;
  recordFlag = !recordFlag;

  if (recordFlag) {
    //start
    recorder.start();
    recordBtn.classList.add("scale-record");
    startTimer();
  } else {
    //end
    recorder.stop();
    recordBtn.classList.remove("scale-record");
    stopTimer();
  }
});

captureBtnCont.addEventListener("click", (e) => {
  captureBtn.classList.add("scale-capture");

  let canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  let tool = canvas.getContext("2d");
  tool.drawImage(video, 0, 0, canvas.width, canvas.height);

  //filtering
  tool.fillStyle = transparentColor;
  tool.fillRect(0, 0, canvas.width, canvas.height);
  let imageURL = canvas.toDataURL();

  if (db) {
    let imageId = shortid();
    let dbTransaction = db.transaction("image", "readwrite");
    let imageStore = dbTransaction.objectStore("image");
    let imageEntry = {
      id: `img-${imageId}`,
      url: imageURL,
    };
    imageStore.add(imageEntry);
  }

  // let a = document.createElement("a");
  // a.href = imageURL;
  // a.download = "img.jpg";
  // a.click();

  setTimeout(() => {
    captureBtn.classList.remove("scale-capture");
  }, 500);
});

let timerId;
let counter = 0;
let timer = document.querySelector(".timer");
function startTimer() {
  timer.style.display = "block";
  function displayTimer() {
    let totalSeconds = counter;
    let hours = Number.parseInt(counter / 3600);
    totalSeconds = totalSeconds % 3600; //remaining value
    let minutes = Number.parseInt(totalSeconds / 60);
    totalSeconds = totalSeconds % 60;
    let seconds = totalSeconds;

    hours = hours < 10 ? `0 ${hours}` : hours;
    minutes = minutes < 10 ? `0 ${minutes}` : minutes;
    seconds = seconds < 10 ? `0 ${seconds}` : seconds;

    timer.innerText = `${hours} : ${minutes} : ${seconds}`;
    counter++;
  }
  timerId = setInterval(displayTimer, 1000);
}

function stopTimer() {
  timer.style.display = "none";
  clearInterval(timerId);
  timer.innerText = "00:00:00";
}

//video consists of frames, it is a collection of frames
//each frame is an image which should be donwloaded

//Filtering logic
let filterLayer = document.querySelector(".filter-layer");
let allFilters = document.querySelectorAll(".filter");
allFilters.forEach((filterElem) => {
  filterElem.addEventListener("click", (e) => {
    //get
    transparentColor =
      getComputedStyle(filterElem).getPropertyValue("background-color");
    filterLayer.style.backgroundColor = transparentColor;
  });
});
