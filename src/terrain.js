class Terrain{
    constructor(three, data = {}) {
        this.THREE = three
        this.geom = new this.THREE.PlaneGeometry(2400, 2400, data.segs, data.segs)
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