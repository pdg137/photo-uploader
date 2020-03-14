sender = (function() {
  var peer;

  var init = function() {
    $('#status').text('Connecting to peer server...');

    peer = new Peer({ host: '0.peerjs.com', debug: 2 });

    peer.on('open', function (id) {
      $('#status').text('Connected to peer server.');
      connectToPeer();
    });

    peer.on('error', function (err) {
      $('#status').text("** "+err);
    });

    peer.on('disconnected', function () {
      $('#status').text('Disconnected.');
    });
  }

  var connectToPeer = function () {
    $('#status').text('Connecting to peer...');
    var dataConnection = peer.connect(receiver_id, { reliable: true });

    dataConnection.on('open', function (id) {
      remote_ip = dataConnection.peerConnection.remoteDescription.sdp.match(/a=candidate:(.*)/)[1].split(' ')[4]
      $('#status').text('Connected to ' + remote_ip + '.');
    });

    dataConnection.on('error', function (err) {
      $('#status').text("** "+err);
    });

    $('#file').change(function(e) {
      $('#status').text("Sending...");
      dataConnection.send({
        name: this.files[0].name,
        type: this.files[0].type,
        data: this.files[0]
      });
      $('#status').text("Sent.");
    });
  };

  return {
    init: init
  };
})();

var receiver_id = location.search.slice(1,9);
var shared_secret = location.search.slice(10,18);

$(sender.init);
