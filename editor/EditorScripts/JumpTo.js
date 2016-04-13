//Name of the Object you'd like to jump to.
var targetName = "1b";
var targetPos;

function init( event ){

	targetPos = scene.getObjectByName(targetName).position;
}

//Click/Touch Start
function rayStart( event ) {	

	camera.position.set(targetPos.x, targetPos.y, targetPos.z);
}

