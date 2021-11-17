class Physics {
    constructor(three, mega){
        this.THREE = three
        this.parent = mega
    }
    Update(time, delta){
        let ents = this.parent.entities
        for(let player in ents.players){
            if(!ents.players[player].isGrounded){
                this.parent.utils.log("wassusp")
            }
        }
    }
}
export {Physics}