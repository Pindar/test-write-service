var influx = require('influx'),
    kafka = require('kafka-node'),
    Consumer = kafka.Consumer,
    kafkaEndpoint = process.env.KAFKA_ENDPOINT || 'kafka:2181',
    client = new kafka.Client(kafkaEndpoint),
    consumer = new Consumer(
        client,
        [
            { topic: 'temperature', partition: 0 }
        ],
        {
            autoCommit: false
        }
    );

var client = influx({
  host : process.env.INFLUX_DB_HOST || 'influxdb',
  port : process.env.INFLUX_DB_PORT || 8086, // optional, default 8086
  protocol : 'http', // optional, default 'http'
  username : process.env.INFLUX_DB_USERNAME || 'admin',
  password : process.env.INFLUX_DB_PASSWORT || 'admin',
  database : process.env.INFLUX_DB_NAME || 'db1'
});

function done() {
  console.log('point written');
}

consumer.on('message', function (message) {
  console.log('received message', message);

  var point = {time: new Date(), value: Number(message.value)};

  client.writePoint('temperature', point, null,  done);

  console.log(message, point);
});
