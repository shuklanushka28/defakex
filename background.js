// background.js

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "check-image",
    title: "Check Image for Deepfake",
    contexts: ["image"]
  });
  chrome.contextMenus.create({
    id: "check-video",
    title: "Check Video for Deepfake",
    contexts: ["video"]
  });
  console.log("Extension installed and context menu created");
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "check-image") {
    console.log("Right-click detected on image:", info.srcUrl);
    fetchAndSendImage(info.srcUrl);
  }

  if (info.menuItemId === "check-video") {
    console.log("Right-click detected on media:", info.srcUrl);
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["inject.js"]
    });
  }
});

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.type === "video-frame") {
    console.log("Received frame from video");

    try {
      const blob = await (await fetch(message.data)).blob();
      console.log("Converted dataURL to blob:", blob);

      const formData = new FormData();
      formData.append("file", blob, "frame.jpg");

      console.log("Sending to Flask...");

      const response = await fetch("http://127.0.0.1:5000/predict-image", {
        method: "POST",
        body: formData
      });

      const result = await response.json();
      console.log("Received result from Flask:", result);

      chrome.notifications.create({
        type: "basic",
        iconUrl: "icon.png",
        title: "Deepfake Detection Result (Video)",
        message: `Prediction: ${result.label.toUpperCase()} (${(result.confidence * 100).toFixed(2)}%)`
      });
    } catch (err) {
      console.error("Error sending frame:", err);
    }
  }
});

async function fetchAndSendImage(imageUrl) {
  console.log("fetchAndSendImage called with:", imageUrl);
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    console.log("Fetched blob:", blob);

    const formData = new FormData();
    formData.append("file", blob, "image.jpg");

    console.log("Sending image to Flask API...");

    const res = await fetch("http://127.0.0.1:5000/predict-image", {
      method: "POST",
      body: formData
    });

    const result = await res.json();
    console.log("Received prediction:", result);

    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon.png",
      title: "Deepfake Detection Result",
      message: `Prediction: ${result.label.toUpperCase()} (${(result.confidence * 100).toFixed(2)}%)`
    });
  } catch (error) {
    console.error("Error during fetch/send:", error);
  }
}
