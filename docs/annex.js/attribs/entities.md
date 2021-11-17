> specialised sublasses are those whith too many parts to add in with the rest.
---
# entities
**pre-init**

object containing all the entities loaded into an instance

## player **List{*object*}**
a list containing all the player classes
the player class contains:
- ### name
    the name of the entity, its defaulted to the entity count when the object was loaded
- ### mesh
    the [THREE.Group](https://threejs.org/docs/#api/en/objects/Group) class that was imported
- ### animClips
    an object of all the [THREE.AnimationMixer](https://threejs.org/docs/#api/en/animation/AnimationClip)s imported for the player
- ### meshes
    a list of all the [THREE.Mesh](https://threejs.org/docs/#api/en/objects/Mesh)es in the [THREE.Group](https://threejs.org/docs/#api/en/objects/Group)
- ### isGrounded
    boolean that tells the physics wether or not the object is currently grounded

## ground *object*
an object that keeps track of the terrain
it contains
- ### verts
    list of all the verts that make up the terrain
- ### pos
    the world position of the center of the terrain
- ### w
    the width of the terrain in inworld units
- ### wS
    the number of width segments
- ### h
    the height of the terrain in inworld units
- ### hS
    the number of height segments

> **THE FOLLOWING ARE CURRENTLY UNDER CONSTRUCTION**

## staticObjs **List{*object*}**
a list that contains the objects for staic entities 

## dynamicObjs **List{*object*}**
a list that contains the objects for dynamic entities (objects affected by forces and gravity)

## mobs **List{*object*}**
a list that contains the objects for mobile entities (dynamic entities with AI)
