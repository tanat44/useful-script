## how to run using compose
1. `docker compose up -d --build`
1.  exec into running container
1. `/ros2_entrypoint.sh bash`
1. run ros2 command

## talker-listener
ros2 run demo_nodes_cpp talker
ros2 run demo_nodes_cpp listener

## how to run on terminal
1. build the container
1. `docker run -it ros2-ros:latest`

## use zenoh
when no network multicast available. [ref](https://github.com/ros2/rmw_zenoh)

on zenoh host node
```sh
ros2 run rmw_zenoh_cpp rmw_zenohd
```

on zenoh client node
```sh
export ROS_DOMAIN_ID=44
export RMW_IMPLEMENTATION=rmw_zenoh_cpp
export ZENOH_CONFIG_OVERRIDE='mode="client";connect/endpoints=["tcp/192.168.178.52:7447"]'
# do what you want
```

## cyclone dds
https://medium.com/@arshad.mehmood/setting-up-node-discovery-across-multiple-systems-in-ros2-infrastructure-a1a5c25f052f

update 2026.05.18 -- not working on docker macos to connect to another linux node