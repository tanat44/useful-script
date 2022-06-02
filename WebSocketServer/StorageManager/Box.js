class Box{
    constructor(id, name){
        this.id = id
        this.name = name
        this.x = 0.0
        this.y = 0.0
        this.z = 0.0
    }

    toJson(){
        let {id, name, x, y, z} = this;
        return {postID, title, text};
    }
}

module.exports = Box