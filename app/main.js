var userId = localStorage.getItem('userId') ||  randomId();
localStorage.setItem('userId', userId);
console.info("Hi i'm user #"+userId);
var messageCache;

function randomId() {
  return Math.floor(Math.random() * 1e11);
}

var socket = io.connect('http://localhost:3000',  { forceNew: true });

socket.on('messages', function(data) {
  console.info(data);
  messageCache = data;
  render();
});

function render() {
  var data = messageCache;

  var html = data.map(function(data, index) {
    return (`
        <form class="message" onsubmit="return likeMessage(messageCache[${index}])">
          <div class="name">
            ${data.userName}
          </div>
          <a href=${data.content.link} class="message" target="blank">${data.content.text}</a>
          <input type="submit" class="likes-count" value="${data.likedBy.length} Enjoys">
        </form>
      `);
  }).join(' ');

  document.getElementById('messages').innerHTML = html;
}

function addMessage(e) {
  var username = document.getElementById('username'),
      linkAddress = document.getElementById('linkAddress'),
      message = document.getElementById('message')

  var payload = {
    messageId:randomId(),
    userName: username.value,
    content: {
      link: linkAddress.value,
      text: message.value
    },
    ts: Date.now(),
    likedBy:[]
  };

  socket.emit('new-message', payload);

  linkAddress.value = '';
  message.value = '';

  return false;
}

function likeMessage(message) {
  var index = message.likedBy.indexOf(userId);

  if (index < 0) {
    message.likedBy.push(userId);
  } else {
    message.likedBy.splice(index,1);
  }

  socket.emit('update-message', message);
  render();
  return false;
}
