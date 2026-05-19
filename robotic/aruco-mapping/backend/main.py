from multiprocessing import Process, Queue, Pipe
from mqttclient import connect_mqtt
from player import start_player, PlayerCommand
from time import sleep

def subscribe(client: mqtt_client.Client, play_process: Process, command_queue: Queue):
    def on_message(client, userdata, msg):
        topic = msg.topic
        payload = msg.payload.decode()
        if topic == "playback/start":
          command_queue.put(PlayerCommand.START)
        elif topic == "playback/pause":
          command_queue.put(PlayerCommand.PAUSE)
        elif topic == "playback/unpause":
          command_queue.put(PlayerCommand.UNPAUSE)
        elif topic == "playback/live":
          command_queue.put(PlayerCommand.LIVE)
        print(f"{topic}: {payload}")

    client.subscribe("playback/#")
    client.on_message = on_message

if __name__ == "__main__":
    client = connect_mqtt("backend main")

    # create player subprocess  
    command_queue = Queue()
    play_process = Process(target=start_player, args=(command_queue,))
    subscribe(client, play_process, command_queue)

    # start
    play_process.start()
    play_process.join()