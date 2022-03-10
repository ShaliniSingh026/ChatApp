
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
//getting usernane & room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// console.log(username, room);

const socket = io();

//For joining chat room
socket.emit('joinRoom', { username, room });

//For geeting users & room
socket.on('roomUsers', ({ room, users }) => {
 outputRoomName(room);
 outputUsers(users);
});

//Message from server
socket.on('message', message => {
     console.log(message.username);
    outputMessage(message);

    /*//To msg scroll down
   chatMessages.scrollTop = chatMessages.scrollHeight;
});*/



/*//location
document.querySelector('#mylocation').addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, function () {
            alert('Unable to fetch location!!')
        })
    })
})*/


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

var locationButton = jQuery('#mylocation');
locationButton.on('click', function () {
    if(!navigator.geolocation) {
        return alert('Gelocation not supported by your browser!');
    }
    navigator.geolocation.getCurrentPosition(function (position) {
         console.log(position);
    }, function() {
        alert('unable to fetch location!');
    });
});

/*// To broadcast the location
socket.io('mylocation', message => {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = ``
});*/

//Output msg to DOM
function outputMessage(message) {
    console.log(message)
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}
//Adding room name to DOM
function outputRoomName(room) {
   roomName.innerText = room;
}
//Adding users to DOM
function outputUsers(user) {
    userList.innerHTML = 
    `${user.map(user => `<li>${user.username}</li>`).join('')}
    `;
}
});