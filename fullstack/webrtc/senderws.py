import asyncio
import cv2
from aiortc import RTCPeerConnection, RTCSessionDescription, VideoStreamTrack, RTCIceCandidate, RTCConfiguration, RTCIceServer
from aioice import Candidate
from aiortc.contrib.signaling import TcpSocketSignaling
from av import VideoFrame
import fractions
from websockets.asyncio.client import connect, ClientConnection
from datetime import datetime
import json
import dataclasses

UUID = "01f13727-a543-4984-a427-fba53c5652be"


class CustomVideoStreamTrack(VideoStreamTrack):
    def __init__(self, camera_id):
        super().__init__()
        self.cap = cv2.VideoCapture(camera_id)
        self.frame_count = 0

    async def recv(self):
        self.frame_count += 1
        print(f"Sending frame {self.frame_count}")
        ret, frame = self.cap.read()
        if not ret:
            print("Failed to read frame from camera")
            return None
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        video_frame = VideoFrame.from_ndarray(frame, format="rgb24")
        video_frame.pts = self.frame_count
        video_frame.time_base = fractions.Fraction(
            1, 30)  # Use fractions for time_base
        # Add timestamp to the frame
        timestamp = datetime.now().strftime(
            "%Y-%m-%d %H:%M:%S.%f")[:-3]  # Current time with milliseconds
        cv2.putText(frame, timestamp, (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)

        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        video_frame = VideoFrame.from_ndarray(frame, format="rgb24")
        video_frame.pts = self.frame_count
        video_frame.time_base = fractions.Fraction(
            1, 30)  # Use fractions for time_base
        return video_frame


async def created_description(pc: RTCPeerConnection, ws: ClientConnection, description: RTCSessionDescription):
    await pc.setLocalDescription(description)
    sdp_raw = dataclasses.asdict(description)
    await ws.send(json.dumps({"sdp": sdp_raw, "uuid": UUID}))


async def setup_webrtc_and_run(ip_address, port, camera_id):
    config = RTCConfiguration(iceServers=[RTCIceServer(
        urls="stun:stun.stunprotocol.org:3478"), RTCIceServer(urls="stun:stun.l.google.com:19302")])
    pc = RTCPeerConnection(configuration=config)
    video_sender = CustomVideoStreamTrack(camera_id)
    pc.addTrack(video_sender)

    try:
        ws = await connect("ws://127.0.0.1:8443")

        @pc.on("datachannel")
        def on_datachannel(channel):
            print(f"Data channel established: {channel.label}")

        @pc.on("connectionstatechange")
        async def on_connectionstatechange():
            print(f"Connection state is {pc.connectionState}")
            if pc.connectionState == "connected":
                print("WebRTC connection established successfully")

        offer = await pc.createOffer()
        await created_description(pc, ws, offer)

        while True:
            obj = await ws.recv()
            signal = json.loads(obj)
            if signal["uuid"] == UUID:
                continue

            if "sdp" in signal:
                print("---got sdp---")

                sd = RTCSessionDescription(**signal["sdp"])
                await pc.setRemoteDescription(sd)

                if sd.type != "offer":
                    continue

                print("---answer---")
                answer = await pc.createAnswer()
                await created_description(pc, ws, answer)
                print("Remote description set")

            elif "ice" in signal:
                print("---got ice---")
                raw_ice = signal["ice"]
                x = Candidate.from_sdp(raw_ice["candidate"])
                ice = RTCIceCandidate(
                    component=x.component,
                    foundation=x.foundation,
                    ip=x.host,
                    port=x.port,
                    priority=x.priority,
                    protocol=x.transport,
                    relatedAddress=x.related_address,
                    relatedPort=x.related_port,
                    tcpType=x.tcptype,
                    type=x.type,
                    sdpMid=raw_ice["sdpMid"],
                    sdpMLineIndex=raw_ice["sdpMLineIndex"]
                )
                await pc.addIceCandidate(ice)
            elif obj is None:
                print("Signaling ended")
                break
        print("Closing connection")
    finally:
        await pc.close()


async def main():
    ip_address = "127.0.0.1"  # Ip Address of Remote Server/Machine
    port = 9999
    camera_id = 1
    await setup_webrtc_and_run(ip_address, port, camera_id)

if __name__ == "__main__":
    asyncio.run(main())
