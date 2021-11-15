class CharacterController{
    constructor(ind, instance, three, camera){
        // try{
            this.instance = instance
            this.cam = camera

            this.turnSpeed = 4
            this.player = instance.entities.players[ind]
            this.stateMachine = new CharacterFSM(this.player)
            this.debug = instance.debug
            this.THREE = three
            this.velocity = 0.5
            this.player.mesh.rotation.y = 0
            this.worldPos = this.player.mesh.position
            this.ground = this.instance.entities.ground
    }
    Update(timeElapsed, input){
        try{
            let mesh = this.player.mesh
            this.stateMachine.Update(timeElapsed, input)
            if(input.keys.forward || input.keys.backward || input.keys.left || input.keys.right || input.keys.rotLeft || input.keys.rotRight){
                let direction = input.keys.left ? this.turnSpeed: (input.keys.right? -this.turnSpeed: 0)
                mesh.rotation.y += direction*Math.PI/180

                let movementZ = input.keys.forward ? this.velocity : (input.keys.backward? -this.velocity : 0)
                let movementX = input.keys.left ? this.velocity : (input.keys.right? -this.velocity: 0)
                
                let moveIn = new this.THREE.Vector3(movementX, 0, movementZ)
                //this.worldPos.add(moveIn)
                moveIn.applyQuaternion(mesh.quaternion)
                mesh.position.add(moveIn)

                //this.instance.utils.log(mesh.position)
                let verts = this.ground.verts
                let terrVer = new this.THREE.Vector3(Math.floor(this.worldPos.x), Math.floor(this.worldPos.x), this.worldPos.y)
                terrVer.applyQuaternion(new this.THREE.Quaternion(1,0,0,0))
                // this.instance.utils.log(verts)
                this.instance.utils.log(terrVer)
                this.instance.utils.log(verts.indexOf(terrVer))
            }
            this.cam.Update(input.keys.backward)
        }
        catch(err){
            if(this.debug){
                console.log(err)
            }
        }
    }
}

class FiniteStateMachine {
    constructor(){
        this.states = {}
        this.currState = null
    }
    AddState(name, type){
        this.states[name] = type
    }
    SetState(name){  
        const prevState = this.currState
        if (prevState) {
            if (prevState.Name == name) {
              return
            }
            prevState.Exit()
          }
        const state = new this.states[name](this)
        this.currState = state
        state.Enter(prevState)
    }

    Update(timeElapsed, input) {
        if (this.currState) {
          this.currState.Update(timeElapsed, input)
        }
    }
}
class CharacterFSM extends FiniteStateMachine{
    constructor(proxy) {
        super()
        this.states = {}
        this.proxy = proxy.animClips
        this.Init()
        let idleState = new this.states['idle'](this)
        this.currState = idleState
        idleState.Enter()
    }
    Init(){
        this.AddState('idle', IdleState)
        this.AddState('froWalk', FroWalkState)
        this.AddState('backWalk', BackWalkState)
        //this.AddState('leftStrafe', LeftStrafeState)
    }
}



class State {
    constructor(parent) {
    }
  
    Enter() {}
    Exit() {}
    Update() {}
}
class IdleState extends State {
    constructor(parent = new CharacterFSM()){
        super()
        this._parent = parent
    }
    get name() {
        return 'idle'
    }
    Enter(prevState){
        const idleAction = this._parent.proxy.idle
        if(prevState){
            let prevAction = this._parent.proxy[prevState.name]
            idleAction.time = 0.0
            idleAction.enabled = true
            idleAction.setEffectiveTimeScale(1.0)
            idleAction.setEffectiveWeight(1.0)
            idleAction.crossFadeFrom(prevAction, 0.5, true)
            idleAction.play()
        }
        else{
            idleAction.play()
        }
        return true
    }
    Update(_, input) {
        if (input.keys.forward) {
            this._parent.SetState('froWalk')
        }
        else if(input.keys.backward){
            this._parent.SetState('backWalk')
        }
        // else if(input.keys.left){
        //     this._parent.SetState('leftStrafe')
        // }
    }
}
class FroWalkState extends State {
    constructor(parent = new CharacterFSM()){
        super()
        this._parent = parent
    }
    get name(){
        return 'froWalk'
    }
    Enter(prevState){
        const walkingAction = this._parent.proxy.froWalk
        if(prevState){
            const prevAction = this._parent.proxy[prevState.name]
            walkingAction.enabled = true
            walkingAction.time = 0.0
            walkingAction.setEffectiveTimeScale(1.0)
            walkingAction.setEffectiveWeight(1.0)
        
            walkingAction.crossFadeFrom(prevAction, 0.5, true)
            walkingAction.play()
        } else {
            walkingAction.play()
        }

        // set Velocity of Char COntroller
    }
    Update(_, input){
        if(!(input.keys.forward)) {
            this._parent.SetState('idle')
        }
        else if(input.keys.backward && !(input._keys.forward)){
            this._parent.SetState('backWalk')
        }
    }
}
class BackWalkState extends State {
    constructor(parent = new CharacterFSM()){
        super()
        this._parent = parent
    }
    get name(){
        return 'backWalk'
    }
    Enter(prevState){
        const walkingAction = this._parent.proxy.backWalk
        if(prevState){
            const prevAction = this._parent.proxy[prevState.name]
            walkingAction.enabled = true
            walkingAction.time = 0.0
            walkingAction.setEffectiveTimeScale(1.0)
            walkingAction.setEffectiveWeight(1.0)
        
            walkingAction.crossFadeFrom(prevAction, 0.5, true)
            walkingAction.play()
        } else {
            walkingAction.play()
        }

        // set Velocity of Char COntroller
    }
    Update(_, input){
        if(!(input.keys.backward)) {
            this._parent.SetState('idle')
        }
        else if(input.keys.forward && !(input.keys.backward)){
            this._parent.SetState('froWalk')
        }
    }
}

class LeftStrafeState extends State {
    constructor(parent = new CharacterFSM()){
        super()
        this._parent = parent
    }
    get name(){
        return 'leftStrafe'
    }
    Enter(prevState){
        const strafeAction = this._parent.proxy.leftStrafe
        if(prevState){
            const prevAction = this._parent.proxy[prevState.name]
            strafeAction.enabled = true
            strafeAction.time = 0.0
            strafeAction.setEffectiveTimeScale(1.0)
            strafeAction.setEffectiveWeight(1.0)
        
            strafeAction.crossFadeFrom(prevAction, 0.5, true)
            strafeAction.play()
        } else {
            strafeAction.play()
        }

        // set Velocity of Char COntroller
    }
    Update(_, input){
        if(!(input.keys.forward) && !(input.keys.backward) && !(input.keys.left)) {
            this._parent.SetState('idle')
        }
        else if(input.keys.backward && !(input.keys.forward)){
            this._parent.SetState('backWalk')
        }
        else if(input.keys.forward && !(input.keys.backward)){
            this._parent.SetState('froWalk')
        }
    }
}

export {CharacterController}