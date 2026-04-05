// Firebase 기본
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";

// Auth
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

// Firestore
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs 
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

// Storage
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-storage.js";


// 🔥 네 config 그대로 넣음
const firebaseConfig = {
  apiKey: "AIzaSyB1OFbMd0tAj7WADxVKtSWsNlSV1YgV-Po",
  authDomain: "koreatube.firebaseapp.com",
  projectId: "koreatube",
  storageBucket: "koreatube.firebasestorage.app",
  messagingSenderId: "71769667172",
  appId: "1:71769667172:web:906cc4b0ba4af8b04e5171",
  measurementId: "G-3073EM5ZYP"
};

// 초기화
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


// UI 요소
const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const uploadBtn = document.getElementById("uploadBtn");

const username = document.getElementById("username");
const password = document.getElementById("password");

const videoInput = document.getElementById("videoInput");
const titleInput = document.getElementById("titleInput");

const videoList = document.getElementById("videoList");


// 회원가입
signupBtn.onclick = async () => {
  try {
    await createUserWithEmailAndPassword(auth, username.value, password.value);
    alert("회원가입 성공!");
  } catch (e) {
    alert(e.message);
  }
};


// 로그인
loginBtn.onclick = async () => {
  try {
    await signInWithEmailAndPassword(auth, username.value, password.value);
    alert("로그인 성공!");
  } catch (e) {
    alert(e.message);
  }
};


// 영상 업로드
uploadBtn.onclick = async () => {
  if (!auth.currentUser) {
    alert("로그인 먼저 해주세요!");
    return;
  }

  const file = videoInput.files[0];
  const title = titleInput.value;

  if (!file || !title) {
    alert("입력 부족!");
    return;
  }

  try {
    const storageRef = ref(storage, "videos/" + Date.now() + "_" + file.name);
    await uploadBytes(storageRef, file);

    const url = await getDownloadURL(storageRef);

    await addDoc(collection(db, "videos"), {
      title: title,
      url: url,
      user: auth.currentUser.email
    });

    alert("업로드 완료!");
    loadVideos();

  } catch (e) {
    alert("업로드 실패: " + e.message);
  }
};


// 영상 불러오기 (🔥 새로고침 유지)
async function loadVideos() {
  videoList.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "videos"));

  querySnapshot.forEach(doc => {
    const v = doc.data();

    const div = document.createElement("div");
    div.className = "video-card";

    div.innerHTML = `
      <video src="${v.url}" controls></video>
      <h3>${v.title}</h3>
      <p>채널: ${v.user}</p>
    `;

    videoList.appendChild(div);
  });
}


// 처음 실행
loadVideos();
