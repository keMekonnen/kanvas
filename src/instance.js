import {Kanvas} from './annex.js'
import { ThirdPersonCamera } from './cameras.js'
let instance = new Kanvas(true)
instance.run = () => {
    instance.init()
    instance.gui.addBasicP('time', 40, 20)
    instance.FBX.loadAnimatedFBX('players', undefined, '../resources/xbot/xbot.fbx', 
    {
        'idle': '../resources/xbot/Standing Idle.fbx',
        'froWalk': '../resources/xbot/Walking.fbx',
        'backWalk': '../resources/xbot/Walking Backwards.fbx',
    }, 
    instance.cCon, ThirdPersonCamera)
    //instance.FBX.loadStaticFBX('../resources/skybox/02/hothSky.fbx', 'staticObjs')
    instance.lights.ambientLightSetup()
    instance.lights.directionalLightSetup()
    instance.skyboxSetup()
    instance.terr = new instance.terrain(instance.three, {segs:100})
    instance.entities.ground.verts = instance.terr.geom.vertices
    instance.scene.add(instance.terr.plane)
    instance.RAF()
}
instance.RAF = (t) => {
    instance.threejs.render(instance.scene, instance.camera)
    //if(instance.phy) {instance.phy.Update(t, instance.clock.getDelta())}
    instance.Step()
    for(let controller in instance.controllers){
        instance.controllers[controller].Update(t, instance.input)
    }
    requestAnimationFrame(instance.RAF)
}

instance.run()
