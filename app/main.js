var socket = io.connect('http://localhost:3000',  { forceNew: true });

socket.on('messages', function(data) {
  console.info(data);

  var html = data.map(function(data) {
    return (`
        <div class="name">
          ${data.userName}
        </div>
        <a href=${data.content.link} class="message" target="blank">${data.content.text}</a>
        <input type="submit" class="likes-count" value="${data.likedBy.length} Enjoys">
      `);
  }).join(' ');

  document.getElementById('messages').innerHTML = html;
});

function addMessage(e) {
  var username = document.getElementById('username'),
      linkAddress = document.getElementById('linkAddress'),
      message = document.getElementById('message')

  var payload = {
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
