class gui{
    constructor() {
        this.elements = {}
        this.css = document.createElement('style')
        this.css.innerHTML = ''
    }
    addNewEll(id, attribs={},type='p'){
        const ell = document.createElement(type)
        ell.setAttribute('id', id)
        let styles=''
        for(let attrib in attribs){
            styles+= ''+attrib+':'+attribs[attrib]+';'
        }
        ell.setAttribute('style', styles)
        this.elements[id] = ell
        document.body.appendChild(ell)
    }
    addXY(){
        this.addNewEll('mouseX', {
            'background-color': '#fff',
            'color':'#000',
            'position': 'absolute',
            'top': '40px',
            'padding-right':'40px'
        }, 'p')
        this.addNewEll('mouseY', {
            'background-color': '#fff',
            'color':'#000',
            'position': 'absolute',
            'top': '80px',
            'padding-right':'40px'
        }, 'p')
    }
    updateXY(input){
        this.elements['mouseX'].innerHTML = ""+input.x
        this.elements['mouseY'].innerHTML = ""+input.y
    }
    addCSS(ell='*', attribs={}){
        let styles='{'
        for(let attrib in attribs){
            styles+= ''+attrib+':'+attribs[attrib]+';'
        }
        styles+='}'
        this.css.innerHTML+=ell+styles
        document.head.appendChild(this.css)
    }
    addBasicP(id, top, left){
        this.addNewEll(id, {'position': 'absolute', 'top': top+'px', 'left':left+'px', 'background-color':'#ffff', 'color': 'rgb(0,0,0)'}, 'p')
    }
}

/*******************************/
class standard{
    constructor() {
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            space: false,
            shift: false,
            displayEntities: false,
            rotLeft: false,
            rotRight: false
        }
        this.mouse = {
            x:0,
            y:0,
            clicked:false
        }
    }
    init(){
        document.addEventListener('keydown', (e)=>{
            let c = e.key
            if(c == 'w' || c == 'ArrowUp'){
                this.keys.forward = true
            }else if(c == 's' || c == 'ArrowDown'){
                this.keys.backward = true
            }else if(c == 'a' || c == 'ArrowLeft'){
                this.keys.left = true
            }else if(c == 'd' || c == 'ArrowRight'){
                this.keys.right = true
            }else if(c == 'Shift'){
                this.keys.shift = true   
            }else if(e.code == 'Space'){
                this.keys.space = true   
            }else if(c == 'f'){
                this.keys.displayEntities = true
            }else if(c == 'q'){
                this.keys.rotLeft = true
            }else if(c == 'e'){
                this.keys.rotRight = true
            }
        })
        document.addEventListener('keyup', (e)=>{
            let c = e.key
            if(c == 'w' || c == 'ArrowUp'){
                this.keys.forward = false
            }else if(c == 's' || c == 'ArrowDown'){
                this.keys.backward = false
            }else if(c == 'a' || c == 'ArrowLeft'){
                this.keys.left = false
            }else if(c == 'd' || c == 'ArrowRight'){
                this.keys.right = false
            }else if(c == 'Shift'){
                this.keys.shift = false  
            }else if(e.code == 'Space'){
                this.keys.space = false 
            }else if(c == 'f'){
                this.keys.displayEntities = false
            }else if(c == 'q'){
                this.keys.rotLeft = false
            }else if(c == 'e'){
                this.keys.rotRight = false
            }
        })
        document.addEventListener('mousemove', (e)=>{
            this.mouse.x = e.x
            this.mouse.y = e.y
        })
        document.addEventListener('mousedown', (e)=>{
            this.mouse.clicked = true
        })
        document.addEventListener('mouseup', (e)=>{
            this.mouse.clicked = false
        })
    }
}
class InputCollecter{
    constructor(type){
        this.types = {'st': standard}
        this.collector = new this.types[type]()
        this.collector.init()
    }
    get keys(){
        return this.collector.keys
    }
    get cursor(){
        return this.collector.mouse
    }
}

export {gui, InputCollecter}