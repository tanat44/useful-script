#!/bin/bash

## Custom setup to import flow

echo "Custom: Installing custom nodered packages"
cd /data
npm install @mnn-o/node-red-rabbitmq@1.0.2
npm install node-red-debugger@1.1.1

if [ "$OVERWRITE_FLOW" = true ]; then
	echo "Custom: Overwrite flow"
	cp /data/import/flows.json /data
fi

## Standard nodered

trap stop SIGINT SIGTERM

function stop() {
	kill $CHILD_PID
	wait $CHILD_PID
}

/usr/local/bin/node $NODE_OPTIONS ~/node_modules/node-red/red.js --userDir /data $FLOWS "${@}" &

CHILD_PID="$!"

wait "${CHILD_PID}"

