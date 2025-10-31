import { storage, ref, uploadBytes, getDownloadURL } from './firebase-config.js';

const fileInput = document.getElementById('fileInput');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const saveBtn = document.getElementById('saveBtn');

let image = new Image();
let startX, startY, isDrawing = false;

fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Firebase Storage にアップロード
  const storageRef = ref(storage, `originals/${file.name}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);

  // 画像を表示
  image.src = url;
  image.onload = () => {
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
  };
});

// 四角範囲の選択と縞模様描画
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

  // 白の縞模様を描画
  ctx.save();
  ctx.fillStyle = 'white';
  for (let i = 0; i < h; i += 10) {
    ctx.fillRect(x, y + i, w, 5);
  }
  ctx.restore();
});

// 保存ボタンで画像を保存
saveBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'edited-image.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});
