// Firebaseの設定（自分のプロジェクトに合わせて変更）
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBXOFcxPcYBOWbd7dQQfV0YIvdBLBv2uUs",
  authDomain: "image-editor-bd575.firebaseapp.com",
  projectId: "image-editor-bd575",
  storageBucket: "image-editor-bd575.firebasestorage.app",
  messagingSenderId: "61786110941",
  appId: "1:61786110941:web:ddd555cf5bd0c1b291d434",
  measurementId: "G-0NVLXBGFN6"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage, ref, uploadBytes, getDownloadURL };
