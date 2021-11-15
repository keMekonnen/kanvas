import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js'
import { Lights } from './lights.js'
import  { gui, InputCollecter } from './ui.js' 
import { FBX } from './loaders.js'
import { CharacterController } from './charControllers.js'
import { Physics } from './physics.js'
import { Terrain } from './terrain.js'
class Kanvas {
    constructor(debug, iT='st', data){
        this.three = THREE
        this.debug = debug
        this.subs(iT)
        this.mixers = {}
        this.controllers = {}

        this.loadComplete = false
        this.loadInd=0
        this.loadStack=0

        this.entityCount = 0
        this.entities = {
            'players':[],
            'staticObjs': [],
            'ground': {"verts":[]},
            'dynamicObjs': [],
            'mods':[],
            'npc': []
        }

        window.addEventListener('resize', () => {this.OnWindowResize()}, false)
    }
    subs(iT){
        this.gui = new gui()
        this.input = new InputCollecter(iT)
        this.lights = new Lights(THREE, this)
        this.cCon = CharacterController
        this.Physics = Physics
        this.terrain = Terrain
    }
    utils = {
        'log': (msg) => {
            if(this.debug) console.log(msg)
        },
        'error': (msg) => {
            if(this.debug) console.error(msg)
        },
        'once': (callback, params={}) => {
            if(!this.utils.doneFuncs.includes(callback)){
                callback(params)
                this.utils.doneFuncs.push(callback)
            }
        },
        'doneFuncs': []
    }
    init(){
        this.clock = new THREE.Clock()
        this.threejs = new THREE.WebGLRenderer({
            antialias: true,
        })
        this.threejs.shadowMap.enabled = true
        this.threejs.shadowMap.type = THREE.PCFSoftShadowMap
        this.threejs.setPixelRatio(window.devicePixelRatio)
        this.threejs.setSize(window.innerWidth, window.innerHeight)
        document.body.appendChild(this.threejs.domElement)

        this.scene = new THREE.Scene()
        this.baseCamSetup()
        this.postSubs()
    }
    postSubs(){
        this.FBX = new FBX(THREE, this)
    }
    baseCamSetup(fov = 60, aspect = window.innerWidth / window.innerHeight, near = 0.1, far = 2000, position = new THREE.Vector3(0, 0 , 0), lookAt= new THREE.Vector3(0,0,0)) {
        //{x: 25, y: 47, z: -44}
        let posCam = new THREE.Vector3(25+position.x, 47+position.y , -44+position.z)
        let cam = new THREE.PerspectiveCamera(fov, aspect, near, far)
        cam.position.set(posCam.x, posCam.y, posCam.z)
        cam.lookAt(lookAt)
        this.camera = cam
        // this.camControls = new FPSCamController(this.camera, this.comps.degToRad)
    } 
    skyboxSetup(index = '01') {
        const loader = new THREE.CubeTextureLoader()
        const texture = loader.load([
            'resources/skybox/'+index+'/posx.jpg',
            'resources/skybox/'+index+'/negx.jpg',
            'resources/skybox/'+index+'/posy.jpg',
            'resources/skybox/'+index+'/negy.jpg',
            'resources/skybox/'+index+'/posz.jpg',
            'resources/skybox/'+index+'/negz.jpg',
        ])
        this.scene.background = texture
    }

    Step() {
        const timeElapsedS = this.clock.getDelta()
        if(this.loadStack == this.loadInd){
            this.loadComplete = true
        }
        if(this.loadComplete){
            this.utils.once(this.LoadPhysics, {mega: this})
        }
        if (this.mixers) {
            for(let mixer in this.mixers){
                this.mixers[mixer].update(timeElapsedS)
            }
        }
    }
    LoadPhysics(params){
        let mega = params.mega
        mega.phy = new mega.Physics(THREE, mega)
    }
    OnWindowResize() {
        try {
            this.camera.aspect = window.innerWidth / window.innerHeight
            this.camera.updateProjectionMatrix()
            this.threejs.setSize(window.innerWidth, window.innerHeight)
            // this.camControls.setScreen(window.innerWidth, window.innerHeight)
            // this.gui.elements.screen.innerText='width:'+window.innerWidth+ ' height:'+window.innerHeight
        }
        catch (err) {
            this.utils.log('window resize fail')
            this.utils.error(err)
        }
    }
}

export {Kanvas, THREE}