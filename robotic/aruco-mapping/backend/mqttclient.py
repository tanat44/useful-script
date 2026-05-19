from paho.mqtt import client as mqtt_client

broker = '127.0.0.1'
port = 1883
username = "hello"
password = "test"

def connect_mqtt(client_id: str)-> mqtt_client:
    def on_connect(client, userdata, flags, reason_code, properties):
        if reason_code != 0:
            print(f"Failed to connect, return code {reason_code}")
        else:
            print(f'mqtt {client_id} started')

    def on_disconnect(client, userdata, disconnect_flags, reason_code, properties):
        logging.info("Disconnected with reason code: %s", reason_code)

    client = mqtt_client.Client(
        client_id=client_id,
        callback_api_version=mqtt_client.CallbackAPIVersion.VERSION2,
    )
    client.username_pw_set(username, password)
    client.on_connect = on_connect
    client.connect(broker, port)

    client.reconnect_delay_set(min_delay=1, max_delay=60)
    client.on_disconnect = on_disconnect
    client.loop_start()

    return client
