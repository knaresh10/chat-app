const { userName, roomId} = Qs.parse(location.search, {ignoreQueryPrefix : true})

const message = document.getElementById('input-message')
const sentBtn = document.getElementById('btn-sent')
const messageDashboard = document.getElementById('message-dashboard')
const socket = io()

socket.emit('join', roomId)
const roomTitle = document.getElementById('room-title')
roomTitle.textContent = `${roomId}`

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
    console.log(msg)
    messageDashboard.appendChild(createDiv("outgoing-message", msg, userName))
    messageDashboard.scrollTop = messageDashboard.scrollHeight;
    socket.emit('sendMessage', {userName, roomId, msg})
    message.value = ""
})






socket.on('message', (data) => {
    messageDashboard.appendChild(createDiv("incoming-message", data.msg, data.userName))
    messageDashboard.scrollTop = messageDashboard.scrollHeight;
})



const logoutBtn = document.getElementById('logout')

logoutBtn.addEventListener('click')