//Name of the skybox & object who's position you'd like to jump to
var targetName = "1b";
var targetPos;

function init( event ){

	targetPos = scene.getObjectByName(targetName).position;

}

//Click/Touch Start
function rayStart( event ) {	

	//targetName is nessesary
	//targetPosition optional. Default value just doesn't move the camera.
	player.allPlugins['sky'].recreateSky(targetName, targetPos);	
}

