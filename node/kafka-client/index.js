import { Kafka } from 'kafkajs'

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['kafka-broker-service:9093'],
  ssl: false,
  sasl: {
    mechanism: 'plain', // scram-sha-256 or scram-sha-512
    username: 'admin',
    password: 'admin-secret'
  },
})

const producer = kafka.producer()

await producer.connect()
console.log('Connected')
await producer.send({
  topic: 'test-topic',
  messages: [
    {
      value: `Hello KafkaJS user at ${new Date().toLocaleTimeString()}`,
    },
  ],
})

await producer.disconnect()
console.log('Disconnected')