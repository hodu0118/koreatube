import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";

import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs 
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-storage.js";


// 🔥 Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyB1OFbMd0tAj7WADxVKtSWsNlSV1YgV-Po",
  authDomain: "koreatube.firebaseapp.com",
  projectId: "koreatube",
  storageBucket: "koreatube.firebasestorage.app",
  messagingSenderId: "71769667172",
  appId: "1:71769667172:web:906cc4b0ba4af8b04e5171"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


// 🔐 회원가입
document.getElementById("signup").onclick = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("회원가입 성공!");
  } catch (e) {
    alert(e.message);
  }
};


// 🔑 로그인
document.getElementById("login").onclick = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("로그인 성공!");
  } catch (e) {
    alert(e.message);
  }
};


// 📤 업로드
document.getElementById("upload").onclick = async () => {
  const file = document.getElementById("file").files[0];
  const title = document.getElementById("title").value;

  if (!file) return alert("파일 선택해!");

  const storageRef = ref(storage, "videos/" + file.name);

  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);

  await addDoc(collection(db, "videos"), {
    title: title,
    url: url
  });

  alert("업로드 완료!");
  loadVideos();
};


// 🎬 영상 불러오기
async function loadVideos() {
  const videosDiv = document.getElementById("videos");
  videosDiv.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "videos"));

  querySnapshot.forEach((doc) => {
    const data = doc.data();

    const div = document.createElement("div");
    div.className = "video-box";

    div.innerHTML = `
      <h4>${data.title}</h4>
      <video controls src="${data.url}"></video>
    `;

    videosDiv.appendChild(div);
  });
}


// 🔄 페이지 로드시 실행
loadVideos();
