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
            this.jumpForce = 0.3
            this.player.mesh.rotation.y = 0
            this.worldPos = new this.THREE.Vector3()
            this.ground = this.instance.entities.ground
    }
    calcSegAtPoint(point, w, wS, h=undefined, hS=undefined){
        h = h ? h : w
        hS = hS ? hS : wS
        point.x = Math.round(point.x)
        point.y = Math.round(point.y)
        point.z = Math.round(point.z)
        let findClosest = (arr,num) => {
            let closest = arr[0];
            for(let item of arr){
              if(Math.abs(item - num)<Math.abs(closest - num)){
                closest = item;
              }
            }
            return closest;
        }
        let genArr = (inc, max) => {
            let arr = []
            let t = -max/2
            while(t < max){
                t = t+inc
                arr.push(t)
            }
            return arr
        }
        
        let incW = w/wS
        let clW = findClosest(genArr(incW, w), point.x)
        let incH = h/hS
        let clH = findClosest(genArr(incH, w), point.z)
        return new this.THREE.Vector3(clW, clH, 0)
    }
    findIndinVec3(list= [], vec3 = new THREE.Vector3()){
        for(let ell of list){
            if(ell.x == vec3.x){
                if(ell.y == vec3.y){
                    return ell
                }
                
            }
        }
    }
    setIsG(posOnTerr){
        if(posOnTerr.z == this.worldPos.y){
            this.player.isGrounded = true
            return true
        }
        this.player.isGrounded = false
        return false
    }
    Update(timeElapsed, input){
        try{
            let mesh = this.player.mesh
            this.stateMachine.Update(timeElapsed, input)
            if(input.keys.forward || input.keys.backward || input.keys.left || input.keys.right || input.keys.rotLeft || input.keys.rotRight){
                let direction = input.keys.left ? this.turnSpeed: (input.keys.right? -this.turnSpeed: 0)
                mesh.rotation.y += direction*Math.PI/180

                let movementZ = input.keys.forward ? this.velocity : (input.keys.backward? -this.velocity : 0)
                //let movementX = input.keys.left ? this.velocity : (input.keys.right? -this.velocity: 0)
                
                // let moveIn = new this.THREE.Vector3(movementX, 0, movementZ)
                let moveIn = new this.THREE.Vector3(0, 0, movementZ)
                //this.worldPos.add(moveIn)
                moveIn.applyQuaternion(mesh.quaternion)
                mesh.position.add(moveIn)
                mesh.getWorldPosition(this.worldPos)
                let isG = this.setIsG(this.findIndinVec3( this.ground.verts, this.calcSegAtPoint(this.worldPos, this.ground.w, this.ground.wS)))
                this.instance.utils.log(isG)
                
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
        else if(input.keys.backward && !(input.keys.forward)){
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