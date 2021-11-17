# kanvas
---
## constructor(**debug**: bool = false, **iT**: string = "st"):
debug
: boolean over wether or not messages and caught errors wll be logged on the console or not. 

iT
: Input type, for the collector.


---
## Subclasses
### pre-init
- utils
- gui
- lights
- input
- cCon
### post-init
- loaders
   - FBX


## attribs
### pre-init
- debug
- mixers
- controllers
- entityCount
- three
### post-init
- threejs
- scene
- camera
- clock
### pre-run
- terr
### specialized (have their own separate doc)
- entities 

## methods
- init
- subs
- postSubs
- baseCamSetup 
- skyboxSetup
- Step
- OnWindowResize
