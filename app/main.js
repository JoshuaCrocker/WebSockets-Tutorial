var socket = io.connect('http://localhost:3000',  { forceNew: true });

socket.on('messages', function(data) {
  console.info(data);

  var html = data.map(function(data) {
    return (`
        <div class="name">
          ${data.userName}
        </div>
        <a href=${data.content.link} class="message" target="blank">${data.content.text}</a>
      `);
  }).join(' ');

  document.getElementById('messages').innerHTML = html;
});
