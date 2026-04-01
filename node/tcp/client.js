const Net = require('net');

const port = 6969;
const host = '127.0.0.1'; //if you are on localhost then, 127.0.0.1

//make a socket instance which will be our client
const client = new Net.Socket();

//connect to the server
client.connect({ host, port }, function () {
    console.log('TCP connection established with the server.');

    //send data to server
    client.write('hello server from client.');
});

//define what to be done when server sends some data
client.on('data', function (chunk) {
    console.log(`Data received from the server: ${chunk.toString()}.`);
    //can close the connection using below command
    // client.end();
});

//define what to do when client disconnects
client.on('end', function () {
    console.log('Requested an end to the TCP connection');
});