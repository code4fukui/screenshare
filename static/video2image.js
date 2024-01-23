import { Base64 } from "https://code4fukui.github.io/Base64/Base64.js";

export const video2image = (video, ctype = "image/png", opt) => {
  const canvas = document.createElement("canvas");
  canvas.height = video.videoHeight;
  canvas.width = video.videoWidth;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const s = canvas.toDataURL(ctype, opt);
  const bin = Base64.decode(s.substring(s.indexOf(",") + 1));
  return bin;
};
export const video2png = (video) => {
  return video2image(video, "image/png");
};
export const video2jpg = (video, quality = 0.9) => {
  return video2image(video, "image/jpeg", quality);
};
