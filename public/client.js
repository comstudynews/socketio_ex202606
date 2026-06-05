const socket = io();

const statusEl = document.querySelector("#status");
const messagesEl = document.querySelector("#messages");
const formEl = document.querySelector("#message-form");
const inputEl = document.querySelector("#message-input");

function addMessage({ text, type = "chat", mine = false, sentAt = null }) {
  const item = document.createElement("li");
  item.className = `message ${type}`;

  if (mine) {
    item.classList.add("mine");
  }

  const body = document.createElement("span");
  body.textContent = text;
  item.appendChild(body);

  if (sentAt) {
    const time = document.createElement("time");
    time.dateTime = sentAt;
    time.textContent = new Intl.DateTimeFormat("ko-KR", {
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(sentAt));
    item.appendChild(time);
  }

  messagesEl.appendChild(item);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

socket.on("connect", () => {
  statusEl.textContent = "Online";
  statusEl.classList.add("online");
  addMessage({ text: "서버에 연결되었습니다.", type: "system" });
});

socket.on("disconnect", () => {
  statusEl.textContent = "Offline";
  statusEl.classList.remove("online");
  addMessage({ text: "서버 연결이 끊겼습니다.", type: "system" });
});

socket.on("system:message", (message) => {
  addMessage({ text: message, type: "system" });
});

socket.on("chat:message", (message) => {
  addMessage({
    text: message.text,
    mine: message.id === socket.id,
    sentAt: message.sentAt
  });
});

formEl.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = inputEl.value.trim();

  if (!text) {
    return;
  }

  socket.emit("chat:message", text);
  inputEl.value = "";
  inputEl.focus();
});
