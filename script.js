const uploadModal = document.getElementById("uploadModal");
const loginModal = document.getElementById("loginModal");

const uploadOpenBtn = document.getElementById("uploadOpenBtn");
const loginOpenBtn = document.getElementById("loginOpenBtn");

const uploadBtn = document.getElementById("uploadBtn");
const videoInput = document.getElementById("videoInput");
const titleInput = document.getElementById("titleInput");

const videoList = document.getElementById("videoList");

let currentUser = null;
let users = [];
let videos = [];

// 모달 열기
uploadOpenBtn.onclick = () => uploadModal.style.display = "block";
loginOpenBtn.onclick = () => loginModal.style.display = "block";

function closeModal(id) {
  document.getElementById(id).style.display = "none";
}

// 회원가입
document.getElementById("signupBtn").onclick = () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  users.push({ username, password });
  alert("회원가입 완료!");
};

// 로그인
document.getElementById("loginBtn").onclick = () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    currentUser = user;
    alert("로그인 성공!");
    closeModal("loginModal");
  } else {
    alert("로그인 실패");
  }
};

// 영상 업로드
uploadBtn.onclick = () => {
  if (!currentUser) {
    alert("로그인 먼저 해주세요!");
    return;
  }

  const file = videoInput.files[0];
  const title = titleInput.value;

  if (!file || !title) {
    alert("입력 부족!");
    return;
  }

  const url = URL.createObjectURL(file);

  videos.push({
    title,
    url,
    user: currentUser.username
  });

  renderVideos();
  closeModal("uploadModal");
};

// 렌더링
function renderVideos() {
  videoList.innerHTML = "";

  videos.forEach(v => {
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
