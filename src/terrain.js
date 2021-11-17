class Terrain{
    constructor(three, data = {}) {
        this.THREE = three
        this.segs = data.segs
        this.h = data.h ? data.h : data.w
        this.hS = data.hS ? data.hS : data.wS
        this.geom = new this.THREE.PlaneGeometry(data.w, this.h, data.wS, this.hS)
        this.w = data.w
        this.wS = data.wS
        let mat = new this.THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
            wireframe: true
        })
        this.plane = new this.THREE.Mesh(this.geom, mat)
        this.plane.castShadow = false
        this.plane.receiveShadow = true
        this.plane.rotation.x = -Math.PI / 2
    }
}

export {Terrain}