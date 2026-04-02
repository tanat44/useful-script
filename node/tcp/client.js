const Net = require('net');
const fs = require('node:fs');

const port = 5432;
const host = '10.10.9.52'; //if you are on localhost then, 127.0.0.1

//make a socket instance which will be our client
const client = new Net.Socket();
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

//connect to the server
client.connect({ host, port }, async function () {
    console.log('TCP connection established with the server.');

    //send data to server
    // const msg1 = `<CPI2><Tran><Get><Item Path="Status"/></Get></Tran></CPI2>\n`
    // client.write(msg1);

    // await sleep(1000)

    // const msg2 = `<CPI2><Tran><Get><Item Path="ComponentList"/></Get></Tran></CPI2>\n`
    // client.write(msg2)

    await sleep(1000)

    const ZERO_D = String.fromCharCode(0x0d)
    const msg3 = `protocol 1${ZERO_D}`
    client.write(msg3)
    await sleep(200)
    const msg4 = `protocol 2${ZERO_D}protocol 3${ZERO_D}protocol 4${ZERO_D}protocol 5${ZERO_D}protocol 6${ZERO_D}protocol 7${ZERO_D}protocol 8${ZERO_D}protocol 9${ZERO_D}protocol 10${ZERO_D}subscribe state enc laser sick spot gyro usedrefl usedwall wire distmark set wlanstat wlanscan ping barcode segment ndt${ZERO_D}`
    client.write(msg4)
});


//define what to be done when server sends some data
client.on('data', function (chunk) {
    const text = chunk.toString().trim()
    const lines = text.split('\n')
    for (const line of lines) {
        if (line.startsWith('enc'))
            console.log(line)
    }
    // console.log('received: ', text)

    fs.appendFile('out.txt', text, (err) => { if (err) console.error('write error', err) })
});

//define what to do when client disconnects
client.on('end', function () {
    console.log('Requested an end to the TCP connection');
});