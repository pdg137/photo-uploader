This code follows the example in
https://blog.bitsrc.io/use-webrtc-and-peerjs-to-build-an-image-sharing-app-f8163b6a6266.
We do it a little differently, using a random ID and a QR code to
allow a smartphone/tablet browser to connect to the page.

The qrcode.min.js library is from https://davidshimjs.github.io/qrcodejs/.

You can launch a basic webserver in this folder with

```
ruby -run -e httpd . -p8000
```

You will need to configure the hostnames in sender.js and receiver.js.

To install your own peer server, first set up an npm project using
`npm init`, install peer.js with `npm install peer`, and start the
server running with:

```
node_modules/.bin/peerjs --port 9000 --debug
```

Then browse to port 8000 on this computer to launch the app.

Note that portrait pictures will display sideways in Chrome; Firefox works better.
