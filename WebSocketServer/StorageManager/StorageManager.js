class StorageManager{
    constructor(){
        this.boxes = {}
        this.subscribers={}
        this.intervalUpdate = null
    }

    addBox(box) {
        if (this.boxes[box.id])
            return
        this.boxes[box.id] = box
    }

    getBox(id){
        return this.boxes[id]
    }

    addSubscriber(ws){
        this.subscribers[ws.uid] = ws
    }

    removeSubscriber(ws){
        this.subscribers.remove
    }

    startEmulation(){
        console.log("Storage Manager: starting emulation")
        this.intervalUpdate = setInterval(this.emulate.bind(this), 1000)
    }

    emulate(sm){
        for (const [key, box] of Object.entries(this.boxes)) {
            box.x = getRandomInt(10)
        }

        // emit to all subscribers
        for (const [key, ws] of Object.entries(this.subscribers)) {
            ws.send(JSON.stringify(Object.values(this.boxes)))
        }
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

module.exports = StorageManager 