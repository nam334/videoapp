setTimeout(() => {
  if (db) {
    //need to retrieve data

    //video retrieval

    let dbTransaction = db.transaction("video", "readonly");
    let videoStore = dbTransaction.objectStore("video");
    let videoRequest = videoStore.getAll(); //event driven
    videoRequest.onsuccess = (e) => {
      let videoResult = videoRequest.result;
      let galleryCont = document.querySelector(".gallery-cont");
      videoResult.forEach((videoObj) => {
        let mediaElem = document.createElement("div");
        mediaElem.setAttribute("class", "media-cont");
        mediaElem.setAttribute("id", videoObj.id);
        let url = URL.createObjectURL(videoObj.blobData);

        mediaElem.innerHTML = `
        <div class="media">
                <video src="${url}" autoplay loop></video>
        </div>
        <div class="galleryButtons">
        <div class="delete action-btn">Delete</div>
        <div class="download action-btn">Download</div>
        </div>
        
        `;

        galleryCont.appendChild(mediaElem);
        //listeners
        let deleteBtn = mediaElem.querySelector(".delete");
        deleteBtn.addEventListener("click", deleteListener);
        let downloadBtn = mediaElem.querySelector(".download");
        downloadBtn.addEventListener("click", downloadListener);
      });
    };

    //image retrieval
    let dbImgTransaction = db.transaction("image", "readonly");
    let imageStore = dbImgTransaction.objectStore("image");
    let imageRequest = imageStore.getAll(); //event driven
    imageRequest.onsuccess = (e) => {
      let imageResult = imageRequest.result;
      let galleryCont = document.querySelector(".gallery-cont");
      imageResult.forEach((imageObj) => {
        let mediaElem = document.createElement("div");
        mediaElem.setAttribute("class", "media-cont");
        mediaElem.setAttribute("id", imageObj.id);
        let url = imageObj.url;

        mediaElem.innerHTML = `
        <div class="media">
                <img src="${url}" />
        </div>
         <div class="galleryButtons">
        <div class="delete action-btn">Delete</div>
        <div class="download action-btn">Download</div>
       </div>
        `;

        galleryCont.appendChild(mediaElem);
        //listeners

        let deleteBtn = mediaElem.querySelector(".delete");
        deleteBtn.addEventListener("click", deleteListener);
        let downloadBtn = mediaElem.querySelector(".download");
        downloadBtn.addEventListener("click", downloadListener);
      });
    };
  }
}, 100);

//UI delete
//db delete
function deleteListener(e) {
  //DB removal
  //let id = e.target.parentElement.getAttribute("id");
  let vid = e.target.parentElement;
  let id = vid.parentElement.getAttribute("id");
  console.log(id);
  let type = id.slice(0, 3);
  if (type === "vid") {
    let dbTransaction = db.transaction("video", "readwrite");
    let videoStore = dbTransaction.objectStore("video");
    videoStore.delete(id);
    // vid.remove();
  } else if (type === "img") {
    let dbImgTransaction = db.transaction("image", "readwrite");
    let imageStore = dbImgTransaction.objectStore("image");
    imageStore.delete(id);
    // vid.remove();
  }

  //UI removal
  let l = e.target.parentElement;
  console.log(e.target.parentElement, vid.parentElement);
  vid.parentElement.remove();
}

function downloadListener(e) {
  // let id = e.target.parentElement.getAttribute("id");
  let vid = e.target.parentElement;
  let id = vid.parentElement.getAttribute("id");
  let type = id.slice(0, 3);
  if (type === "vid") {
    let dbTransaction = db.transaction("video", "readwrite");
    let videoStore = dbTransaction.objectStore("video");
    let videoRequest = videoStore.get(id);
    videoRequest.onsuccess = (e) => {
      let videoResult = videoRequest.result;
      let videoURL = URL.createObjectURL(videoResult.blobData);

      let a = document.createElement("a");
      a.href = videoURL;
      a.download = "stream.mp4";
      a.click();

      console.log(videoResult);
    };
  } else if (type === "img") {
    let imageDBTransaction = db.transaction("image", "readwrite");
    let imageStore = imageDBTransaction.objectStore("image");
    let imageRequest = imageStore.get(id);
    imageRequest.onsuccess = (e) => {
      let imageResult = imageRequest.result;

      let a = document.createElement("a");
      a.href = imageResult.url;
      a.download = "img.jpg";
      a.click();

      console.log(imageResult);
    };
  }
}
