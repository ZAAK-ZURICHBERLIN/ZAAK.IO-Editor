////Change the following values
//////////
//Target hover size. Uniform scaling
var size = 1.2
//Time to scale up. In seconds
//For reference: Lookat time for an action in VR is 1.1 seconds.
var startTime = 0.9;
//Time to scale back. In seconds
var endTime = 0.1;

//Those don't need to be change necessarily
//////////
//Safe initial object size to scale back at rayEnd.
var ts = new THREE.Vector3(this.scale.x, this.scale.y, this.scale.z);
var os = new THREE.Vector3(ts.x * size, ts.y * size, ts.z*size);

//First Gaze/Mouse Over
function rayHoverStart( event ) {
	player.crossHairScaling(true);
	TweenMax.to(this.scale, startTime, {x: os.x, y:os.y, z:os.z});	
}

//Gaze/Mouse/Touch End
function rayEnd( event ) {
	player.crossHairScaling(false);
	TweenMax.to(this.scale, endTime, {x: ts.x, y:ts.y, z:ts.z});
}
