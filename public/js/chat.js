// import './util.js'

const { userName, roomId} = Qs.parse(location.search, {ignoreQueryPrefix : true})

const container = document.getElementById('container')
const message = document.getElementById('input-message')
const sentBtn = document.getElementById('btn-sent')
const messageDashboard = document.getElementById('message-dashboard')
const socket = io()

socket.emit('join', roomId)
const roomTitle = document.getElementById('room-title')
roomTitle.textContent = `${roomId}`

const virtualKeyboardSupported = "virtualKeyboard" in navigator;
document.documentElement.style.setProperty(
    "--100vh",
    `${window.visualViewport.innerHeight}px`
  );

  if(virtualKeyboardSupported) {
    navigator.virtualKeyboard.overlaysContent = true;
  }
  message.addEventListener('focus', () => {
    if (virtualKeyboardSupported){
        navigator.virtualKeyboard.show();
      }
  })
  
window.visualViewport.addEventListener('resize', () => {
    document.documentElement.style.setProperty(
        "--100vh",
        `${window.visualViewport.innerHeight}px`
      );
})
const createDiv = (divName, msg, userId) => {
    let mainDiv = document.createElement("div")
    mainDiv.className = divName
    let innerDiv = document.createElement("div")
    innerDiv.className = "msg-content"
    let h1 = document.createElement("h1")
    if(divName === "outgoing-message") h1.className = "incom"
    h1.setAttribute("id" , "small-user-id")
    h1.innerText = `${userId}`
    let paragraph = document.createElement("p");
    paragraph.setAttribute("id", "message");
    paragraph.innerText = `${msg}`;
    innerDiv.append(h1);
    innerDiv.append(paragraph);
    mainDiv.append(innerDiv);
    return mainDiv
}

message.addEventListener("keyup", (event) => {
    if(event.key == "Enter") {
        sentBtn.click();
    }
})

sentBtn.addEventListener('click', () => {
    const msg = message.value
    if(msg === "")
    console.log(msg)
    messageDashboard.appendChild(createDiv("outgoing-message", msg, userName))
    messageDashboard.scrollTop = messageDashboard.scrollHeight;
    socket.emit('sendMessage', {userName, roomId, msg})
    message.value = ""
    message.focus()
})






socket.on('message', (data) => {
    messageDashboard.appendChild(createDiv("incoming-message", data.msg, data.userName))
    messageDashboard.scrollTop = messageDashboard.scrollHeight;
})



const logoutBtn = document.getElementById('logout')

logoutBtn.addEventListener('click')