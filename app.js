import { storage, auth } from './firebase-config.js';
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-storage.js";
import {
  signInAnonymously
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

const fileInput = document.getElementById('fileInput');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const saveBtn = document.getElementById('saveBtn');

let image = new Image();
let startX, startY, isDrawing = false;

// 匿名ログイン
signInAnonymously(auth)
  .then(() => {
    console.log("匿名ログイン成功");
  })
  .catch((error) => {
    console.error("匿名ログイン失敗:", error);
  });

// ファイル選択 → Storageにアップロード → 表示
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const refPath = storageRef(storage, `originals/${file.name}`);
  await uploadBytes(refPath, file);
  const url = await getDownloadURL(refPath);

  image.src = url;
  image.onload = () => {
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
  };
});

// 四角範囲選択 → 白の縞模様描画
canvas.addEventListener('mousedown', (e) => {
  startX = e.offsetX;
  startY = e.offsetY;
  isDrawing = true;
});

canvas.addEventListener('mouseup', (e) => {
  if (!isDrawing) return;
  isDrawing = false;
  const endX = e.offsetX;
  const endY = e.offsetY;

  const x = Math.min(startX, endX);
  const y = Math.min(startY, endY);
  const w = Math.abs(endX - startX);
  const h = Math.abs(endY - startY);

  ctx.save();
  ctx.fillStyle = 'white';
  for (let i = 0; i < h; i += 10) {
    ctx.fillRect(x, y + i, w, 5);
  }
  ctx.restore();
});

// 保存ボタン → 編集後画像をダウンロード
saveBtn.addEventListener('click', () => {
  const editedBase64 = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = 'edited-image.png';
  link.href = editedBase64;
  link.click();
});
