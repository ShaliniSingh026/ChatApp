
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
//getting usernane & room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

//For joining chat room
socket.emit('joinRoom', { username, room });

//For geeting users & room
socket.on('roomUsers', ({ room, users }) => {
 outputRoomName(room);
 outputUsers(users);
});

//Adding room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
 }


 //adding user name to DOM
 function outputUsers(user) {
    userList.innerHTML = 
    `${user.map(user => `<li>${user.username}</li>`).join('')}
    `;
}

//Message from server
socket.on('message', message => {
    //  console.log(message.username);
    outputMessage(message);
});

socket.on('locationmessage', message => {
    // console.log(message.username);
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <a class="text" href="${message.url}" target="_blank">
      ${message.url}
    </a>`;
    document.querySelector('.chat-messages').appendChild(div);
});

    /*//To msg scroll down
   chatMessages.scrollTop = chatMessages.scrollHeight;
});*/

//For Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //For getting msg text
    const msg = e.target.elements.msg.value;

    //emitting message to server
    socket.emit('chatMessage',msg);

    //For clearing msgs
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus()
});



//Output msg to DOM
function outputMessage(message) {
    // console.log(message)
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
};



//location sharing
document.querySelector('#mylocation').addEventListener('click', function (e) {
    e.preventDefault();
    if (!navigator.geolocation) {
        return alert('Gelocation not supported by your browser!');
    }
    navigator.geolocation.getCurrentPosition(function (position) {
        socket.emit('location', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
        // console.log(position);
    }, function () {
        alert('Unable to fetch location!');
    })
});

/*var locationButton = jQuery('#mylocation');
locationButton.on('click', function () {
    if(!navigator.geolocation) {
        return alert('Gelocation not supported by your browser!');
    }
    navigator.geolocation.getCurrentPosition(function (position) {
         console.log(position);
    }, function() {
        alert('unable to fetch location!');
    });
});*/