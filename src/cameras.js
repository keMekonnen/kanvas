class ThirdPersonCamera{
    constructor(camera, THREE, mesh) {
        this.camera = camera
        this.THREE = THREE
        this.currPos = new THREE.Vector3()
        this.currLookAt = new THREE.Vector3()
        this.target = mesh
    }
    calc(ind){
        
        let vecs = {
            "offset": new this.THREE.Vector3(-15, 20, -30),
            "lookAt": new this.THREE.Vector3(0, 10, 30),
            "offsetB": new this.THREE.Vector3(15, 20, 30),
            "lookAtB": new this.THREE.Vector3(0, 10, -30)
        }
        let ideal = vecs[ind]
        ideal.applyQuaternion(this.target.quaternion)
        ideal.add(this.target.position)
        return ideal
    }
    Update(backward){
        let idealOffset
        let idealLookAt
        if(backward){
            idealOffset = this.calc('offsetB')
            idealLookAt = this.calc('lookAtB')
        }
        else{
            idealOffset = this.calc('offset')
            idealLookAt = this.calc('lookAt')
        }

        const t = 0.03

        this.currPos.lerp(idealOffset, t)
        this.currLookAt.lerp(idealLookAt,t)
        this.camera.position.copy(this.currPos)
        this.camera.lookAt(this.currLookAt)
    }
}
export {ThirdPersonCamera}