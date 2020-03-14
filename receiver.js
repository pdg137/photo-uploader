receiver = (function () {
  var peer;
  var receiver_id = (Math.random()*0xFFFFFFFF<<0).toString(16);
  var shared_secret = (Math.random()*0xFFFFFFFF<<0).toString(16);

  var init = function () {
    var sender_url = window.location.origin+'/sender.html?'+receiver_id+':'+shared_secret
    $('#sender_link').attr('href',sender_url).text(sender_url)

    var qrcode = new QRCode(document.getElementById('qr_code'), {
      text: sender_url,
      width: 128,
      height: 128,
      correctLevel : QRCode.CorrectLevel.L
    });

    $('#status').text('Connecting to peer server...');

    peer = new Peer(receiver_id, {
      host: '0.peerjs.com',
      debug: 2
    });

    peer.on('open', function (id) {
      $('#status').text('Connected to peer server.');
    });

    peer.on('error', function (err) {
      $('#status').text("** "+err);
    });

    peer.on('connection', acceptConnection);

    peer.on('disconnected', function () {
      $('#status').text('Disconnected.');
    });

    window.onbeforeunload = function(e){
      e.preventDefault();
      e.returnValue = ''; // browsers do not show this string
    };
  };

  var acceptConnection = dataConnection => {
    dataConnection.on('open', function(id) {
      remote_ip = dataConnection.peerConnection.remoteDescription.sdp.match(/a=candidate:(.*)/)[1].split(' ')[4]
      $('#status').text('Connected to ' + remote_ip + '.');
    });

    dataConnection.on('data', receiveData);

    dataConnection.on('error', function (err) {
      $('#status').text("** "+err);
    });
  };

  var receiveData = function (file) {
    $('#status').text('Receiving...');

    if (file.type != 'image/jpeg') return;
    var data_url = 'data:image/jpeg;base64,' + dataToBase64(file.data);

    var img = $('<img>');
    img.attr('src', data_url);
    img.click(function (e) {
      if(e.shiftKey)
      {
        if(img.hasClass('rotate90'))
        {
          img.removeClass('rotate90');
          img.addClass('rotate180');
        }
        else if(img.hasClass('rotate180'))
        {
          img.removeClass('rotate180');
          img.addClass('rotate270');
        }
        else if(img.hasClass('rotate270'))
        {
          img.removeClass('rotate270');
        }
        else
          img.addClass('rotate90');
        return;
      }
      img.toggleClass('expanded');
    });

    $('#pictures').prepend(img);

    $('#status').text('Received.');
  };

  var dataToBase64 = function (data) {
    var bytes = new Uint8Array(data);
    var binary = '';
    $.each(bytes, function (i, b) {
      binary += String.fromCharCode(b);
    });
    return window.btoa(binary);
  };

  return {
    init: init
  };
})();

$(receiver.init)
