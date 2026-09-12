let cameraStream = null;

async function startCamera() {
  const video = document.getElementById("camera");
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
      audio: false
    });
    video.srcObject = cameraStream;
  } catch (error) {
    console.error("Camera Error:", error);
    alert("ไม่สามารถเปิด Webcam ได้");
  }
}

function stopCamera() {
  if (!cameraStream) return;
  cameraStream.getTracks().forEach(track => track.stop());
  cameraStream = null;
}

async function captureFace() {
  const video = document.getElementById("camera");
  const canvas = document.getElementById("faceCanvas");
  const ctx = canvas.getContext("2d");

  if (!video.videoWidth) {
    alert("Camera ยังไม่พร้อม");
    return;
  }

  const size = Math.min(video.videoWidth, video.videoHeight);
  canvas.width = 700;
  canvas.height = 700;

  const sx = (video.videoWidth - size) / 2;
  const sy = (video.videoHeight - size) / 2;

  ctx.save();
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, sx, sy, size, size, 0, 0, canvas.width, canvas.height);
  ctx.restore();

  const dataUrl = canvas.toDataURL("image/png");
  setState("faceDataUrl", dataUrl);

  // document.getElementById("astronautFace").src=dataUrl;
  document.getElementById("finalFace").src = dataUrl;

  stopCamera();
}