import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js'
class FBX {
    constructor(THREE, parent){
        // this.charController = charController
        this.THREE = THREE
        this.parent = parent
    }
    loadStaticFBX(path, type){
        try{
            this.parent.loadStack ++
            let loader = new FBXLoader()
            loader.load(path, (fbx) => {
                fbx.scale.setScalar(0.1)
                fbx.traverse(c => {
                  c.castShadow = true
                })    
                if(this.parent.entities[type]){
                    this.parent.entities[type].push(fbx)
                    this.parent.scene.add(fbx)
                    this.parent.loadInd++
                }
                else{
                    throw new Error('entity type: '+ type +' not supported')
                }
            })
        }
        catch(err){
            if(this.parent.debug){
                console.log(err)
            }
        }
    }
    loadAnimatedFBX(
        type='player',
        name=''+this.parent.entityCount,
        modelPath, 
        animPaths={}, 
        cCon=undefined,
        camera= undefined)
        {
            this.parent.loadStack ++
            let loader = new FBXLoader()
            loader.load(modelPath, (fbx) => {
                let meshes = []
                fbx.traverse((o) => {
                    if ( o.isMesh ) meshes.push(o)
                })
                fbx.scale.setScalar(0.1)
                fbx.traverse(c => {
                    c.castShadow = true
                })
                try {

                    let animClips = {}
                    let mixer = new this.THREE.AnimationMixer(fbx)
                    this.parent.mixers[this.parent.entityCount] = mixer
                    
                    let index = 0

                    for(let key in animPaths){
                        let animload = new FBXLoader()
                        animload.load(animPaths[key], (anim) => {
                            try{
                                let animation = mixer.clipAction(anim.animations[0])
                                animClips[key] = animation
                                index++
                                if(index == Object.keys(animPaths).length){
                                    afterAnimLoad(this.parent, meshes, animClips, this.THREE)
                                }
                            }
                            catch(err){
                                if(this.parent.debug){
                                    console.log(err)
                                }
                            }
                            
                        })
                    }
                
                }
                catch(err){
                    if(this.parent.debug){
                        console.log(err)
                    }
                }
                function afterAnimLoad(mega, meshes, animClips, three){
                    if(mega.entities[type]){
                        mega.entities[type][mega.entityCount] = {"name": name, "mesh": fbx, "animClips": animClips, "meshes":meshes, "isGrounded": true}
                        mega.scene.add(fbx)
                        if(type == 'players'){
                            let cam = new camera(mega.camera, three, mega.entities.players[mega.entityCount].mesh)
                            mega.controllers[mega.entityCount] = new cCon(mega.entityCount, mega, three, cam)
                            
                        } else if(type == 'objects'){
    
                        }
                        mega.loadInd++
                        mega.entityCount++
                    }
                }
            })
    }
        
}
export {FBX}