# pre-init attribs

> pre-init are those initialized before a three.js renderer is appended to the document
---

## debug: *bool*
boolean over wether or not messages and caught errors wll be logged on the console or not. 

## mixers: *dict*
dicationary of all the [THREE.AnimationMixers]('https://threejs.org/docs/#api/en/animation/AnimationMixer') that have been initialized. it is updated per frame in the [Step]('../') method. it is initialized empty.
The mixers are stored under the entityCount when the mesh was imported.

## controllers: *dict*
similair to `kanvas.mixers`, but instead stores the controllers for all the objects initialized with a controller. 


## entityCount *int*
number of separate entities loaded into the instance