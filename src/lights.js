class Lights {
    constructor(THREE, parent){
        this.THREE = THREE
        this.parent = parent
    }
    directionalLightSetup() {
        let light = new this.THREE.DirectionalLight(0xFFFFFF, 1.0)
        light.position.set(20, 100, 10)
        light.target.position.set(0, 0, 0)
        light.castShadow = true
        light.shadow.bias = -0.001
        light.shadow.mapSize.width = 2048
        light.shadow.mapSize.height = 2048
        light.shadow.camera.near = 0.1
        light.shadow.camera.far = 500.0
        light.shadow.camera.near = 0.5
        light.shadow.camera.far = 500.0
        light.shadow.camera.left = 100
        light.shadow.camera.right = -100
        light.shadow.camera.top = 100
        light.shadow.camera.bottom = -100
        this.parent.scene.add(light)
    }
    ambientLightSetup(color = 0x101010) {
        let light = new this.THREE.AmbientLight(color)
        this.parent.scene.add(light)
    }
}
export {Lights}