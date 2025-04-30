(() => {
    const video = document.querySelector("video");
    if (!video) return;
  
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
    const dataUrl = canvas.toDataURL("image/jpeg");
  
    chrome.runtime.sendMessage({
      type: "video-frame",
      data: dataUrl
    });
  
    console.log("Frame captured and sent");
  })();
  