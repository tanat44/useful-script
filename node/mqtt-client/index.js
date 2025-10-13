const mqtt = require('mqtt')

const protocol = 'mqtt'
const host = 'localhost'
const port = '1883'
const clientId = `node-client-${Math.floor(Math.random()*100)}`
const connectUrl = `${protocol}://${host}:${port}`
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'hello',
  password: 'test',
  reconnectPeriod: 1000,
})

console.log('Connecting...')

client.on('connect', () => {
  console.log('Connected', new Date().toISOString())
})